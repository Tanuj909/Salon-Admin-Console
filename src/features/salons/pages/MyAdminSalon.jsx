import { useState, useEffect } from "react";
import { getMyBusinessApi, updateMyBusinessApi, uploadBannerApi, uploadSalonImagesApi, deleteSalonImageApi } from "../services/salonService";
import { getHolidaysByBusinessApi, addHolidayApi, updateHolidayApi, deleteHolidayApi } from "../services/holidayService";
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
            <span className="block text-[10px] tracking-[0.4em] uppercase text-[#C8A951] font-semibold mb-4 opacity-90">
                {subtitle}
            </span>
            <h2
                className="font-[Cormorant_Garamond,Georgia,serif] font-light text-[#1C1C1C] leading-[1.1] mb-6"
                style={{ fontSize: "clamp(36px,5vw,52px)" }}
            >
                {mainTitle}{" "}
                <em className="italic text-[#C8A951] block md:inline">{lastWord}</em>
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
        gold: "bg-[#C8A951] text-[#1C1C1C]",
        outline: "bg-transparent border border-[#C8A951] text-[#C8A951]",
        glass: "backdrop-blur-md bg-white/10 text-white border border-white/20",
        dark: "bg-[#1C1C1C] text-[#C8A951]",
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
    const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            setFormData(data); // Initialize form with current data
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
            await fetchMySalon(); // Refresh data
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
            await fetchMySalon(); // Refresh data to show new banner
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
            await fetchMySalon(); // Refresh data to show new images
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
            await fetchMySalon(); // Refresh data
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
            await fetchHolidays(salon.id); // Refresh holidays
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
            await fetchHolidays(salon.id); // Refresh list
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
            <div className="min-h-screen bg-[#F7F3EE] flex flex-col items-center justify-center gap-4 font-[Jost,sans-serif]">
                <div className="w-12 h-12 border-4 border-[#C8A951]/20 border-t-[#C8A951] rounded-full animate-spin" />
                <p className="text-[#7a7065] text-lg">Loading your salon profile...</p>
            </div>
        );
    }

    if (error && !salon) {
        return (
            <div className="min-h-screen bg-[#F7F3EE] flex flex-col items-center justify-center gap-4 font-[Jost,sans-serif] p-8">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#C8A951]/10 max-w-lg text-center">
                    <span className="text-6xl mb-6 block">⚠️</span>
                    <h3 className="font-[Cormorant_Garamond] text-3xl text-[#1C1C1C] mb-4">Access Error</h3>
                    <p className="text-[#7a7065] text-sm mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 rounded-full bg-[#C8A951] text-[#1C1C1C] text-xs font-bold tracking-widest uppercase hover:bg-[#b39240] transition-all bg-transparent border-0 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="min-h-screen bg-[#F7F3EE] flex flex-col items-center justify-center gap-4 font-[Jost,sans-serif]">
                <p className="text-[#7a7065] text-lg">No salon data found for your account.</p>
            </div>
        );
    }

    const salonImg = salon.bannerImageUrl || (salon.imageUrls && salon.imageUrls.length > 0 ? salon.imageUrls[0] : null);
    const locationText = [salon.address, salon.city, salon.state, salon.postalCode, salon.country]
        .filter(Boolean)
        .join(", ") || salon.address;

    return (
        <div className="min-h-screen bg-[#F7F3EE] font-[Jost,sans-serif] font-light">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    {salonImg && <img src={salonImg} alt={salon.name} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute inset-0 z-10 flex items-center px-8 md:px-16 lg:px-24">
                    <div className="max-w-4xl text-white">
                        <Reveal delay={100}>
                            <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/70 hover:text-[#C8A951] transition-all mb-8 bg-transparent border-0 cursor-pointer group">
                                <svg className="group-hover:-translate-x-1 transition-transform" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                <span className="text-xs uppercase tracking-[0.2em] font-medium">Dashboard</span>
                            </button>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="flex items-center gap-3 mb-6 flex-wrap">
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
                                <Badge variant="glass">Domain Active</Badge>
                            </div>
                        </Reveal>

                        <Reveal delay={300}>
                            <h1 className="font-[Cormorant_Garamond,Georgia,serif] font-bold leading-tight mb-4 text-white uppercase tracking-tight"
                                style={{ fontSize: "clamp(48px,7vw,84px)" }}>
                                {salon.name}
                            </h1>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="flex items-center gap-6 flex-wrap mb-10">
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-1 text-[#C8A951]">
                                        <span className="text-lg font-bold">
                                            {salon.averageRating > 0 ? salon.averageRating.toFixed(1) : "New"}
                                        </span>
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
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

                        <Reveal delay={500}>
                            <div className="flex gap-4 sm:gap-6 flex-wrap">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="group relative px-10 py-5 rounded-full bg-[#C8A951] text-[#1C1C1C] text-sm font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(200,169,81,0.4)] hover:-translate-y-1 bg-transparent border-0 cursor-pointer"
                                >
                                    <span className="relative z-10">Edit Business</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>

                                <label className="group relative px-10 py-5 rounded-full border-2 border-white/30 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50 cursor-pointer flex items-center justify-center">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleBannerUpload}
                                        disabled={isUploadingBanner}
                                    />
                                    <span>{isUploadingBanner ? "Uploading..." : "Upload Banner"}</span>
                                </label>

                                <button className="group px-10 py-5 rounded-full border-2 border-white/30 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50 bg-transparent cursor-pointer">
                                    <span>View Analytics</span>
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#C8A951]/10">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex gap-8 overflow-x-auto py-4">
                        {["overview", "gallery", "business", "contact", "seo", "staff", "holidays"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap bg-transparent border-0 cursor-pointer ${activeTab === tab
                                    ? "text-[#C8A951] border-b-2 border-[#C8A951]"
                                    : "text-[#7a7065] hover:text-[#1C1C1C]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="min-h-[40vh]">
                {activeTab === "overview" && (
                    <section className="py-20 px-8 max-w-7xl mx-auto">
                        <Reveal>
                            <div className="grid lg:grid-cols-3 gap-8 text-left">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#C8A951]/5 hover:border-[#C8A951]/20 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center mb-6">
                                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-2">Total Bookings</h4>
                                    <p className="text-4xl font-[Cormorant_Garamond] text-[#1C1C1C] font-bold">{salon.totalBookings || 0}</p>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#C8A951]/5 hover:border-[#C8A951]/20 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center mb-6">
                                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-2">Average Rating</h4>
                                    <p className="text-4xl font-[Cormorant_Garamond] text-[#1C1C1C] font-bold">{salon.averageRating?.toFixed(1) || '0.0'}</p>
                                    <div className="flex text-[#C8A951] text-sm mt-2">
                                        {"★".repeat(Math.round(salon.averageRating || 0))}{"☆".repeat(5 - Math.round(salon.averageRating || 0))}
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#C8A951]/5 hover:border-[#C8A951]/20 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center mb-6">
                                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                        </svg>
                                    </div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-2">QR Code Scans</h4>
                                    <p className="text-4xl font-[Cormorant_Garamond] text-[#1C1C1C] font-bold">{salon.qrCodeScanCount || 0}</p>
                                </div>
                                <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-sm border border-[#C8A951]/5">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-full bg-[#f5edce] flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <line x1="9" y1="3" x2="9" y2="21" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-[Cormorant_Garamond] text-2xl text-[#1C1C1C]">Business Overview</h3>
                                            <p className="text-[#7a7065] text-xs">Key business information and identifiers</p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-3">Business ID</h4>
                                            <p className="text-lg font-medium text-[#1C1C1C] bg-[#F7F3EE] p-3 rounded-xl font-mono">#{salon.id}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-3">Registration Number</h4>
                                            <p className="text-lg font-medium text-[#1C1C1C] bg-[#F7F3EE] p-3 rounded-xl font-mono">{salon.registrationNumber}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-3">Created At</h4>
                                            <p className="text-sm text-[#1C1C1C]">{formatDate(salon.createdAt)}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-3">Last Updated</h4>
                                            <p className="text-sm text-[#1C1C1C]">{formatDate(salon.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#C8A951]/5">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-full bg-[#f5edce] flex items-center justify-center">
                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-[Cormorant_Garamond] text-2xl text-[#1C1C1C]">Admin</h3>
                                            <p className="text-[#7a7065] text-xs">Account administrator</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-[#C8A951] flex items-center justify-center text-white text-xl font-bold">
                                            {salon.adminName?.[0] || 'A'}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-[#1C1C1C] text-lg">{salon.adminName}</h4>
                                            <p className="text-[#7a7065] text-sm">ID: #{salon.adminId}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[#C8A951]/10">
                                        <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-3">Admin Email</h4>
                                        <a href={`mailto:${salon.adminEmail}`} className="text-[#C8A951] hover:underline text-sm break-all">
                                            {salon.adminEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                )}

                {activeTab === "gallery" && (
                    <section className="py-20 px-8 max-w-7xl mx-auto text-left">
                        <Reveal>
                            <div className="flex justify-between items-end mb-12">
                                <SectionHeading
                                    subtitle="Portfolio"
                                    title="Salon Gallery"
                                    description="Manage the visual showcase of your salon's interior and work."
                                    mb="mb-0"
                                />
                                <label className="group relative px-8 py-4 rounded-full bg-[#C8A951] text-[#1C1C1C] text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(200,169,81,0.4)] hover:-translate-y-1 cursor-pointer flex items-center justify-center">
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
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {salon.imageUrls?.map((url, idx) => (
                                    <div key={idx} className="group relative aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-[#C8A951]/10">
                                        <img src={url} alt={`Salon ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all bg-transparent cursor-pointer">
                                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteImage(url)}
                                                className="w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all bg-transparent cursor-pointer"
                                                title="Delete Image"
                                            >
                                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!salon.imageUrls || salon.imageUrls.length === 0) && (
                                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-[#C8A951]/30 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-[#f5edce] flex items-center justify-center mb-4 text-[#C8A951]">
                                            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                                        </div>
                                        <h4 className="text-[#1C1C1C] font-semibold">No images in gallery</h4>
                                        <p className="text-[#7a7065] text-sm mt-1">Upload your first set of images to showcase your business.</p>
                                    </div>
                                )}
                            </div>
                        </Reveal>
                    </section>
                )}

                {activeTab === "holidays" && (
                    <section className="py-20 px-8 max-w-7xl mx-auto text-left">
                        <Reveal>
                            <div className="flex justify-between items-end mb-12">
                                <SectionHeading
                                    subtitle="Schedule"
                                    title="Salon Holidays"
                                    description="Scheduled closures and public holidays for your business."
                                    mb="mb-0"
                                />
                                <button
                                    onClick={() => {
                                        setHolidayFormData({ holidayDate: "", description: "", isRepeatingYearly: false });
                                        setIsEditingHoliday(false);
                                        setIsAddHolidayModalOpen(true);
                                    }}
                                    className="group relative px-8 py-4 rounded-full bg-[#C8A951] text-[#1C1C1C] text-xs font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(200,169,81,0.4)] hover:-translate-y-1 bg-transparent border-0 cursor-pointer flex items-center justify-center"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        Schedule Holiday
                                    </span>
                                </button>
                            </div>

                            {holidaysLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-3 border-[#C8A951]/20 border-t-[#C8A951] rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {holidays.map((holiday) => (
                                        <div key={holiday.id} className="group bg-white p-8 rounded-3xl shadow-sm border border-[#C8A951]/5 hover:border-[#C8A951]/20 transition-all">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-[#f5edce] flex items-center justify-center text-[#C8A951]">
                                                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                </div>
                                                {holiday.isRepeatingYearly && (
                                                    <span className="px-3 py-1 bg-[#1C1C1C] text-[#C8A951] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        Annual
                                                    </span>
                                                )}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditHoliday(holiday)}
                                                        className="w-10 h-10 rounded-full bg-[#f5edce] flex items-center justify-center text-[#C8A951] hover:bg-[#C8A951] hover:text-white transition-all bg-transparent border-0 cursor-pointer opacity-0 group-hover:opacity-100"
                                                        title="Edit Holiday"
                                                    >
                                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHoliday(holiday.id)}
                                                        className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all bg-transparent border-0 cursor-pointer opacity-0 group-hover:opacity-100"
                                                        title="Delete Holiday"
                                                    >
                                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="text-xl font-[Cormorant_Garamond] text-[#1C1C1C] font-bold mb-2 uppercase">{holiday.description}</h4>
                                            <p className="text-[#C8A951] font-bold text-sm tracking-widest">{new Date(holiday.holidayDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    ))}
                                    {holidays.length === 0 && (
                                        <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-[#C8A951]/30 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 rounded-full bg-[#f5edce] flex items-center justify-center mb-4 text-[#C8A951]">
                                                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            </div>
                                            <h4 className="text-[#1C1C1C] font-semibold">No holidays found</h4>
                                            <p className="text-[#7a7065] text-sm mt-1">There are no upcoming scheduled holidays for your salon.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Reveal>
                    </section>
                )}

                {activeTab === "business" && (
                    <section className="py-20 px-8 max-w-7xl mx-auto text-left">
                        <Reveal>
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#C8A951]/5">
                                    <SectionHeading subtitle="About" title="Business Description" />
                                    <p className="text-[#7a7065] text-lg leading-relaxed">{salon.description}</p>
                                </div>
                                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#C8A951]/5">
                                    <SectionHeading subtitle="Expertise" title="Categories" />
                                    <div className="flex flex-wrap gap-4">
                                        {salon.categories?.map((cat) => (
                                            <span key={cat.id} className="px-6 py-3 rounded-full bg-[#f5edce] text-[#C8A951] text-sm font-medium">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                )}

                {activeTab === "contact" && (
                    <section className="py-20 px-8 max-w-7xl mx-auto text-left">
                        <Reveal>
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#C8A951]/5">
                                    <SectionHeading subtitle="Get in Touch" title="Contact Information" />
                                    <div className="space-y-8">
                                        <div className="flex gap-6">
                                            <div className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center flex-shrink-0">
                                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-2">Phone</h4>
                                                <p className="text-lg text-[#1C1C1C]">{salon.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <div className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center flex-shrink-0">
                                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-2">Email</h4>
                                                <p className="text-lg text-[#C8A951]">{salon.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#C8A951]/5">
                                    <SectionHeading subtitle="Visit Us" title="Location" />
                                    <div className="flex gap-6 mb-8">
                                        <div className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center flex-shrink-0">
                                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#C8A951" strokeWidth={2}>
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-2">Address</h4>
                                            <p className="text-lg text-[#1C1C1C] leading-relaxed">{locationText}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                )}

                {activeTab === "seo" && (
                    <section className="py-20 px-8 max-w-7xl mx-auto text-left">
                        <Reveal>
                            <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#C8A951]/5 lg:col-span-2">
                                <SectionHeading subtitle="Search Engine" title="SEO Information" />
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-4">Meta Description</h4>
                                        <div className="bg-[#F7F3EE] p-6 rounded-2xl text-[#1C1C1C] italic">
                                            "{salon.metaDescription || `Luxury beauty treatments and hair services at ${salon.name}.`}"
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest text-[#9e9287] font-bold mb-4">Meta Keywords</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {salon.metaKeywords?.split(',').map((kw, i) => (
                                                <span key={i} className="px-4 py-2 bg-[#F7F3EE] rounded-full text-sm text-[#1C1C1C]">
                                                    {kw.trim()}
                                                </span>
                                            ))}
                                            {(!salon.metaKeywords || salon.metaKeywords.length === 0) && (
                                                <p className="text-[#7a7065] italic">No keywords set</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                )}
            </div>

            {/* ═══════════════════════════════════════════
                EDIT MODAL
            ═══════════════════════════════════════════ */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl relative my-8 animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-10 py-8 border-b border-[#C8A951]/10 flex justify-between items-center rounded-t-[40px] z-10">
                            <div>
                                <h3 className="font-[Cormorant_Garamond] text-3xl text-[#1C1C1C]">Edit Business</h3>
                                <p className="text-[#7a7065] text-xs uppercase tracking-widest font-bold mt-1">Refine your salon presence</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-12 h-12 rounded-full bg-[#f5edce] flex items-center justify-center text-[#C8A951] hover:bg-[#C8A951] hover:text-white transition-all bg-transparent border-0 cursor-pointer"
                            >
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdateSubmit} className="p-10">
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h4 className="text-[12px] uppercase tracking-[0.3em] text-[#C8A951] font-bold border-b border-[#C8A951]/20 pb-2">Basic Info</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Salon Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleInputChange}
                                            className="w-full h-32 px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C] resize-none"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#F7F3EE] p-5 rounded-2xl">
                                        <input
                                            type="checkbox"
                                            id="isOpen"
                                            name="isOpen"
                                            checked={formData.isOpen || false}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded accent-[#C8A951]"
                                        />
                                        <label htmlFor="isOpen" className="text-sm font-bold text-[#1C1C1C] cursor-pointer">Business is currently Open</label>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-6">
                                    <h4 className="text-[12px] uppercase tracking-[0.3em] text-[#1C1C1C] font-bold border-b border-[#1C1C1C]/10 pb-2">Contact Details</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Business Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Latitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                name="latitude"
                                                value={formData.latitude || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Longitude</label>
                                            <input
                                                type="number"
                                                step="any"
                                                name="longitude"
                                                value={formData.longitude || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Info */}
                                <div className="md:col-span-2 space-y-6">
                                    <h4 className="text-[12px] uppercase tracking-[0.3em] text-[#C8A951] font-bold border-b border-[#C8A951]/20 pb-2">Location & SEO</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">City</label>
                                            <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">State</label>
                                            <input type="text" name="state" value={formData.state || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Postal Code</label>
                                            <input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Country</label>
                                            <input type="text" name="country" value={formData.country || ''} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]" required />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Meta Description (SEO)</label>
                                            <textarea
                                                name="metaDescription"
                                                value={formData.metaDescription || ''}
                                                onChange={handleInputChange}
                                                className="w-full h-24 px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C] resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Meta Keywords (Comma separated)</label>
                                            <textarea
                                                name="metaKeywords"
                                                value={formData.metaKeywords || ''}
                                                onChange={handleInputChange}
                                                className="w-full h-24 px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C] resize-none"
                                                placeholder="e.g. hair, nails, spa, luxury"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 sticky bottom-0 bg-white/90 backdrop-blur-md py-6 border-t border-[#C8A951]/10 rounded-b-[40px]">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-8 py-5 rounded-full border-2 border-[#1C1C1C]/10 text-[#1C1C1C] text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-all bg-transparent cursor-pointer"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-8 py-5 rounded-full bg-[#C8A951] text-[#1C1C1C] text-xs font-bold tracking-widest uppercase shadow-lg shadow-[#C8A951]/20 hover:bg-[#b39240] transition-all disabled:opacity-50 min-w-[200px] bg-transparent border-0 cursor-pointer"
                                >
                                    {isSubmitting ? "Saving..." : "Update Business"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Styles */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
                
                .font-\[Jost\,sans-serif\] { font-family: 'Jost', sans-serif; }
                .font-\[Cormorant_Garamond\,Georgia\,serif\] { font-family: 'Cormorant Garamond', Georgia, serif; }
                
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                
                ::-webkit-scrollbar {
                  width: 8px;
                }
                ::-webkit-scrollbar-track {
                  background: #F7F3EE;
                }
                ::-webkit-scrollbar-thumb {
                  background: #C8A951;
                  border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: #b39240;
                }
            `}</style>
            {/* ═══════════════════════════════════════════
                ADD/EDIT HOLIDAY MODAL
            ═══════════════════════════════════════════ */}
            {isAddHolidayModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-[#C8A951]/10 flex justify-between items-center rounded-t-[40px]">
                            <div>
                                <h3 className="font-[Cormorant_Garamond] text-3xl text-[#1C1C1C]">{isEditingHoliday ? 'Update' : 'Schedule'} Holiday</h3>
                                <p className="text-[#7a7065] text-xs uppercase tracking-widest font-bold mt-1">{isEditingHoliday ? 'Modify your closure details' : 'Mark your business as closed'}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAddHolidayModalOpen(false);
                                    setIsEditingHoliday(false);
                                }}
                                className="w-10 h-10 rounded-full bg-[#f5edce] flex items-center justify-center text-[#C8A951] hover:bg-[#C8A951] hover:text-white transition-all bg-transparent border-0 cursor-pointer"
                            >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleHolidaySubmit} className="p-10 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Holiday Date</label>
                                <input
                                    type="date"
                                    name="holidayDate"
                                    value={holidayFormData.holidayDate}
                                    onChange={handleHolidayInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#7a7065] uppercase tracking-widest mb-2">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="e.g. Holi Festival"
                                    value={holidayFormData.description}
                                    onChange={handleHolidayInputChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EE] border border-transparent focus:border-[#C8A951] focus:bg-white transition-all outline-none font-medium text-[#1C1C1C]"
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-[#F7F3EE] p-5 rounded-2xl">
                                <input
                                    type="checkbox"
                                    id="isRepeatingYearly"
                                    name="isRepeatingYearly"
                                    checked={holidayFormData.isRepeatingYearly}
                                    onChange={handleHolidayInputChange}
                                    className="w-5 h-5 rounded accent-[#C8A951] cursor-pointer"
                                />
                                <label htmlFor="isRepeatingYearly" className="text-sm font-bold text-[#1C1C1C] cursor-pointer">Repeats Annually</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 rounded-full bg-[#1C1C1C] text-[#C8A951] text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-black disabled:opacity-50 border-0 cursor-pointer"
                            >
                                {isSubmitting ? (isEditingHoliday ? "UPDATING..." : "SCHEDULING...") : (isEditingHoliday ? "UPDATE HOLIDAY" : "SCHEDULE HOLIDAY")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAdminSalon;