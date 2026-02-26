// import { useState, useEffect } from "react";
// import { getMyBusinessApi } from "../services/salonService";

// const MyAdminSalon = () => {
//     const [salon, setSalon] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchMySalon = async () => {
//             try {
//                 setLoading(true);
//                 const data = await getMyBusinessApi();
//                 setSalon(data);
//             } catch (err) {
//                 setError("Failed to fetch your salon details. Please ensure you are an authorized admin.");
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMySalon();
//     }, []);

//     if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Your Salon Profile...</div>;
//     if (error) return (
//         <div className="p-12 text-center">
//             <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 max-w-lg mx-auto">
//                 <span className="text-4xl mb-4 block">⚠️</span>
//                 <h3 className="font-bold text-lg mb-2">Access Error</h3>
//                 <p className="text-sm opacity-80">{error}</p>
//             </div>
//         </div>
//     );

//     if (!salon) return <div className="p-12 text-center text-slate-500">No salon data found for your account.</div>;

//     return (
//         <div className="p-8 max-w-6xl mx-auto">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
//                 <div>
//                     <div className="flex items-center gap-3 mb-2">
//                         <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-tighter shadow-sm shadow-indigo-200">
//                             Official Business Profile
//                         </span>
//                     </div>
//                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">{salon.name}</h1>
//                     <p className="text-slate-500 font-medium">Manage your salon's digital presence and platform identity</p>
//                 </div>

//                 <div className="flex flex-wrap gap-3">
//                     <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${salon.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
//                         }`}>
//                         <span className="text-lg">{salon.verificationStatus === 'VERIFIED' ? '✅' : '⏳'}</span>
//                         <span className="text-xs font-bold uppercase tracking-widest">{salon.verificationStatus}</span>
//                     </div>
//                     <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${salon.domainStatus === 'ACTIVE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-700 border-slate-100'
//                         }`}>
//                         <span className="text-lg">🌐</span>
//                         <span className="text-xs font-bold uppercase tracking-widest">Domain: {salon.domainStatus}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//                 {/* Primary Content Column */}
//                 <div className="lg:col-span-2 space-y-8">

//                     {/* Visual Content Card */}
//                     <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
//                         <div className="h-64 bg-slate-200 relative group">
//                             {salon.bannerImageUrl ? (
//                                 <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-slate-300 font-black bg-gradient-to-br from-slate-50 to-slate-200 select-none">
//                                     BANNER IMAGE NOT SET
//                                 </div>
//                             )}
//                             <button className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
//                                 <span>📷</span> Change Banner
//                             </button>
//                         </div>

//                         <div className="p-10">
//                             <div className="flex items-start gap-10">
//                                 <div className="flex-1">
//                                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">About the Business</h3>
//                                     <p className="text-slate-900 leading-relaxed font-medium text-lg italic">
//                                         "{salon.description}"
//                                     </p>

//                                     <div className="mt-8 flex flex-wrap gap-2">
//                                         {salon.metaKeywords.split(',').map((kw, i) => (
//                                             <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 uppercase">
//                                                 {kw.trim()}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div className="w-px h-32 bg-slate-100 hidden md:block"></div>

//                                 <div className="w-full md:w-64 space-y-5">
//                                     <div>
//                                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Registration</p>
//                                         <p className="text-sm font-mono font-bold text-slate-900">{salon.registrationNumber}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Platform URL</p>
//                                         <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline break-all">
//                                             {salon.domainName}
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Grid for Smaller Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Contact & Location */}
//                         <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
//                             <div className="flex items-center justify-between mb-8">
//                                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Connect</h3>
//                                 <span className="text-indigo-600 p-2 bg-indigo-50 rounded-xl">📍</span>
//                             </div>
//                             <div className="space-y-6">
//                                 <div>
//                                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Business Address</p>
//                                     <p className="text-slate-900 font-bold">{salon.address}</p>
//                                     <p className="text-slate-500 text-sm font-medium">{salon.city}, {salon.state}</p>
//                                     <p className="text-slate-400 text-xs">{salon.country} (CP: {salon.postalCode})</p>
//                                 </div>
//                                 <div className="flex flex-col gap-4">
//                                     <div className="flex items-center gap-3">
//                                         <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-sm">📞</span>
//                                         <span className="font-bold text-slate-800">{salon.phoneNumber}</span>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                         <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-sm">✉️</span>
//                                         <span className="font-bold text-slate-800 break-all">{salon.email}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Mapped Categories */}
//                         <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
//                             <div className="flex items-center justify-between mb-8">
//                                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Categories</h3>
//                                 <span className="text-indigo-600 p-2 bg-indigo-50 rounded-xl">🎯</span>
//                             </div>
//                             <div className="space-y-3">
//                                 {salon.categories.map((cat) => (
//                                     <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
//                                         <div className="flex items-center gap-3">
//                                             <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">✨</span>
//                                             <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
//                                         </div>
//                                         <span className="opacity-0 group-hover:opacity-100 transition-opacity">➡️</span>
//                                     </div>
//                                 ))}
//                                 {salon.categories.length === 0 && (
//                                     <p className="text-center text-slate-400 py-4 italic">No categories assigned</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Action / Stats Sidebar */}
//                 <div className="space-y-8">

//                     {/* Realtime Performance */}
//                     <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
//                         <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20"></div>

//                         <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 text-center">Business Health</h3>

//                         <div className="space-y-8 relative z-10">
//                             <div className="flex items-center justify-between group">
//                                 <div className="text-center flex-1">
//                                     <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{salon.averageRating.toFixed(1)}</p>
//                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Average Rating</p>
//                                 </div>
//                                 <div className="w-px h-12 bg-white/10"></div>
//                                 <div className="text-center flex-1">
//                                     <p className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">{salon.totalReviews}</p>
//                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Total Reviews</p>
//                                 </div>
//                             </div>

//                             <div className="pt-8 border-t border-white/5 space-y-6">
//                                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
//                                     <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Bookings</span>
//                                     <span className="text-2xl font-black">{salon.totalBookings}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors">
//                                     <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">QR Scans</span>
//                                     <span className="text-2xl font-black">{salon.qrCodeScanCount}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* QR Code Presence */}
//                     <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white text-center shadow-xl shadow-indigo-100 group">
//                         <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-indigo-200">Customer Intake QR</h3>
//                         <div className="w-40 h-40 bg-white mx-auto rounded-[2rem] mb-6 flex items-center justify-center p-3 shadow-inner transform group-hover:scale-105 transition-transform duration-500">
//                             {salon.qrCodeUrl ? (
//                                 <img src={salon.qrCodeUrl} alt="QR Code" className="w-full h-full" />
//                             ) : (
//                                 <span className="text-5xl animate-bounce">📱</span>
//                             )}
//                         </div>
//                         <p className="text-xs font-bold leading-relaxed mb-8 text-indigo-100">
//                             Scan to view your digital business profile instantly
//                         </p>
//                         <div className="space-y-3">
//                             <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
//                                 Download QR Pack
//                             </button>
//                             <button className="w-full bg-indigo-700/50 text-white/80 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-800 transition-all">
//                                 Reset URL Analytics
//                             </button>
//                         </div>
//                     </div>

//                     {/* Admin Metadata */}
//                     <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
//                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ownership Metadata</p>
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-xs text-slate-500">Admin Name</span>
//                                 <span className="text-xs font-bold text-slate-900">{salon.adminName}</span>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <span className="text-xs text-slate-500">Admin ID</span>
//                                 <span className="text-xs font-bold text-slate-900">#00{salon.adminId}</span>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <span className="text-xs text-slate-500">Last Synced</span>
//                                 <span className="text-xs font-bold text-slate-900">{salon.updatedAt.split(' ')[0]}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default MyAdminSalon;

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

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 animate-pulse">Loading Your Salon Profile...</div>
        </div>
    );
    
    if (error) return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 max-w-lg mx-auto text-center">
                <span className="text-4xl mb-4 block">⚠️</span>
                <h3 className="font-semibold text-lg mb-2">Access Error</h3>
                <p className="text-sm opacity-80">{error}</p>
            </div>
        </div>
    );

    if (!salon) return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500">No salon data found for your account.</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen text-gray-900 font-sans">
            {/* Page Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{salon.name}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                salon.verificationStatus === 'VERIFIED' 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {salon.verificationStatus}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            Admin: <span className="font-medium text-gray-700">{salon.adminName}</span> ({salon.email})
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
                            Edit Details
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                            Public View
                        </button>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Overview & Services */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Overview Card */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            Business Overview
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Description</p>
                                <p className="text-gray-700 leading-relaxed">{salon.description}</p>
                            </div>
                            
                            {/* Banner Image */}
                            <div className="rounded-lg overflow-hidden bg-gray-100 h-48 relative">
                                {salon.bannerImageUrl ? (
                                    <img src={salon.bannerImageUrl} alt="Banner" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200">
                                        BANNER IMAGE NOT SET
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Registration Number</p>
                                    <p className="text-gray-900 font-semibold">{salon.registrationNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Business Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        salon.domainStatus === 'ACTIVE' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {salon.domainStatus}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Phone</p>
                                    <p className="text-gray-900 font-semibold">{salon.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Email</p>
                                    <p className="text-gray-900 font-semibold">{salon.email}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Performance Metrics */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">Rating</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold">{salon.averageRating?.toFixed(1) || '0.0'}</span>
                                <div className="flex text-gray-300">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
                            <p className="text-2xl font-bold mt-1 text-gray-900">{salon.totalReviews || 0}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">Bookings</p>
                            <p className="text-2xl font-bold mt-1 text-gray-900">{salon.totalBookings || 0}</p>
                        </div>
                    </section>

                    {/* Categories */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Target Audience & Categories
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {salon.categories?.map((cat) => (
                                <span key={cat.id} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                                    {cat.name}
                                </span>
                            ))}
                            {(!salon.categories || salon.categories.length === 0) && (
                                <p className="text-gray-400 text-sm">No categories assigned</p>
                            )}
                        </div>
                    </section>

                    {/* SEO Information */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            SEO Configuration
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Meta Description</p>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                                    {salon.description}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Keywords</p>
                                <div className="flex flex-wrap gap-2">
                                    {salon.metaKeywords?.split(',').map((kw, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 font-medium rounded border border-blue-200">
                                            {kw.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Domain & Location */}
                <div className="space-y-6">
                    {/* Domain & QR Card */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            Domain & QR
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Primary Domain</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-blue-600 font-semibold">{salon.domainName}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        salon.domainStatus === 'ACTIVE' 
                                            ? 'text-green-600 bg-green-50' 
                                            : 'text-gray-600 bg-gray-50'
                                    }`}>
                                        {salon.domainStatus}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Full URL</p>
                                <a href={salon.fullDomainUrl} target="_blank" rel="noreferrer" 
                                   className="text-sm text-gray-500 hover:text-blue-600 transition-colors truncate block">
                                    {salon.fullDomainUrl}
                                </a>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex flex-col items-center py-4">
                                <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center mb-3">
                                    {salon.qrCodeUrl ? (
                                        <img src={salon.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <>
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                            </svg>
                                            <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">QR Code</span>
                                        </>
                                    )}
                                </div>
                                <button className="text-xs font-semibold text-blue-600 hover:underline">
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Location Card */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                                Location Details
                            </h2>
                            <div className="space-y-1">
                                <p className="text-gray-900 font-semibold">{salon.city}, {salon.state}</p>
                                <p className="text-sm text-gray-500">{salon.country}, {salon.postalCode}</p>
                                <p className="text-sm text-gray-600 mt-2">{salon.address}</p>
                            </div>
                        </div>
                        {/* Map Placeholder */}
                        <div className="h-48 bg-gray-100 relative flex items-center justify-center border-t border-gray-100">
                            <img 
                                alt="Map Preview" 
                                className="object-cover w-full h-full opacity-60"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkWvVeTaoqoxGv-fii5uOCQIsV9aZOdTrCuNOtiERQgH3v_xR9CDCW9csaOZDx_e1LB8B2wGYm8i8SFkMpx7BFhG2QMKpY2W8jn5QEOmqyZOho-HbvDkelajURM48dJv-V_hXjwuxZ_gHViSZ64_UZMNj62PFIdQPwxEeo8-RY1Kp5uB0eWg254-dln8XSaXlrfglS7NWcX1zmetPq8sQRNV0jtEQyTGdMJmWejgfUXiO9n8JXlS0wy_UahwBeT9anN1KCT6QCgv0"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/5 hover:bg-transparent transition-colors">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Admin Metadata */}
                    <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Ownership Metadata</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Admin Name</span>
                                <span className="text-xs font-semibold text-gray-900">{salon.adminName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Admin ID</span>
                                <span className="text-xs font-semibold text-gray-900">#{salon.adminId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Last Synced</span>
                                <span className="text-xs font-semibold text-gray-900">
                                    {salon.updatedAt?.split(' ')[0] || new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400">
                    © 2024 {salon.name} Management Dashboard. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default MyAdminSalon;