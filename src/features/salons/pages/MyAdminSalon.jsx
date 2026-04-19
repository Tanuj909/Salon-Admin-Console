// import { useState, useEffect } from "react";
// import { getMyBusinessApi, updateMyBusinessApi, uploadBannerApi, uploadSalonImagesApi, deleteSalonImageApi } from "../services/salonService";
// import { getHolidaysByBusinessApi, addHolidayApi, updateHolidayApi, deleteHolidayApi } from "../services/holidayService";

// // ─── Custom Hooks ────────────────────────────────────────────────────────────
// function useReveal() {
//     const [ref, setRef] = useState(null);
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         if (!ref) return;
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setVisible(true);
//                     observer.unobserve(ref);
//                 }
//             },
//             { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
//         );
//         observer.observe(ref);
//         return () => observer.disconnect();
//     }, [ref]);

//     return { setRef, visible };
// }

// function Reveal({ children, delay = 0, className = "" }) {
//     const { setRef, visible } = useReveal();
//     return (
//         <div
//             ref={setRef}
//             className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//                 } ${className}`}
//             style={{ transitionDelay: `${delay}ms` }}
//         >
//             {children}
//         </div>
//     );
// }

// function SectionHeading({ subtitle, title, description, align = "left", mb = "mb-12" }) {
//     const words = title.split(" ");
//     const lastWord = words.pop();
//     const mainTitle = words.join(" ");

//     return (
//         <div className={`${mb} ${align === "center" ? "text-center mx-auto" : ""}`}>
//             <span className="block text-[10px] tracking-[0.4em] uppercase text-gold font-semibold mb-4 opacity-90">
//                 {subtitle}
//             </span>
//             <h2
//                 className="font-display font-light text-black-deep leading-[1.1] mb-6"
//                 style={{ fontSize: "clamp(36px,5vw,52px)" }}
//             >
//                 {mainTitle}{" "}
//                 <em className="italic text-gold block md:inline">{lastWord}</em>
//             </h2>
//             {description && (
//                 <p className="text-[#7a7065] text-[15px] leading-relaxed font-light opacity-80 max-w-3xl">
//                     {description}
//                 </p>
//             )}
//         </div>
//     );
// }

// function Badge({ children, variant = "gold" }) {
//     const variants = {
//         gold: "bg-gold text-black-deep",
//         outline: "bg-transparent border border-gold text-gold",
//         glass: "backdrop-blur-md bg-white/10 text-white border border-white/20",
//         dark: "bg-black-deep text-gold",
//     };

//     return (
//         <span
//             className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide ${variants[variant]}`}
//         >
//             {children}
//         </span>
//     );
// }

// const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// const MyAdminSalon = () => {
//     const [salon, setSalon] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState("overview");

//     // Edit Modal State
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [formData, setFormData] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isUploadingBanner, setIsUploadingBanner] = useState(false);
//     const [isUploadingImages, setIsUploadingImages] = useState(false);
//     const [holidays, setHolidays] = useState([]);
//     const [holidaysLoading, setHolidaysLoading] = useState(false);

//     // Add Holiday State
//     const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
//     const [holidayFormData, setHolidayFormData] = useState({
//         holidayDate: "",
//         description: "",
//         isRepeatingYearly: false
//     });
//     const [isEditingHoliday, setIsEditingHoliday] = useState(false);
//     const [currentHolidayId, setCurrentHolidayId] = useState(null);

//     const today = DAY_NAMES[new Date().getDay()];

//     const fetchMySalon = async () => {
//         try {
//             setLoading(true);
//             const data = await getMyBusinessApi();
//             setSalon(data);
//             setFormData(data);
//             if (data?.id) fetchHolidays(data.id);
//         } catch (err) {
//             setError("Failed to fetch your salon details. Please ensure you are an authorized admin.");
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMySalon();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setIsSubmitting(true);
//             await updateMyBusinessApi(formData);
//             await fetchMySalon();
//             setIsEditModalOpen(false);
//         } catch (err) {
//             console.error("Update error:", err);
//             alert("Failed to update business details.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleBannerUpload = async (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         try {
//             setIsUploadingBanner(true);
//             await uploadBannerApi(file);
//             await fetchMySalon();
//             alert("Banner updated successfully!");
//         } catch (err) {
//             console.error("Banner upload error:", err);
//             alert("Failed to upload banner image.");
//         } finally {
//             setIsUploadingBanner(false);
//         }
//     };

//     const handleImagesUpload = async (e) => {
//         const files = Array.from(e.target.files || []);
//         if (files.length === 0) return;

//         try {
//             setIsUploadingImages(true);
//             await uploadSalonImagesApi(files);
//             await fetchMySalon();
//             alert(`${files.length} images uploaded successfully!`);
//         } catch (err) {
//             console.error("Gallery upload error:", err);
//             alert("Failed to upload gallery images.");
//         } finally {
//             setIsUploadingImages(false);
//         }
//     };

//     const handleDeleteImage = async (imageUrl) => {
//         if (!window.confirm("Are you sure you want to delete this image?")) return;

//         try {
//             await deleteSalonImageApi(imageUrl);
//             await fetchMySalon();
//             alert("Image removed successfully!");
//         } catch (err) {
//             console.error("Delete image error:", err);
//             alert("Failed to delete image.");
//         }
//     };

//     const fetchHolidays = async (businessId) => {
//         try {
//             setHolidaysLoading(true);
//             const data = await getHolidaysByBusinessApi(businessId);
//             setHolidays(data || []);
//         } catch (err) {
//             console.error("Failed to fetch holidays:", err);
//         } finally {
//             setHolidaysLoading(false);
//         }
//     };

//     const handleHolidayInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setHolidayFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleEditHoliday = (holiday) => {
//         setHolidayFormData({
//             holidayDate: holiday.holidayDate,
//             description: holiday.description,
//             isRepeatingYearly: holiday.isRepeatingYearly
//         });
//         setCurrentHolidayId(holiday.id);
//         setIsEditingHoliday(true);
//         setIsAddHolidayModalOpen(true);
//     };

//     const handleHolidaySubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setIsSubmitting(true);
//             if (isEditingHoliday) {
//                 await updateHolidayApi(currentHolidayId, holidayFormData);
//                 alert("Holiday updated successfully!");
//             } else {
//                 await addHolidayApi(salon.id, holidayFormData);
//                 alert("Holiday scheduled successfully!");
//             }
//             await fetchHolidays(salon.id);
//             setIsAddHolidayModalOpen(false);
//             setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
//             setIsEditingHoliday(false);
//             setCurrentHolidayId(null);
//         } catch (err) {
//             console.error("Holiday submit error:", err);
//             alert(`Failed to ${isEditingHoliday ? 'update' : 'schedule'} holiday.`);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleDeleteHoliday = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this holiday? This action cannot be undone.")) return;

//         try {
//             setHolidaysLoading(true);
//             await deleteHolidayApi(id);
//             await fetchHolidays(salon.id);
//             alert("Holiday deleted successfully!");
//         } catch (err) {
//             console.error("Delete holiday error:", err);
//             alert("Failed to delete holiday.");
//         } finally {
//             setHolidaysLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A";
//         const date = new Date(dateString);
//         return new Intl.DateTimeFormat('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false
//         }).format(date).replace(',', ' ·');
//     };

//     if (loading && !salon) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-beige to-cream flex flex-col items-center justify-center gap-4 font-jost">
//                 <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
//                 <p className="text-secondary text-lg">Loading your salon profile...</p>
//             </div>
//         );
//     }

//     if (error && !salon) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-beige to-cream flex items-center justify-center p-8 font-jost">
//                 <div className="bg-white/80 backdrop-blur-sm p-12 rounded-[40px] shadow-2xl max-w-lg text-center border border-gold/20">
//                     <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <span className="text-4xl">⚠️</span>
//                     </div>
//                     <h3 className="font-display text-3xl text-black-deep mb-4">Access Error</h3>
//                     <p className="text-secondary text-sm mb-8 leading-relaxed">{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="px-10 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase hover:bg-gold/80 transition-all"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     if (!salon) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-beige to-cream flex flex-col items-center justify-center gap-4 font-jost">
//                 <p className="text-secondary text-lg">No salon data found for your account.</p>
//             </div>
//         );
//     }

//     const salonImg = salon.bannerImageUrl || (salon.imageUrls && salon.imageUrls.length > 0 ? salon.imageUrls[0] : null);
//     const locationText = [salon.address, salon.city, salon.state, salon.postalCode, salon.country]
//         .filter(Boolean)
//         .join(", ") || salon.address;

//     const tabs = [
//         { id: "overview", label: "Overview", icon: "📊" },
//         { id: "gallery", label: "Gallery", icon: "🖼️" },
//         { id: "business", label: "Business", icon: "💼" },
//         { id: "contact", label: "Contact", icon: "📞" },
//         { id: "seo", label: "SEO", icon: "🔍" },
//         { id: "holidays", label: "Holidays", icon: "🎉" },
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-beige to-cream font-jost font-light">
//             {/* Hero Section */}
//             <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
//                 <div className="absolute inset-0">
//                     {salonImg && (
//                         <img
//                             src={salonImg}
//                             alt={salon.name}
//                             className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-10000"
//                         />
//                     )}
//                     <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
//                 </div>

//                 <div className="absolute inset-0 z-10 flex items-center px-8 md:px-16 lg:px-24">
//                     <div className="max-w-4xl text-white">
//                         <Reveal delay={100}>
//                             <button
//                                 onClick={() => window.history.back()}
//                                 className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-all mb-8 group"
//                             >
//                                 <svg className="group-hover:-translate-x-1 transition-transform" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                                     <path d="M19 12H5M12 19l-7-7 7-7" />
//                                 </svg>
//                                 <span className="text-xs uppercase tracking-[0.2em] font-medium">Dashboard</span>
//                             </button>
//                         </Reveal>

//                         <Reveal delay={200}>
//                             <div className="flex items-center gap-3 mb-6 flex-wrap">
//                                 {salon.verificationStatus === "VERIFIED" && (
//                                     <Badge variant="glass">
//                                         <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
//                                             <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//                                         </svg>
//                                         Verified Salon
//                                     </Badge>
//                                 )}
//                                 <Badge variant="glass">
//                                     <span className={`w-2 h-2 rounded-full ${salon.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'} mr-1`}></span>
//                                     {salon.isOpen ? "Open Now" : "Closed"}
//                                 </Badge>
//                             </div>
//                         </Reveal>

//                         <Reveal delay={300}>
//                             <h1 className="font-display font-bold leading-tight mb-4 text-white"
//                                 style={{ fontSize: "clamp(56px,8vw,96px)" }}>
//                                 {salon.name}
//                             </h1>
//                         </Reveal>

//                         <Reveal delay={400}>
//                             <div className="flex items-center gap-6 flex-wrap mb-10">
//                                 <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
//                                     <div className="flex items-center gap-1 text-gold">
//                                         <span className="text-lg font-bold">
//                                             {salon.averageRating > 0 ? salon.averageRating.toFixed(1) : "New"}
//                                         </span>
//                                         <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
//                                             <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                                         </svg>
//                                     </div>
//                                     <div className="w-px h-4 bg-white/20" />
//                                     <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
//                                         {salon.totalReviews > 0 ? `${salon.totalReviews} Reviews` : "No Reviews Yet"}
//                                     </span>
//                                 </div>

//                                 {salon.city && (
//                                     <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
//                                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
//                                             <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                                                 <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
//                                                 <circle cx="12" cy="10" r="3" />
//                                             </svg>
//                                         </div>
//                                         <span>{salon.city}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </Reveal>

//                         <Reveal delay={500}>
//                             <div className="flex gap-4 sm:gap-6 flex-wrap">
//                                 <button
//                                     onClick={() => setIsEditModalOpen(true)}
//                                     className="group relative px-10 py-5 rounded-full bg-gold text-black-deep text-sm font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
//                                 >
//                                     <span className="relative z-10">Edit Business</span>
//                                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//                                 </button>

//                                 <label className="group relative px-10 py-5 rounded-full border-2 border-white/30 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50 cursor-pointer flex items-center justify-center">
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         accept="image/*"
//                                         onChange={handleBannerUpload}
//                                         disabled={isUploadingBanner}
//                                     />
//                                     <span className="flex items-center gap-2">
//                                         {isUploadingBanner ? (
//                                             <>
//                                                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//                                                 Uploading...
//                                             </>
//                                         ) : (
//                                             "Upload Banner"
//                                         )}
//                                     </span>
//                                 </label>
//                             </div>
//                         </Reveal>
//                     </div>
//                 </div>
//             </section>

//             {/* Tab Navigation */}
//             <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gold/10">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
//                                     ? "bg-gold text-black-deep shadow-lg"
//                                     : "text-secondary hover:text-black-deep hover:bg-white/50"
//                                     }`}
//                             >
//                                 <span>{tab.icon}</span>
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Content Sections */}
//             <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//                 {activeTab === "overview" && (
//                     <Reveal>
//                         <div className="space-y-8">
//                             {/* Stats Grid */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
//                                             <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                                                 <circle cx="12" cy="7" r="4" />
//                                             </svg>
//                                         </div>
//                                         <span className="text-xs text-secondary uppercase tracking-wider">Total Bookings</span>
//                                     </div>
//                                     <p className="text-3xl font-display text-black-deep font-bold">{salon.totalBookings || 0}</p>
//                                 </div>

//                                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
//                                             <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//                                             </svg>
//                                         </div>
//                                         <span className="text-xs text-secondary uppercase tracking-wider">Average Rating</span>
//                                     </div>
//                                     <p className="text-3xl font-display text-black-deep font-bold">{salon.averageRating?.toFixed(1) || '0.0'}</p>
//                                     <div className="flex text-gold text-sm mt-2">
//                                         {"★".repeat(Math.round(salon.averageRating || 0))}{"☆".repeat(5 - Math.round(salon.averageRating || 0))}
//                                     </div>
//                                 </div>

//                                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
//                                             <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                                                 <line x1="9" y1="9" x2="15" y2="15" />
//                                                 <line x1="15" y1="9" x2="9" y2="15" />
//                                             </svg>
//                                         </div>
//                                         <span className="text-xs text-secondary uppercase tracking-wider">QR Scans</span>
//                                     </div>
//                                     <p className="text-3xl font-display text-black-deep font-bold">{salon.qrCodeScanCount || 0}</p>
//                                 </div>

//                                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
//                                             <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <circle cx="12" cy="8" r="4" />
//                                                 <path d="M5.5 20v-2a6 6 0 0 1 12 0v2" />
//                                             </svg>
//                                         </div>
//                                         <span className="text-xs text-secondary uppercase tracking-wider">Total Reviews</span>
//                                     </div>
//                                     <p className="text-3xl font-display text-black-deep font-bold">{salon.totalReviews || 0}</p>
//                                 </div>
//                             </div>

//                             {/* Business Overview and Admin */}
//                             <div className="grid lg:grid-cols-3 gap-6">
//                                 <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                                     <div className="flex items-center gap-4 mb-8">
//                                         <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
//                                             <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                                                 <line x1="9" y1="3" x2="9" y2="21" />
//                                             </svg>
//                                         </div>
//                                         <div>
//                                             <h3 className="font-display text-2xl text-black-deep">Business Overview</h3>
//                                             <p className="text-secondary text-xs">Key business information and identifiers</p>
//                                         </div>
//                                     </div>

//                                     <div className="grid md:grid-cols-2 gap-6">
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Business ID</h4>
//                                                 <p className="text-sm font-medium text-black-deep bg-beige p-3 rounded-xl font-mono">#{salon.id}</p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Registration Number</h4>
//                                                 <p className="text-sm font-medium text-black-deep bg-beige p-3 rounded-xl font-mono">{salon.registrationNumber || "N/A"}</p>
//                                             </div>
//                                         </div>
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Created At</h4>
//                                                 <p className="text-sm text-black-deep bg-beige p-3 rounded-xl">{formatDate(salon.createdAt)}</p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Last Updated</h4>
//                                                 <p className="text-sm text-black-deep bg-beige p-3 rounded-xl">{formatDate(salon.updatedAt)}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                                     <div className="flex items-center gap-4 mb-8">
//                                         <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
//                                             <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                                                 <circle cx="12" cy="7" r="4" />
//                                             </svg>
//                                         </div>
//                                         <div>
//                                             <h3 className="font-display text-2xl text-black-deep">Admin</h3>
//                                             <p className="text-secondary text-xs">Account administrator</p>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center gap-4 mb-6">
//                                         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center text-white text-xl font-bold">
//                                             {salon.adminName?.[0]?.toUpperCase() || 'A'}
//                                         </div>
//                                         <div>
//                                             <h4 className="font-medium text-black-deep text-lg">{salon.adminName}</h4>
//                                             <p className="text-secondary text-sm">ID: #{salon.adminId}</p>
//                                         </div>
//                                     </div>

//                                     <div className="pt-4 border-t border-gold/10">
//                                         <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3">Admin Email</h4>
//                                         <a href={`mailto:${salon.adminEmail}`} className="text-gold hover:underline text-sm break-all">
//                                             {salon.adminEmail}
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Reveal>
//                 )}

//                 {activeTab === "gallery" && (
//                     <Reveal>
//                         <div className="space-y-8">
//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                 <SectionHeading
//                                     subtitle="Portfolio"
//                                     title="Salon Gallery"
//                                     description="Manage the visual showcase of your salon's interior and work."
//                                     mb="mb-0"
//                                 />
//                                 <label className="group relative px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex items-center justify-center shrink-0">
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         multiple
//                                         accept="image/*"
//                                         onChange={handleImagesUpload}
//                                         disabled={isUploadingImages}
//                                     />
//                                     <span className="relative z-10 flex items-center gap-2">
//                                         <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
//                                             <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
//                                         </svg>
//                                         {isUploadingImages ? "Uploading..." : "Add Images"}
//                                     </span>
//                                 </label>
//                             </div>

//                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                                 {salon.imageUrls?.map((url, idx) => (
//                                     <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-beige border border-gold/10 shadow-sm hover:shadow-xl transition-all">
//                                         <img
//                                             src={url}
//                                             alt={`Salon ${idx + 1}`}
//                                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                                         />
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
//                                             <button
//                                                 onClick={() => handleDeleteImage(url)}
//                                                 className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110"
//                                                 title="Delete Image"
//                                             >
//                                                 <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                                                     <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 {(!salon.imageUrls || salon.imageUrls.length === 0) && (
//                                     <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center">
//                                         <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
//                                             <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
//                                                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                                                 <circle cx="8.5" cy="8.5" r="1.5" />
//                                                 <path d="M21 15l-5-5L5 21" />
//                                             </svg>
//                                         </div>
//                                         <h4 className="text-black-deep font-semibold text-lg">No images in gallery</h4>
//                                         <p className="text-secondary text-sm mt-2 max-w-sm">Upload your first set of images to showcase your business.</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </Reveal>
//                 )}

//                 {activeTab === "holidays" && (
//                     <Reveal>
//                         <div className="space-y-8">
//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                 <SectionHeading
//                                     subtitle="Schedule"
//                                     title="Salon Holidays"
//                                     description="Scheduled closures and public holidays for your business."
//                                     mb="mb-0"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
//                                         setIsEditingHoliday(false);
//                                         setIsAddHolidayModalOpen(true);
//                                     }}
//                                     className="group relative px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center shrink-0"
//                                 >
//                                     <span className="relative z-10 flex items-center gap-2">
//                                         <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
//                                             <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
//                                         </svg>
//                                         Schedule Holiday
//                                     </span>
//                                 </button>
//                             </div>

//                             {holidaysLoading ? (
//                                 <div className="flex items-center justify-center py-20">
//                                     <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
//                                 </div>
//                             ) : (
//                                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {holidays.map((holiday) => (
//                                         <div key={holiday.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all">
//                                             <div className="flex justify-between items-start mb-4">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
//                                                         <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                                                             <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                                                             <line x1="16" y1="2" x2="16" y2="6" />
//                                                             <line x1="8" y1="2" x2="8" y2="6" />
//                                                             <line x1="3" y1="10" x2="21" y2="10" />
//                                                         </svg>
//                                                     </div>
//                                                     <div>
//                                                         <h4 className="font-display text-lg text-black-deep font-bold">{holiday.description}</h4>
//                                                         <p className="text-gold text-sm">
//                                                             {new Date(holiday.holidayDate).toLocaleDateString('en-US', {
//                                                                 month: 'long',
//                                                                 day: 'numeric',
//                                                                 year: 'numeric'
//                                                             })}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 {holiday.isRepeatingYearly && (
//                                                     <span className="px-3 py-1 bg-black-deep text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
//                                                         Annual
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gold/10">
//                                                 <button
//                                                     onClick={() => handleEditHoliday(holiday)}
//                                                     className="px-4 py-2 rounded-full bg-gold/10 text-gold text-xs font-bold hover:bg-gold hover:text-black-deep transition-all"
//                                                 >
//                                                     Edit
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDeleteHoliday(holiday.id)}
//                                                     className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {holidays.length === 0 && (
//                                         <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center">
//                                             <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
//                                                 <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
//                                                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                                                     <line x1="16" y1="2" x2="16" y2="6" />
//                                                     <line x1="8" y1="2" x2="8" y2="6" />
//                                                     <line x1="3" y1="10" x2="21" y2="10" />
//                                                 </svg>
//                                             </div>
//                                             <h4 className="text-black-deep font-semibold text-lg">No holidays found</h4>
//                                             <p className="text-secondary text-sm mt-2 max-w-sm">Schedule your first holiday closure for your salon.</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </Reveal>
//                 )}

//                 {activeTab === "business" && (
//                     <Reveal>
//                         <div className="grid lg:grid-cols-2 gap-8">
//                             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                                 <SectionHeading subtitle="About" title="Business Description" mb="mb-6" />
//                                 <p className="text-secondary text-lg leading-relaxed">{salon.description || "No description provided."}</p>
//                             </div>
//                             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                                 <SectionHeading subtitle="Expertise" title="Categories" mb="mb-6" />
//                                 <div className="flex flex-wrap gap-3">
//                                     {salon.categories?.length > 0 ? (
//                                         salon.categories.map((cat) => (
//                                             <span key={cat.id} className="px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium">
//                                                 {cat.name}
//                                             </span>
//                                         ))
//                                     ) : (
//                                         <p className="text-secondary">No categories added yet.</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </Reveal>
//                 )}

//                 {activeTab === "contact" && (
//                     <Reveal>
//                         <div className="grid lg:grid-cols-2 gap-8">
//                             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                                 <SectionHeading subtitle="Get in Touch" title="Contact Information" mb="mb-6" />
//                                 <div className="space-y-6">
//                                     <div className="flex items-center gap-4">
//                                         <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
//                                             <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
//                                             </svg>
//                                         </div>
//                                         <div>
//                                             <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Phone</h4>
//                                             <p className="text-lg text-black-deep">{salon.phoneNumber || "Not provided"}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-4">
//                                         <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
//                                             <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                                 <rect x="2" y="4" width="20" height="16" rx="2" />
//                                                 <path d="m22 7-10 7L2 7" />
//                                             </svg>
//                                         </div>
//                                         <div>
//                                             <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Email</h4>
//                                             <a href={`mailto:${salon.email}`} className="text-lg text-gold hover:underline">
//                                                 {salon.email || "Not provided"}
//                                             </a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                                 <SectionHeading subtitle="Visit Us" title="Location" mb="mb-6" />
//                                 <div className="flex items-start gap-4">
//                                     <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
//                                         <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
//                                             <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//                                             <circle cx="12" cy="10" r="3" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Address</h4>
//                                         <p className="text-lg text-black-deep leading-relaxed">{locationText}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Reveal>
//                 )}

//                 {activeTab === "seo" && (
//                     <Reveal>
//                         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
//                             <SectionHeading subtitle="Search Engine" title="SEO Information" mb="mb-8" />
//                             <div className="grid md:grid-cols-2 gap-8">
//                                 <div>
//                                     <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Meta Description</h4>
//                                     <div className="bg-beige p-5 rounded-2xl text-black-deep italic border border-gold/10">
//                                         "{salon.metaDescription || `Luxury beauty treatments and hair services at ${salon.name}.`}"
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Meta Keywords</h4>
//                                     <div className="flex flex-wrap gap-2">
//                                         {salon.metaKeywords?.split(',').map((kw, i) => (
//                                             <span key={i} className="px-3 py-1.5 bg-beige rounded-full text-sm text-black-deep border border-gold/10">
//                                                 {kw.trim()}
//                                             </span>
//                                         ))}
//                                         {(!salon.metaKeywords || salon.metaKeywords.length === 0) && (
//                                             <p className="text-secondary italic">No keywords set</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </Reveal>
//                 )}
//             </div>

//             {/* Edit Modal */}
//             {isEditModalOpen && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
//                     <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative my-8 animate-in fade-in zoom-in duration-300">
//                         {/* Header */}
//                         <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 py-8 border-b border-gold/10 flex justify-between items-center rounded-t-[40px] z-10">
//                             <div>
//                                 <h3 className="font-display text-3xl text-black-deep">Edit Business</h3>
//                                 <p className="text-secondary text-xs uppercase tracking-widest font-bold mt-1">Refine your salon presence</p>
//                             </div>
//                             <button
//                                 onClick={() => setIsEditModalOpen(false)}
//                                 className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
//                             >
//                                 <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                                     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//                                 </svg>
//                             </button>
//                         </div>

//                         {/* Form */}
//                         <form onSubmit={handleUpdateSubmit} className="p-10">
//                             <div className="grid md:grid-cols-2 gap-8 mb-12">
//                                 {/* Basic Info */}
//                                 <div className="space-y-6">
//                                     <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-bold border-b border-gold/20 pb-2">Basic Info</h4>
//                                     <div>
//                                         <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Salon Name</label>
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             value={formData.name || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Description</label>
//                                         <textarea
//                                             name="description"
//                                             value={formData.description || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full h-32 px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="flex items-center gap-3 bg-beige p-5 rounded-xl">
//                                         <input
//                                             type="checkbox"
//                                             id="isOpen"
//                                             name="isOpen"
//                                             checked={formData.isOpen || false}
//                                             onChange={handleInputChange}
//                                             className="w-5 h-5 rounded accent-gold"
//                                         />
//                                         <label htmlFor="isOpen" className="text-sm font-bold text-black-deep cursor-pointer">Business is currently Open</label>
//                                     </div>
//                                 </div>

//                                 {/* Contact Info */}
//                                 <div className="space-y-6">
//                                     <h4 className="text-xs uppercase tracking-[0.3em] text-black-deep font-bold border-b border-black-deep/10 pb-2">Contact Details</h4>
//                                     <div>
//                                         <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Phone Number</label>
//                                         <input
//                                             type="tel"
//                                             name="phoneNumber"
//                                             value={formData.phoneNumber || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Business Email</label>
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={formData.email || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Latitude</label>
//                                             <input
//                                                 type="number"
//                                                 step="any"
//                                                 name="latitude"
//                                                 value={formData.latitude || ''}
//                                                 onChange={handleInputChange}
//                                                 className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Longitude</label>
//                                             <input
//                                                 type="number"
//                                                 step="any"
//                                                 name="longitude"
//                                                 value={formData.longitude || ''}
//                                                 onChange={handleInputChange}
//                                                 className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Location Info */}
//                                 <div className="md:col-span-2 space-y-6">
//                                     <h4 className="text-xs uppercase tracking-[0.3em] text-gold font-bold border-b border-gold/20 pb-2">Location & SEO</h4>
//                                     <div>
//                                         <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Street Address</label>
//                                         <input
//                                             type="text"
//                                             name="address"
//                                             value={formData.address || ''}
//                                             onChange={handleInputChange}
//                                             className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">City</label>
//                                             <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
//                                         </div>
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">State</label>
//                                             <input type="text" name="state" value={formData.state || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
//                                         </div>
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Postal Code</label>
//                                             <input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
//                                         </div>
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Country</label>
//                                             <input type="text" name="country" value={formData.country || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep" required />
//                                         </div>
//                                     </div>
//                                     <div className="grid md:grid-cols-2 gap-8">
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Meta Description (SEO)</label>
//                                             <textarea
//                                                 name="metaDescription"
//                                                 value={formData.metaDescription || ''}
//                                                 onChange={handleInputChange}
//                                                 className="w-full h-24 px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none"
//                                                 placeholder="Brief description for search engines"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Meta Keywords</label>
//                                             <textarea
//                                                 name="metaKeywords"
//                                                 value={formData.metaKeywords || ''}
//                                                 onChange={handleInputChange}
//                                                 className="w-full h-24 px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none"
//                                                 placeholder="e.g. hair, nails, spa, luxury (comma separated)"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Actions */}
//                             <div className="flex gap-4 sticky bottom-0 bg-white/90 backdrop-blur-md py-6 border-t border-gold/10 rounded-b-[40px]">
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsEditModalOpen(false)}
//                                     className="flex-1 px-8 py-4 rounded-full border-2 border-black-deep/10 text-black-deep text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-all"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="flex-1 px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-gold/80 transition-all disabled:opacity-50"
//                                 >
//                                     {isSubmitting ? "Saving..." : "Save Changes"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Holiday Modal */}
//             {isAddHolidayModalOpen && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
//                     <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
//                         {/* Header */}
//                         <div className="px-10 py-8 border-b border-gold/10 flex justify-between items-center rounded-t-[40px]">
//                             <div>
//                                 <h3 className="font-display text-3xl text-black-deep">{isEditingHoliday ? 'Update' : 'Schedule'} Holiday</h3>
//                                 <p className="text-secondary text-xs uppercase tracking-widest font-bold mt-1">
//                                     {isEditingHoliday ? 'Modify your closure details' : 'Mark your business as closed'}
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setIsAddHolidayModalOpen(false);
//                                     setIsEditingHoliday(false);
//                                 }}
//                                 className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
//                             >
//                                 <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                                     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//                                 </svg>
//                             </button>
//                         </div>

//                         {/* Form */}
//                         <form onSubmit={handleHolidaySubmit} className="p-10 space-y-6">
//                             <div>
//                                 <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Holiday Date</label>
//                                 <input
//                                     type="date"
//                                     name="holidayDate"
//                                     value={holidayFormData.holidayDate}
//                                     onChange={handleHolidayInputChange}
//                                     className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Description</label>
//                                 <input
//                                     type="text"
//                                     name="description"
//                                     placeholder="e.g. Holi Festival, New Year's Day"
//                                     value={holidayFormData.description}
//                                     onChange={handleHolidayInputChange}
//                                     className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
//                                     required
//                                 />
//                             </div>
//                             <div className="flex items-center gap-3 bg-beige p-5 rounded-xl">
//                                 <input
//                                     type="checkbox"
//                                     id="isRepeatingYearly"
//                                     name="isRepeatingYearly"
//                                     checked={holidayFormData.isRepeatingYearly}
//                                     onChange={handleHolidayInputChange}
//                                     className="w-5 h-5 rounded accent-gold cursor-pointer"
//                                 />
//                                 <label htmlFor="isRepeatingYearly" className="text-sm font-bold text-black-deep cursor-pointer">
//                                     Repeats Annually
//                                 </label>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className="w-full py-4 rounded-full bg-black-deep text-gold text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-black disabled:opacity-50"
//                             >
//                                 {isSubmitting ? (
//                                     <span className="flex items-center justify-center gap-2">
//                                         <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
//                                         {isEditingHoliday ? "Updating..." : "Scheduling..."}
//                                     </span>
//                                 ) : (
//                                     isEditingHoliday ? "Update Holiday" : "Schedule Holiday"
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <style jsx>{`
//                 input::-webkit-outer-spin-button,
//                 input::-webkit-inner-spin-button {
//                     -webkit-appearance: none;
//                     margin: 0;
//                 }
//                 .scrollbar-hide::-webkit-scrollbar {
//                     display: none;
//                 }
//                 .scrollbar-hide {
//                     -ms-overflow-style: none;
//                     scrollbar-width: none;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default MyAdminSalon;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyBusinessApi, updateMyBusinessApi, uploadBannerApi, uploadSalonImagesApi, deleteSalonImageApi } from "../services/salonService";
import { getHolidaysByBusinessApi, addHolidayApi, updateHolidayApi, deleteHolidayApi } from "../services/holidayService";
import LocationPickerMap from "../components/LocationPickerMap";

// ─── Custom Hooks ────────────────────────────────────────────────────────────
function useReveal() {
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!ref) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(ref);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
        );
        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref]);

    return { setRef, visible };
}

function Reveal({ children, delay = 0, className = "" }) {
    const { setRef, visible } = useReveal();
    return (
        <div
            ref={setRef}
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function SectionHeading({ subtitle, title, description, align = "left", mb = "mb-12" }) {
    const words = title.split(" ");
    const lastWord = words.pop();
    const mainTitle = words.join(" ");

    return (
        <div className={`${mb} ${align === "center" ? "text-center mx-auto" : ""}`}>
            <span className="block text-[10px] tracking-[0.4em] uppercase text-gold font-semibold mb-4 opacity-90">
                {subtitle}
            </span>
            <h2
                className="font-display font-light text-black-deep leading-[1.1] mb-6"
                style={{ fontSize: "clamp(36px,5vw,52px)" }}
            >
                {mainTitle}{" "}
                <em className="italic text-gold block md:inline">{lastWord}</em>
            </h2>
            {description && (
                <p className="text-[#7a7065] text-[15px] leading-relaxed font-light opacity-80 max-w-3xl">
                    {description}
                </p>
            )}
        </div>
    );
}

function Badge({ children, variant = "gold" }) {
    const variants = {
        gold: "bg-gold text-black-deep",
        outline: "bg-transparent border border-gold text-gold",
        glass: "backdrop-blur-md bg-white/10 text-white border border-white/20",
        dark: "bg-black-deep text-gold",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide ${variants[variant]}`}
        >
            {children}
        </span>
    );
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MyAdminSalon = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isReadOnly = user?.role === "RECEPTIONIST";
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Edit Modal State
    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [holidaysLoading, setHolidaysLoading] = useState(false);

    // Add Holiday State
    const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
    const [holidayFormData, setHolidayFormData] = useState({
        holidayDate: "",
        description: "",
        isRepeatingYearly: false
    });
    const [isEditingHoliday, setIsEditingHoliday] = useState(false);
    const [currentHolidayId, setCurrentHolidayId] = useState(null);

    const today = DAY_NAMES[new Date().getDay()];

    const fetchMySalon = async () => {
        try {
            setLoading(true);
            const data = await getMyBusinessApi();
            setSalon(data);
            setFormData(data);
            if (data?.id) fetchHolidays(data.id);
        } catch (err) {
            setError("Failed to fetch your salon details. Please ensure you are an authorized admin.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMySalon();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await updateMyBusinessApi(formData);
            await fetchMySalon();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update business details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingBanner(true);
            await uploadBannerApi(file);
            await fetchMySalon();
            alert("Banner updated successfully!");
        } catch (err) {
            console.error("Banner upload error:", err);
            alert("Failed to upload banner image.");
        } finally {
            setIsUploadingBanner(false);
        }
    };

    const handleImagesUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setIsUploadingImages(true);
            await uploadSalonImagesApi(files);
            await fetchMySalon();
            alert(`${files.length} images uploaded successfully!`);
        } catch (err) {
            console.error("Gallery upload error:", err);
            alert("Failed to upload gallery images.");
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            await deleteSalonImageApi(imageUrl);
            await fetchMySalon();
            alert("Image removed successfully!");
        } catch (err) {
            console.error("Delete image error:", err);
            alert("Failed to delete image.");
        }
    };

    const fetchHolidays = async (businessId) => {
        try {
            setHolidaysLoading(true);
            const data = await getHolidaysByBusinessApi(businessId);
            setHolidays(data || []);
        } catch (err) {
            console.error("Failed to fetch holidays:", err);
        } finally {
            setHolidaysLoading(false);
        }
    };

    const handleHolidayInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHolidayFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditHoliday = (holiday) => {
        setHolidayFormData({
            holidayDate: holiday.holidayDate,
            description: holiday.description,
            isRepeatingYearly: holiday.isRepeatingYearly
        });
        setCurrentHolidayId(holiday.id);
        setIsEditingHoliday(true);
        setIsAddHolidayModalOpen(true);
    };

    const handleHolidaySubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (isEditingHoliday) {
                await updateHolidayApi(currentHolidayId, holidayFormData);
                alert("Holiday updated successfully!");
            } else {
                await addHolidayApi(salon.id, holidayFormData);
                alert("Holiday scheduled successfully!");
            }
            await fetchHolidays(salon.id);
            setIsAddHolidayModalOpen(false);
            setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
            setIsEditingHoliday(false);
            setCurrentHolidayId(null);
        } catch (err) {
            console.error("Holiday submit error:", err);
            alert(`Failed to ${isEditingHoliday ? 'update' : 'schedule'} holiday.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteHoliday = async (id) => {
        if (!window.confirm("Are you sure you want to delete this holiday? This action cannot be undone.")) return;

        try {
            setHolidaysLoading(true);
            await deleteHolidayApi(id);
            await fetchHolidays(salon.id);
            alert("Holiday deleted successfully!");
        } catch (err) {
            console.error("Delete holiday error:", err);
            alert("Failed to delete holiday.");
        } finally {
            setHolidaysLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date).replace(',', ' ·');
    };

    if (loading && !salon) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-beige">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                    <p className="text-secondary text-lg">Loading your salon profile...</p>
                </div>
            </div>
        );
    }

    if (error && !salon) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-beige p-8">
                <div className="bg-white/80 backdrop-blur-sm p-12 rounded-[40px] shadow-2xl max-w-lg text-center border border-gold/20">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h3 className="font-display text-3xl text-black-deep mb-4">Access Error</h3>
                    <p className="text-secondary text-sm mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase hover:bg-gold/80 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-beige">
                <p className="text-secondary text-lg">No salon data found for your account.</p>
            </div>
        );
    }

    const salonImg = salon.bannerImageUrl || (salon.imageUrls && salon.imageUrls.length > 0 ? salon.imageUrls[0] : null);
    const locationText = [salon.address, salon.city, salon.state, salon.postalCode, salon.country]
        .filter(Boolean)
        .join(", ") || salon.address;

    const tabs = [
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "gallery", label: "Gallery", icon: "🖼️" },
        { id: "business", label: "Business", icon: "💼" },
        { id: "contact", label: "Contact", icon: "📞" },
        { id: "seo", label: "SEO", icon: "🔍" },
        { id: "holidays", label: "Holidays", icon: "🎉" },
    ];

    return (
        <div className="page active w-full bg-beige font-jost font-light">
            {/* Hero Section - Full Width */}
            <section className="relative h-[45vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    {salonImg && (
                        <img
                            src={salonImg}
                            alt={salon.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                </div>

                <div className="absolute inset-0 z-10 flex items-center">
                    <div className="w-full px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
                        <Reveal delay={100}>
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-all mb-4 group"
                            >
                                <svg className="group-hover:-translate-x-1 transition-transform" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                <span className="text-xs uppercase tracking-[0.2em] font-medium">Dashboard</span>
                            </button>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                {salon.verificationStatus === "VERIFIED" && (
                                    <Badge variant="glass">
                                        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        Verified Salon
                                    </Badge>
                                )}
                                <Badge variant="glass">
                                    <span className={`w-2 h-2 rounded-full ${salon.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'} mr-1`}></span>
                                    {salon.isOpen ? "Open Now" : "Closed"}
                                </Badge>
                            </div>
                        </Reveal>

                        <Reveal delay={300}>
                            <h1 className="font-display font-bold leading-tight mb-3 text-white"
                                style={{ fontSize: "clamp(40px,5vw,72px)" }}>
                                {salon.name}
                            </h1>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="flex items-center gap-5 flex-wrap mb-6">
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-1 text-gold">
                                        <span className="text-lg font-bold">
                                            {salon.averageRating > 0 ? salon.averageRating.toFixed(1) : "New"}
                                        </span>
                                        <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </div>
                                    <div className="w-px h-4 bg-white/20" />
                                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                                        {salon.totalReviews > 0 ? `${salon.totalReviews} Reviews` : "No Reviews Yet"}
                                    </span>
                                </div>

                                {salon.city && (
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <span>{salon.city}</span>
                                    </div>
                                )}
                            </div>
                        </Reveal>

                        {!isReadOnly && (
                            <Reveal delay={500}>
                                <div className="flex gap-3 sm:gap-4 flex-wrap">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="group relative px-8 py-3.5 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <span className="relative z-10">Edit Business</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>

                                    <label className="group relative px-8 py-3.5 rounded-full border border-white/30 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50 cursor-pointer flex items-center justify-center">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleBannerUpload}
                                            disabled={isUploadingBanner}
                                        />
                                        <span className="flex items-center gap-2">
                                            {isUploadingBanner ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                "Upload Banner"
                                            )}
                                        </span>
                                    </label>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </section>

            {/* Tab Navigation - Full Width with Container */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gold/10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                    ? "bg-gold text-black-deep shadow-lg"
                                    : "text-secondary hover:text-black-deep hover:bg-white/50"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections - Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {activeTab === "overview" && (
                    <Reveal>
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">Total Bookings</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.totalBookings || 0}</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">Average Rating</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.averageRating?.toFixed(1) || '0.0'}</p>
                                    <div className="flex text-gold text-sm mt-2">
                                        {"★".repeat(Math.round(salon.averageRating || 0))}{"☆".repeat(5 - Math.round(salon.averageRating || 0))}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <line x1="9" y1="9" x2="15" y2="15" />
                                                <line x1="15" y1="9" x2="9" y2="15" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">QR Scans</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.qrCodeScanCount || 0}</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M5.5 20v-2a6 6 0 0 1 12 0v2" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-secondary uppercase tracking-wider">Total Reviews</span>
                                    </div>
                                    <p className="text-3xl font-display text-black-deep font-bold">{salon.totalReviews || 0}</p>
                                </div>
                            </div>

                            {/* Business Overview and Admin */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <line x1="9" y1="3" x2="9" y2="21" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl text-black-deep">Business Overview</h3>
                                            <p className="text-secondary text-xs">Key business information and identifiers</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="bg-beige p-5 rounded-2xl flex flex-col justify-center border border-transparent hover:border-gold/10 transition-colors">
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Business ID</h4>
                                            <p className="text-sm font-medium text-black-deep font-mono">#{salon.id}</p>
                                        </div>
                                        <div className="bg-beige p-5 rounded-2xl flex flex-col justify-center border border-transparent hover:border-gold/10 transition-colors">
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Registration Number</h4>
                                            <p className="text-sm font-medium text-black-deep font-mono">{salon.registrationNumber || "N/A"}</p>
                                        </div>
                                        <div className="bg-beige p-5 rounded-2xl flex flex-col justify-center border border-transparent hover:border-gold/10 transition-colors">
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Created At</h4>
                                            <p className="text-sm text-black-deep font-medium">{formatDate(salon.createdAt)}</p>
                                        </div>
                                        <div className="bg-beige p-5 rounded-2xl flex flex-col justify-center border border-transparent hover:border-gold/10 transition-colors">
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Last Updated</h4>
                                            <p className="text-sm text-black-deep font-medium">{formatDate(salon.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl text-black-deep">Admin</h3>
                                            <p className="text-secondary text-xs">Account administrator</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center text-white text-xl font-bold">
                                            {salon.adminName?.[0]?.toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-black-deep text-lg">{salon.adminName}</h4>
                                            <p className="text-secondary text-sm">ID: #{salon.adminId}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gold/10">
                                        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-3">Admin Email</h4>
                                        <a href={`mailto:${salon.adminEmail}`} className="text-gold hover:underline text-sm break-all">
                                            {salon.adminEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "gallery" && (
                    <Reveal>
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <SectionHeading
                                    subtitle="Portfolio"
                                    title="Salon Gallery"
                                    description="Manage the visual showcase of your salon's interior and work."
                                    mb="mb-0"
                                />
                                {!isReadOnly && (
                                    <label className="group relative px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex items-center justify-center shrink-0">
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImagesUpload}
                                            disabled={isUploadingImages}
                                        />
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            {isUploadingImages ? "Uploading..." : "Add Images"}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {salon.imageUrls?.map((url, idx) => (
                                    <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-beige border border-gold/10 shadow-sm hover:shadow-xl transition-all">
                                        <img
                                            src={url}
                                            alt={`Salon ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {!isReadOnly && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                                                <button
                                                    onClick={() => handleDeleteImage(url)}
                                                    className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110"
                                                    title="Delete Image"
                                                >
                                                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!salon.imageUrls || salon.imageUrls.length === 0) && (
                                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
                                            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M21 15l-5-5L5 21" />
                                            </svg>
                                        </div>
                                        <h4 className="text-black-deep font-semibold text-lg">No images in gallery</h4>
                                        <p className="text-secondary text-sm mt-2 max-w-sm">Upload your first set of images to showcase your business.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "holidays" && (
                    <Reveal>
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <SectionHeading
                                    subtitle="Schedule"
                                    title="Salon Holidays"
                                    description="Scheduled closures and public holidays for your business."
                                    mb="mb-0"
                                />
                                {!isReadOnly && (
                                    <button
                                        onClick={() => {
                                            setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
                                            setIsEditingHoliday(false);
                                            setIsAddHolidayModalOpen(true);
                                        }}
                                        className="group relative px-8 py-4 rounded-full bg-gold text-black-deep text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center shrink-0"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            Schedule Holiday
                                        </span>
                                    </button>
                                )}
                            </div>

                            {holidaysLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {holidays.map((holiday) => (
                                        <div key={holiday.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                            <line x1="16" y1="2" x2="16" y2="6" />
                                                            <line x1="8" y1="2" x2="8" y2="6" />
                                                            <line x1="3" y1="10" x2="21" y2="10" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-display text-lg text-black-deep font-bold">{holiday.description}</h4>
                                                        <p className="text-gold text-sm">
                                                            {new Date(holiday.holidayDate).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {holiday.isRepeatingYearly && (
                                                    <span className="px-3 py-1 bg-black-deep text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        Annual
                                                    </span>
                                                )}
                                            </div>

                                            {!isReadOnly && (
                                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gold/10">
                                                    <button
                                                        onClick={() => handleEditHoliday(holiday)}
                                                        className="px-4 py-2 rounded-full bg-gold/10 text-gold text-xs font-bold hover:bg-gold hover:text-black-deep transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHoliday(holiday.id)}
                                                        className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {holidays.length === 0 && (
                                        <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold">
                                                <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            </div>
                                            <h4 className="text-black-deep font-semibold text-lg">No holidays found</h4>
                                            <p className="text-secondary text-sm mt-2 max-w-sm">Schedule your first holiday closure for your salon.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Reveal>
                )}

                {activeTab === "business" && (
                    <Reveal>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="About" title="Business Description" mb="mb-6" />
                                <p className="text-secondary text-lg leading-relaxed">{salon.description || "No description provided."}</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="Expertise" title="Categories" mb="mb-6" />
                                <div className="flex flex-wrap gap-3">
                                    {salon.categories?.length > 0 ? (
                                        salon.categories.map((cat) => (
                                            <span key={cat.id} className="px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium">
                                                {cat.name}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-secondary">No categories added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "contact" && (
                    <Reveal>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="Get in Touch" title="Contact Information" mb="mb-6" />
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Phone</h4>
                                            <p className="text-lg text-black-deep">{salon.phoneNumber || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-10 7L2 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1">Email</h4>
                                            <a href={`mailto:${salon.email}`} className="text-lg text-gold hover:underline">
                                                {salon.email || "Not provided"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                                <SectionHeading subtitle="Visit Us" title="Location" mb="mb-6" />
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Address</h4>
                                        <p className="text-lg text-black-deep leading-relaxed">{locationText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {activeTab === "seo" && (
                    <Reveal>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10">
                            <SectionHeading subtitle="Search Engine" title="SEO Information" mb="mb-8" />
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Meta Description</h4>
                                    <div className="bg-beige p-5 rounded-2xl text-black-deep italic border border-gold/10">
                                        "{salon.metaDescription || `Luxury beauty treatments and hair services at ${salon.name}.`}"
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Meta Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {salon.metaKeywords?.split(',').map((kw, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-beige rounded-full text-sm text-black-deep border border-gold/10">
                                                {kw.trim()}
                                            </span>
                                        ))}
                                        {(!salon.metaKeywords || salon.metaKeywords.length === 0) && (
                                            <p className="text-secondary italic">No keywords set</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>

            {/* Edit Modal */}
            {!isReadOnly && isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
                    <div className="bg-white rounded-[24px] sm:rounded-[32px] w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        {/* Fixed Header */}
                        <div className="flex-none bg-white px-6 sm:px-10 py-6 sm:py-8 border-b border-gold/10 flex justify-between items-center rounded-t-[24px] sm:rounded-t-[32px] z-30">
                            <div>
                                <h3 className="font-display text-2xl sm:text-3xl text-black-deep">Edit Business</h3>
                                <p className="text-secondary text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mt-1">Refine your salon presence</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
                            >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                            <form onSubmit={handleUpdateSubmit} id="edit-business-form">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                                    {/* Basic Info */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-bold border-b border-gold/20 pb-2">Basic Info</h4>
                                        <div>
                                            <label className="block text-[10px] font-black text-black-deep uppercase tracking-widest mb-2">Salon Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-sm font-medium"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-black-deep uppercase tracking-widest mb-2">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description || ''}
                                                onChange={handleInputChange}
                                                className="w-full h-32 px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none text-sm font-medium leading-relaxed"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <input
                                                type="checkbox"
                                                id="isOpen"
                                                name="isOpen"
                                                checked={formData.isOpen || false}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded accent-gold cursor-pointer"
                                            />
                                            <label htmlFor="isOpen" className="text-xs sm:text-sm font-bold text-black-deep cursor-pointer">Business is currently Open</label>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-8">
                                        <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-black-deep font-bold border-b border-black-deep/10 pb-2">Contact Details</h4>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-base font-medium shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Business Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-base font-medium shadow-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Location Info */}
                                    <div className="md:col-span-2 space-y-8 pt-4">
                                        <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-bold border-b border-gold/20 pb-2">Location & SEO</h4>

                                        {/* Interactive Map Picker */}
                                        <div className="pt-2">
                                            <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-4 flex items-center justify-between">
                                                Salon Location Map
                                                <span className="text-[10px] text-gold font-bold">
                                                    {formData.latitude && formData.longitude 
                                                        ? `${Number(formData.latitude).toFixed(4)}, ${Number(formData.longitude).toFixed(4)}` 
                                                        : 'No location set'}
                                                </span>
                                            </label>
                                            
                                            {!isMapExpanded ? (
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsMapExpanded(true)}
                                                    className="w-full h-32 rounded-[24px] border-2 border-dashed border-gold/30 bg-gold/5 flex flex-col items-center justify-center gap-3 hover:bg-gold/10 hover:border-gold/50 transition-all group cursor-pointer"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform shadow-inner">
                                                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-black text-black-deep uppercase tracking-widest">Open Interactive Map</span>
                                                </button>
                                            ) : (
                                                <LocationPickerMap 
                                                    initialLat={formData.latitude || 28.6139}
                                                    initialLng={formData.longitude || 77.2090}
                                                    onLocationSelect={(lat, lng) => {
                                                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                                    }}
                                                    onConfirm={(lat, lng, addressData) => {
                                                        if (addressData) {
                                                            const streetAddress = [addressData.house_number, addressData.road, addressData.suburb]
                                                                .filter(Boolean).join(", ");
                                                                
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                latitude: lat,
                                                                longitude: lng,
                                                                address: streetAddress || addressData.neighbourhood || prev.address || '',
                                                                city: addressData.city || addressData.town || addressData.county || addressData.state_district || prev.city || '',
                                                                state: addressData.state || prev.state || '',
                                                                postalCode: addressData.postcode || prev.postalCode || '',
                                                                country: addressData.country || prev.country || ''
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                                        }
                                                        setIsMapExpanded(false);
                                                    }}
                                                    onClose={() => setIsMapExpanded(false)}
                                                />
                                            )}
                                            
                                            {/* Hidden inputs */}
                                            <input type="hidden" name="latitude" value={formData.latitude || ''} />
                                            <input type="hidden" name="longitude" value={formData.longitude || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Street Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-base font-medium shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">City</label>
                                                <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-sm font-medium" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">State</label>
                                                <input type="text" name="state" value={formData.state || ''} onChange={handleInputChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-sm font-medium" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Postal Code</label>
                                                <input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-sm font-medium" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Country</label>
                                                <input type="text" name="country" value={formData.country || ''} onChange={handleInputChange} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep text-sm font-medium" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Meta Description (SEO)</label>
                                                <textarea
                                                    name="metaDescription"
                                                    value={formData.metaDescription || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full h-28 px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none text-sm font-medium leading-relaxed shadow-sm"
                                                    placeholder="Brief description for search engines"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-black text-black-deep uppercase tracking-[0.1em] mb-3">Meta Keywords</label>
                                                <textarea
                                                    name="metaKeywords"
                                                    value={formData.metaKeywords || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full h-28 px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-gold focus:bg-white transition-all outline-none text-black-deep resize-none text-sm font-medium shadow-sm"
                                                    placeholder="e.g. hair, nails, spa, luxury (comma separated)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Fixed Actions Footer */}
                        <div className="flex-none bg-white p-6 sm:px-10 py-6 border-t border-gold/10 rounded-b-[24px] sm:rounded-b-[32px] z-30">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="w-full sm:flex-1 px-8 py-3.5 sm:py-4 rounded-full border-2 border-black-deep/10 text-black-deep text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="edit-business-form"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:flex-1 px-8 py-3.5 sm:py-4 rounded-full bg-black-deep text-gold text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg hover:shadow-black-deep/20 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Holiday Modal */}
            {isAddHolidayModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-gold/10 flex justify-between items-center rounded-t-[40px]">
                            <div>
                                <h3 className="font-display text-3xl text-black-deep">{isEditingHoliday ? 'Update' : 'Schedule'} Holiday</h3>
                                <p className="text-secondary text-xs uppercase tracking-widest font-bold mt-1">
                                    {isEditingHoliday ? 'Modify your closure details' : 'Mark your business as closed'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAddHolidayModalOpen(false);
                                    setIsEditingHoliday(false);
                                }}
                                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
                            >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleHolidaySubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Holiday Date</label>
                                <input
                                    type="date"
                                    name="holidayDate"
                                    value={holidayFormData.holidayDate}
                                    onChange={handleHolidayInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="e.g. Holi Festival, New Year's Day"
                                    value={holidayFormData.description}
                                    onChange={handleHolidayInputChange}
                                    className="w-full px-5 py-4 rounded-xl bg-beige border border-transparent focus:border-gold focus:bg-white transition-all outline-none text-black-deep"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-beige p-5 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="isRepeatingYearly"
                                    name="isRepeatingYearly"
                                    checked={holidayFormData.isRepeatingYearly}
                                    onChange={handleHolidayInputChange}
                                    className="w-5 h-5 rounded accent-gold cursor-pointer"
                                />
                                <label htmlFor="isRepeatingYearly" className="text-sm font-bold text-black-deep cursor-pointer">
                                    Repeats Annually
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-full bg-black-deep text-gold text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-black disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                                        {isEditingHoliday ? "Updating..." : "Scheduling..."}
                                    </span>
                                ) : (
                                    isEditingHoliday ? "Update Holiday" : "Schedule Holiday"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default MyAdminSalon;