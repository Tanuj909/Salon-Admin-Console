import { useState, useEffect } from "react";
import { getMyBusinessApi } from "../services/salonService";

const MyAdminSalon = () => {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMySalon = async () => {
      try {
        setLoading(true);
        const data = await getMyBusinessApi();
        setSalon(data);
      } catch (err) {
        setError("Failed to fetch your salon details. Please ensure you are an authorized admin.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMySalon();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Your Salon Profile...</div>;
  if (error) return (
    <div className="p-12 text-center">
      <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 max-w-lg mx-auto">
        <span className="text-4xl mb-4 block">⚠️</span>
        <h3 className="font-bold text-lg mb-2">Access Error</h3>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    </div>
  );

  if (!salon) return <div className="p-12 text-center text-slate-500">No salon data found for your account.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-tighter shadow-sm shadow-indigo-200">
                Official Business Profile
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{salon.name}</h1>
          <p className="text-slate-500 font-medium">Manage your salon's digital presence and platform identity</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${
                salon.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
                <span className="text-lg">{salon.verificationStatus === 'VERIFIED' ? '✅' : '⏳'}</span>
                <span className="text-xs font-bold uppercase tracking-widest">{salon.verificationStatus}</span>
            </div>
            <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${
                salon.domainStatus === 'ACTIVE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-700 border-slate-100'
            }`}>
                <span className="text-lg">🌐</span>
                <span className="text-xs font-bold uppercase tracking-widest">Domain: {salon.domainStatus}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Primary Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Visual Content Card */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-64 bg-slate-200 relative group">
                {salon.bannerImageUrl ? (
                    <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-black bg-gradient-to-br from-slate-50 to-slate-200 select-none">
                        BANNER IMAGE NOT SET
                    </div>
                )}
                <button className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <span>📷</span> Change Banner
                </button>
            </div>
            
            <div className="p-10">
                <div className="flex items-start gap-10">
                    <div className="flex-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">About the Business</h3>
                        <p className="text-slate-900 leading-relaxed font-medium text-lg italic">
                            "{salon.description}"
                        </p>
                        
                        <div className="mt-8 flex flex-wrap gap-2">
                            {salon.metaKeywords.split(',').map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 uppercase">
                                    {kw.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-px h-32 bg-slate-100 hidden md:block"></div>
                    
                    <div className="w-full md:w-64 space-y-5">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Registration</p>
                            <p className="text-sm font-mono font-bold text-slate-900">{salon.registrationNumber}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Platform URL</p>
                            <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline break-all">
                                {salon.domainName}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Grid for Smaller Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact & Location */}
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Connect</h3>
                    <span className="text-indigo-600 p-2 bg-indigo-50 rounded-xl">📍</span>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Business Address</p>
                        <p className="text-slate-900 font-bold">{salon.address}</p>
                        <p className="text-slate-500 text-sm font-medium">{salon.city}, {salon.state}</p>
                        <p className="text-slate-400 text-xs">{salon.country} (CP: {salon.postalCode})</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-sm">📞</span>
                            <span className="font-bold text-slate-800">{salon.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-sm">✉️</span>
                            <span className="font-bold text-slate-800 break-all">{salon.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapped Categories */}
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Categories</h3>
                    <span className="text-indigo-600 p-2 bg-indigo-50 rounded-xl">🎯</span>
                </div>
                <div className="space-y-3">
                    {salon.categories.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">✨</span>
                                <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">➡️</span>
                        </div>
                    ))}
                    {salon.categories.length === 0 && (
                        <p className="text-center text-slate-400 py-4 italic">No categories assigned</p>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Action / Stats Sidebar */}
        <div className="space-y-8">
            
            {/* Realtime Performance */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20"></div>
                
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 text-center">Business Health</h3>
                
                <div className="space-y-8 relative z-10">
                    <div className="flex items-center justify-between group">
                        <div className="text-center flex-1">
                            <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{salon.averageRating.toFixed(1)}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Average Rating</p>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div className="text-center flex-1">
                            <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{salon.totalReviews}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Total Reviews</p>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5 space-y-6">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                            <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Bookings</span>
                            <span className="text-2xl font-black">{salon.totalBookings}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                            <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">QR Scans</span>
                            <span className="text-2xl font-black">{salon.qrCodeScanCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Presence */}
            <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white text-center shadow-xl shadow-indigo-100 group">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-indigo-200">Customer Intake QR</h3>
                <div className="w-40 h-40 bg-white mx-auto rounded-[2rem] mb-6 flex items-center justify-center p-3 shadow-inner transform group-hover:scale-105 transition-transform duration-500">
                    {salon.qrCodeUrl ? (
                        <img src={salon.qrCodeUrl} alt="QR Code" className="w-full h-full" />
                    ) : (
                        <span className="text-5xl animate-bounce">📱</span>
                    )}
                </div>
                <p className="text-xs font-bold leading-relaxed mb-8 text-indigo-100">
                    Scan to view your digital business profile instantly
                </p>
                <div className="space-y-3">
                    <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                        Download QR Pack
                    </button>
                    <button className="w-full bg-indigo-700/50 text-white/80 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-800 transition-all">
                        Reset URL Analytics
                    </button>
                </div>
            </div>

            {/* Admin Metadata */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ownership Metadata</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Admin Name</span>
                        <span className="text-xs font-bold text-slate-900">{salon.adminName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Admin ID</span>
                        <span className="text-xs font-bold text-slate-900">#00{salon.adminId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Last Synced</span>
                        <span className="text-xs font-bold text-slate-900">{salon.updatedAt.split(' ')[0]}</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MyAdminSalon;
