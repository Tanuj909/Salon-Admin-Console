import React, { useEffect, useRef, useState } from 'react';

const LocationPickerMap = ({ initialLat = 28.6139, initialLng = 77.2090, onLocationSelect, onConfirm, onClose }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const initMap = () => {
            if (!mapRef.current) return;
            if (mapInstanceRef.current) return; // Already initialized

            const L = window.L;
            if (!L) return;

            if (isMounted) setIsLoading(false);

            // Initialize map
            const map = L.map(mapRef.current, {
                center: [initialLat, initialLng],
                zoom: 15,
                zoomControl: true
            });
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map);

            const marker = L.marker([initialLat, initialLng], {
                draggable: true
            }).addTo(map);
            markerRef.current = marker;

            // Handlers
            marker.on('dragend', function () {
                const position = marker.getLatLng();
                if (onLocationSelect) onLocationSelect(position.lat, position.lng);
            });

            map.on('click', function (e) {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                if (onLocationSelect) onLocationSelect(lat, lng);
            });

            // Force layout recalculation after a short delay to ensure it renders correctly
            setTimeout(() => {
                if (mapInstanceRef.current && isMounted) {
                    mapInstanceRef.current.invalidateSize();
                }
            }, 300);
        };

        const loadLeaflet = () => {
            if (window.L) {
                initMap();
                return;
            }

            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (!document.getElementById('leaflet-js')) {
                const script = document.createElement('script');
                script.id = 'leaflet-js';
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => {
                    if (isMounted) initMap();
                };
                document.head.appendChild(script);
            } else {
                // Script tag exists but window.L might not be ready yet
                const checkInterval = setInterval(() => {
                    if (window.L) {
                        clearInterval(checkInterval);
                        if (isMounted) initMap();
                    }
                }, 100);
                setTimeout(() => clearInterval(checkInterval), 5000); // 5s timeout
            }
        };

        loadLeaflet();

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [initialLat, initialLng, onLocationSelect]);

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                updateMapLocation(lat, lng);
            });
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Error searching location:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const updateMapLocation = (lat, lng) => {
        const numLat = parseFloat(lat);
        const numLng = parseFloat(lng);
        if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([numLat, numLng], 16);
            markerRef.current.setLatLng([numLat, numLng]);
        }
        if (onLocationSelect) onLocationSelect(numLat, numLng);
        setShowResults(false);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const { lat, lng } = markerRef.current.getLatLng();
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            const data = await response.json();
            
            if (onConfirm) {
                onConfirm(lat, lng, data.address || {});
            }
        } catch (error) {
            console.error("Error fetching address details:", error);
            if (onConfirm) {
                const { lat, lng } = markerRef.current.getLatLng();
                onConfirm(lat, lng, null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-5xl h-[85vh] sm:h-[80vh] rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col bg-slate-50">
                
                {/* Search Header Overlay */}
                <div className="absolute top-16 sm:top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[500]">
                    <div className="relative shadow-2xl">
                        <input 
                            type="text" 
                            placeholder="Search for your salon's address..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => { if(searchResults.length > 0) setShowResults(true); }}
                            className="w-full h-14 pl-5 pr-14 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 outline-none focus:border-gold text-black-deep text-sm font-bold shadow-lg"
                        />
                        <button 
                            type="button" 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="absolute right-2 top-2 bottom-2 w-10 bg-gold text-black-deep rounded-xl flex items-center justify-center hover:bg-gold/80 transition-all disabled:opacity-50"
                        >
                            {isSearching ? (
                                <div className="w-4 h-4 border-2 border-black-deep/20 border-t-black-deep rounded-full animate-spin"></div>
                            ) : (
                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            )}
                        </button>

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                                {searchResults.map((result, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => updateMapLocation(result.lat, result.lon)}
                                        className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                    >
                                        <p className="text-xs font-bold text-black-deep truncate">{result.display_name.split(',')[0]}</p>
                                        <p className="text-[10px] text-secondary truncate mt-1">{result.display_name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Close Button */}
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-white/90 backdrop-blur-md text-black-deep rounded-full flex items-center justify-center shadow-xl hover:bg-black-deep hover:text-white transition-all z-[500] border border-slate-200 cursor-pointer"
                    title="Close Map"
                >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Leaflet Map Container */}
                <div ref={mapRef} className="flex-1 w-full z-0 bg-slate-100" onClick={() => setShowResults(false)}></div>
                
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-10">
                        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black text-black-deep uppercase tracking-[0.2em]">Loading Map Engine...</p>
                    </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto flex flex-col sm:flex-row gap-3 z-[500]">
                    <div className="hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200">
                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black-deep">Drag pin or click</span>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="flex-1 sm:flex-none px-6 py-4 sm:py-3 bg-white/95 backdrop-blur-md text-black-deep font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-xl border border-slate-200 cursor-pointer"
                    >
                        Use GPS
                    </button>
                    
                    <button 
                        type="button"
                        onClick={handleConfirm}
                        className="flex-1 sm:flex-none px-8 py-4 sm:py-3 bg-black-deep text-gold font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer border border-white/10"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerMap;
