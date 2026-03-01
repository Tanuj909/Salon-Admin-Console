import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSalonByIdApi } from "../services/salonService";

const SalonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalon = async () => {
            try {
                setLoading(true);
                const data = await getSalonByIdApi(id);
                setSalon(data);
            } catch (err) {
                setError("Failed to fetch salon details. It might not exist.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSalon();
    }, [id]);

    if (loading) return (
        <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4"></div>
            <div className="text-secondary font-medium tracking-wider uppercase text-xs">Loading Salon Profile...</div>
        </div>
    );

    if (error) return (
        <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] flex items-center justify-center">
            <div className="bg-red-50 max-w-lg mx-auto p-8 text-center border border-red-100 rounded-3xl shadow-sm">
                <span className="text-4xl mb-4 block">⚠️</span>
                <h3 className="text-red-600 font-bold text-lg mb-2">Error</h3>
                <p className="text-slate-500 text-sm mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors uppercase tracking-widest text-[10px]">
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!salon) return null;

    return (
        <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 bg-transparent max-w-5xl">

                {/* Header / Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 border-b border-gold/10 pb-6">
                    <div className="flex items-start md:items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-black-deep hover:bg-slate-50 hover:border-slate-300 transition-all bg-white shadow-sm shrink-0"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <div>
                            <h1 className="font-display text-4xl italic text-black-deep mb-2 flex items-center gap-4 flex-wrap">
                                {salon.name}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${salon.verificationStatus === 'VERIFIED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${salon.verificationStatus === 'VERIFIED' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span> {salon.verificationStatus}
                                </span>
                            </h1>
                            <p className="text-secondary text-sm">Business Profile & Verification Details.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-100 transition-colors uppercase tracking-widest text-[10px]">
                            Suspend
                        </button>
                        <button className="px-6 py-3 bg-gold text-white shadow-lg shadow-gold/20 font-bold rounded-xl hover:bg-gold/90 transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            Verify
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Left Column: Essential Info */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Main Info Card */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden group">
                            <div className="h-64 bg-slate-100 relative overflow-hidden">
                                {salon.bannerImageUrl ? (
                                    <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-gradient-to-br from-slate-50 to-slate-100/50">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2 opacity-30"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black-deep/60 to-transparent"></div>
                            </div>
                            <div className="p-8 relative -mt-8 bg-white rounded-t-[32px]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                            Business Description
                                        </h3>
                                        <p className="text-secondary leading-relaxed italic text-sm">{salon.description || "No description provided."}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b border-slate-50 pb-3 text-sm">
                                            <span className="text-slate-500">Registration #</span>
                                            <span className="font-mono font-bold text-black-deep bg-slate-50 px-2 py-0.5 rounded">{salon.registrationNumber}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-50 pb-3 text-sm">
                                            <span className="text-slate-500">Official Email</span>
                                            <span className="font-bold text-gold hover:underline cursor-pointer">{salon.email}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-50 pb-3 text-sm">
                                            <span className="text-slate-500">Contact Phone</span>
                                            <span className="font-bold text-black-deep">{salon.phoneNumber}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-50 pb-3 text-sm">
                                            <span className="text-slate-500">On-boarded Date</span>
                                            <span className="font-bold text-slate-500">{salon.createdAt?.split('T')[0] || "Unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 hover:border-gold/30 transition-colors">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    Location Details
                                </h3>
                                <div className="p-5 bg-[#FDFBF7] border border-gold/10 rounded-2xl relative overflow-hidden h-[120px] flex flex-col justify-center">
                                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="absolute -right-4 -bottom-4 text-gold/10"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    <p className="text-black-deep font-bold text-base relative z-10 leading-snug">{salon.address}</p>
                                    <p className="text-secondary text-sm mt-1 relative z-10">{salon.city}, {salon.state}</p>
                                    <div className="inline-flex mt-3 bg-white px-2 py-1 rounded text-[10px] uppercase font-bold text-slate-500 border border-slate-200 w-max shadow-sm relative z-10">
                                        {salon.country} (CP: {salon.postalCode})
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 hover:border-gold/30 transition-colors">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                    Domain Identity
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary Domain</label>
                                        <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-gold font-bold truncate hover:bg-gold/5 transition-colors text-sm group">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                            {salon.domainName || "No custom domain"}
                                        </a>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Keywords</label>
                                        <div className="flex flex-wrap gap-2">
                                            {salon.metaKeywords ? salon.metaKeywords.split(',').map((kw, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] rounded-lg font-bold uppercase tracking-wider border border-slate-100 hover:border-slate-300 transition-colors">
                                                    {kw.trim()}
                                                </span>
                                            )) : <span className="text-secondary text-sm italic">None defined</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                                Mapped Categories
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {salon.categories && salon.categories.length > 0 ? salon.categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] text-gold border border-gold/20 rounded-xl font-bold text-sm shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                        {cat.name}
                                    </div>
                                )) : <p className="text-secondary text-sm italic">No categories mapped yet</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Admin & Stats */}
                    <div className="space-y-6">
                        <div className="bg-black-deep rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

                            <h3 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-8 relative z-10 flexItems-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="inline mr-2 -mt-0.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                Owner Identity
                            </h3>
                            <div className="flex items-center gap-5 mb-8 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-display text-2xl text-gold shadow-inner shrink-0">
                                    {salon.adminName?.charAt(0) || 'O'}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-white text-lg truncate leading-tight mb-1">{salon.adminName || 'Unknown Owner'}</p>
                                    <p className="inline-block px-2 py-0.5 bg-white/10 text-white/70 text-[9px] font-bold uppercase tracking-widest rounded">ID: #{salon.adminId}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative z-10 backdrop-blur-sm">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Contact</p>
                                <p className="text-sm font-medium text-white/90 truncate flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    {salon.adminEmail || salon.email}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                Business Metrics
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-gold/10 hover:shadow-md hover:-translate-y-1 transition-all">
                                    <p className="text-3xl font-display font-bold text-black-deep mb-1">{salon.averageRating?.toFixed(1) || '0.0'}</p>
                                    <p className="text-[9px] font-bold text-gold uppercase tracking-widest">Rating</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all">
                                    <p className="text-3xl font-display font-bold text-black-deep mb-1">{salon.totalReviews || 0}</p>
                                    <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Reviews</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all">
                                    <p className="text-3xl font-display font-bold text-black-deep mb-1">{salon.totalBookings || 0}</p>
                                    <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Bookings</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all">
                                    <p className="text-3xl font-display font-bold text-black-deep mb-1">{salon.qrCodeScanCount || 0}</p>
                                    <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Scans</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 border-dashed p-8 text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')]">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-500 bg-white inline-block px-2">Access Key Profile</h3>
                            <div className="w-36 h-36 bg-white mx-auto rounded-[20px] mb-6 flex items-center justify-center p-3 border border-slate-200 shadow-sm relative group">
                                {salon.qrCodeUrl ? (
                                    <>
                                        <img src={salon.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain relative z-10" />
                                        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px] flex items-center justify-center backdrop-blur-[1px] cursor-pointer">
                                            <span className="bg-white text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">Enlarge</span>
                                        </div>
                                    </>
                                ) : (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><rect x="7" y="7" width="3" height="3" /><rect x="14" y="7" width="3" height="3" /><rect x="7" y="14" width="3" height="3" /><rect x="14" y="14" width="3" height="3" /></svg>
                                )}
                            </div>
                            <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-black-deep hover:border-slate-300 transition-all uppercase tracking-widest text-[10px] shadow-sm flex items-center justify-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                                Regenerate Profile
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SalonDetails;
