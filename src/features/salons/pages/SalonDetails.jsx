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
    <div className="page active">
        <div className="text-center py-20 text-slate-400 animate-pulse">Loading Salon Profile...</div>
    </div>
  );
  
  if (error) return (
    <div className="page active">
        <div className="admin-card max-w-lg mx-auto mt-12 p-8 text-center border-red-100">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-red-600 font-bold text-lg mb-2">Error</h3>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="admin-btn admin-btn-primary">Go Back</button>
        </div>
    </div>
  );

  if (!salon) return null;

  return (
    <div className="page active">
      {/* Header / Navigation */}
      <div className="admin-page-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'}}>
        <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate(-1)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{width: '32px', height: '32px', padding: '0', justifyContent: 'center'}}
            >
                ‹
            </button>
            <div>
                <h1 className="flex items-center gap-3">
                    {salon.name}
                    <span className={`status-badge ${salon.verificationStatus === 'VERIFIED' ? 'verified' : 'pending'}`} style={{fontSize: '10px'}}>
                        {salon.verificationStatus}
                    </span>
                </h1>
                <p>Business Profile & Verification Details.</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="admin-btn admin-btn-red">Suspend Business</button>
            <button className="admin-btn admin-btn-primary">Verify Documentation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Essential Info */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="admin-card overflow-hidden">
            <div className="h-56 bg-slate-100 relative group">
                {salon.bannerImageUrl ? (
                    <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold bg-gradient-to-br from-slate-50 to-slate-100">
                        No Banner Provided
                    </div>
                )}
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Business Description</h3>
                        <p className="text-slate-700 leading-relaxed italic text-sm">"{salon.description}"</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">Registration #</span>
                            <span className="font-mono font-bold text-slate-900">{salon.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">Official Email</span>
                            <span className="font-bold text-[#4a7cf7]">{salon.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">Contact Phone</span>
                            <span className="font-bold text-slate-900">{salon.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                            <span className="text-slate-400">On-boarded Date</span>
                            <span className="font-bold text-slate-600">{salon.createdAt?.split('T')[0]}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-card p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    📍 Location Details
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-900 font-bold text-sm">{salon.address}</p>
                        <p className="text-slate-500 text-xs mt-1">{salon.city}, {salon.state}</p>
                        <p className="text-slate-400 text-[10px] uppercase font-bold mt-2">{salon.country} (CP: {salon.postalCode})</p>
                    </div>
                </div>
            </div>

            <div className="admin-card p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    🌐 Domain Identity
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Domain</label>
                        <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" className="block text-[#4a7cf7] font-bold truncate hover:underline text-sm">
                            {salon.domainName}
                        </a>
                    </div>
                    <div className="pt-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Keywords</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {salon.metaKeywords?.split(',').map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] rounded font-bold uppercase">
                                    {kw.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="admin-card p-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Mapped Categories</h3>
            <div className="flex flex-wrap gap-2">
                {salon.categories?.map((cat) => (
                    <div key={cat.id} className="status-badge active" style={{padding: '6px 14px', borderRadius: '12px'}}>
                        {cat.name}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Admin & Stats */}
        <div className="space-y-6">
            <div className="admin-card p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4a7cf7] rounded-full blur-[80px] opacity-20"></div>
                <h3 className="text-[10px] font-bold text-[#4a7cf7] uppercase tracking-[0.2em] mb-8 text-center relative z-10">Owner Identity</h3>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="avatar" style={{width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)'}}>
                        {salon.adminName?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-white">{salon.adminName}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase">Account ID: #{salon.adminId}</p>
                    </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 relative z-10">
                    <p className="text-[9px] font-bold text-[#4a7cf7] uppercase tracking-widest mb-1">Official Email</p>
                    <p className="text-xs font-medium truncate">{salon.adminEmail || salon.email}</p>
                </div>
            </div>

            <div className="admin-card p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Business Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.averageRating?.toFixed(1) || '0.0'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Rating</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.totalReviews || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Reviews</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.totalBookings || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Bookings</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-2xl font-bold text-slate-900">{salon.qrCodeScanCount || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Scans</p>
                    </div>
                </div>
            </div>

            <div className="admin-card p-8 text-center border-dashed border-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-400">Access Key Profile</h3>
                <div className="w-32 h-32 bg-slate-50 mx-auto rounded-2xl mb-4 flex items-center justify-center p-3 border border-slate-100">
                    {salon.qrCodeUrl ? (
                        <img src={salon.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-4xl">📱</span>
                    )}
                </div>
                <button className="w-full admin-btn admin-btn-ghost admin-btn-sm justify-center">
                    Re-generate Domain
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SalonDetails;
