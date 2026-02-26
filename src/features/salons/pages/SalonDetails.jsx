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

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Salon Profile...</div>;
  if (error) return (
    <div className="p-12 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header / Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
        >
          ⬅️
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{salon.name}</h1>
          <p className="text-slate-500">Business Profile & Verification Details</p>
        </div>
        <div className="ml-auto flex gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                salon.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {salon.verificationStatus}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                salon.domainStatus === 'ACTIVE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-700 border-slate-100'
            }`}>
              Domain: {salon.domainStatus}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-48 bg-slate-200 relative">
                {salon.bannerImageUrl ? (
                    <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-gradient-to-br from-slate-100 to-slate-200">
                        No Banner Image Provided
                    </div>
                )}
            </div>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Business Description</h3>
                        <p className="text-slate-700 leading-relaxed italic">"{salon.description}"</p>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Registration #</span>
                            <span className="font-mono font-semibold text-slate-900">{salon.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Email Address</span>
                            <span className="font-semibold text-slate-900 underline decoration-indigo-200">{salon.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Phone Number</span>
                            <span className="font-semibold text-slate-900">{salon.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400">Created At</span>
                            <span className="font-semibold text-slate-600">{salon.createdAt}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Location & Domain Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    📍 Location Details
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-slate-900 font-medium">{salon.address}</p>
                        <p className="text-slate-500">{salon.city}, {salon.state}</p>
                        <p className="text-slate-500">{salon.country} - {salon.postalCode}</p>
                    </div>
                    <div className="flex justify-between px-2">
                        <span className="text-slate-400">Coordinates</span>
                        <span className="text-xs font-mono text-slate-600">{salon.latitude.toFixed(4)}, {salon.longitude.toFixed(4)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    🌐 Domain & SEO
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Domain URL</label>
                        <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" className="block text-indigo-600 font-semibold truncate hover:underline">
                            {salon.domainName}
                        </a>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Meta Description</label>
                        <p className="text-xs text-slate-600 line-clamp-2">{salon.metaDescription}</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Keywords</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {salon.metaKeywords.split(',').map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md font-medium">
                                    {kw.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Mapped Categories</h3>
            <div className="flex flex-wrap gap-3">
                {salon.categories.map((cat) => (
                    <div key={cat.id} className="px-5 py-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center gap-3 group hover:bg-indigo-50 transition-colors">
                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">🎯</span>
                        <span className="font-bold text-indigo-700 text-sm">{cat.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Admin & Stats */}
        <div className="space-y-8">
            
            {/* Admin Info */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Primary Administrator</h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-bold border border-white/5">
                        {salon.adminName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-lg">{salon.adminName}</p>
                        <p className="text-slate-400 text-xs">Admin ID: #{salon.adminId}</p>
                    </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-xs text-slate-400">Direct Contact</p>
                    <p className="text-sm font-medium truncate">{salon.adminEmail}</p>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Engagement Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-slate-900">{salon.averageRating.toFixed(1)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Rating</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-slate-900">{salon.totalReviews}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Reviews</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-slate-900">{salon.totalBookings}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Bookings</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-slate-900">{salon.qrCodeScanCount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">QR Scans</p>
                    </div>
                </div>
            </div>

            {/* QR Section */}
            <div className="bg-indigo-600 p-8 rounded-3xl text-white text-center shadow-lg shadow-indigo-100">
                <h3 className="text-xs font-bold text-indigo-200 uppercase mb-4 tracking-widest">Digital Presence</h3>
                <div className="w-32 h-32 bg-white mx-auto rounded-2xl mb-4 flex items-center justify-center p-2">
                    {salon.qrCodeUrl ? (
                        <img src={salon.qrCodeUrl} alt="QR Code" />
                    ) : (
                        <span className="text-slate-300 transform scale-150">📱</span>
                    )}
                </div>
                <p className="text-[10px] font-bold opacity-80 uppercase mb-4">Verification QR Code</p>
                <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter hover:bg-indigo-50 transition-colors">
                    Reset Domain Cache
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SalonDetails;
