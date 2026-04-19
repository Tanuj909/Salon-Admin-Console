import { useState, useEffect } from "react";
import { getMyBookingsApi, getBookingDetailsByNumberApi, updateBookingStatusApi } from "../services/bookingService";
import { toast } from "react-toastify";

const StaffBookingManager = () => {
    const [activeTab, setActiveTab] = useState("my-bookings");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedBooking, setSearchedBooking] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Fetch My Bookings
    const fetchMyBookings = async () => {
        setLoading(true);
        try {
            const data = await getMyBookingsApi();
            setBookings(data.content || []);
        } catch (error) {
            console.error("Error fetching my bookings:", error);
            toast.error("Failed to load your bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "my-bookings") {
            fetchMyBookings();
        }
    }, [activeTab]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchedBooking(null);
        try {
            const data = await getBookingDetailsByNumberApi(searchQuery.trim());
            setSearchedBooking(data);
        } catch (error) {
            console.error("Error searching booking:", error);
            toast.error("Booking not found.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId) => {
        setUpdating(true);
        try {
            await updateBookingStatusApi(bookingId, 'IN_PROGRESS');
            toast.success("Status updated to IN_PROGRESS");
            
            // Refresh searched booking details if we were looking at it
            if (searchedBooking && (searchedBooking.id === bookingId || searchedBooking.bookingId === bookingId)) {
                handleSearch();
            }
            
            // Refresh my bookings if we are on that tab
            if (activeTab === "my-bookings") {
                fetchMyBookings();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="w-full font-jost min-h-[calc(100vh-80px)]">
            <div className="mx-auto px-6 lg:px-10 pb-12 pt-4 bg-transparent max-w-[1600px]">
            <header className="mb-8">
                <h1 className="font-display text-4xl italic text-black-deep mb-2">My Work</h1>
                <p className="text-sm text-secondary font-medium tracking-wide uppercase opacity-60">Manage your assigned bookings</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab("my-bookings")}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "my-bookings" ? 'text-black-deep' : 'text-slate-400'}`}
                >
                    My Bookings
                    {activeTab === "my-bookings" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab("search-update")}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "search-update" ? 'text-black-deep' : 'text-slate-400'}`}
                >
                    Search & Update
                    {activeTab === "search-update" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold rounded-t-full"></div>}
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === "my-bookings" ? (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-secondary text-sm">Loading your schedule...</p>
                            </div>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div key={booking.id} className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold text-xl border border-gold/10">
                                            {booking.customerName?.charAt(0) || booking.customer?.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black-deep">{booking.customerName || booking.customer?.fullName}</p>
                                            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                                                {formatDate(booking.bookingDate)}
                                            </p>
                                            <p className="text-xs text-secondary/60">
                                                {booking.startTime?.substring(0, 5)} - {booking.endTime?.substring(0, 5)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            booking.status === 'CONFIRMED' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                            booking.status === 'IN_PROGRESS' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                                            booking.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                                            'border-slate-200 bg-slate-50 text-slate-400'
                                        }`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center opacity-40">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium">No bookings assigned to you yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="bg-white rounded-2xl border border-gold/10 shadow-sm p-6">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                <div className="relative w-full sm:flex-1">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Enter Booking Number (e.g. BK-20260313-001)"
                                        className="w-full pl-12 pr-4 py-3.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-sm font-medium text-black-deep focus:outline-none focus:border-gold/40 transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !searchQuery.trim()}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-black-deep text-gold rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg transition-all disabled:opacity-40"
                                >
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </form>
                        </div>

                        {/* Search Result */}
                        {searchedBooking && (
                            <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden animate-in fade-in duration-500">
                                <div className="px-6 py-4 bg-[#FDFBF7] border-b border-gold/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-secondary">
                                            {formatDate(searchedBooking.bookingDate)}
                                        </span>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        searchedBooking.status === 'CONFIRMED' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                        searchedBooking.status === 'IN_PROGRESS' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                                        searchedBooking.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                                        'border-slate-200 bg-slate-50 text-slate-400'
                                    }`}>
                                        {searchedBooking.status}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/25 flex items-center justify-center text-gold font-bold text-2xl border border-gold/10">
                                            {searchedBooking.customerName?.charAt(0) || searchedBooking.customer?.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-black-deep">{searchedBooking.customerName || searchedBooking.customer?.fullName}</p>
                                            <p className="text-sm text-secondary">{searchedBooking.customerPhone || searchedBooking.customer?.phone || "No phone provided"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-[#FDFBF7] p-4 rounded-xl border border-gold/5">
                                            <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Time Slot</p>
                                            <p className="font-bold text-sm text-black-deep">
                                                {searchedBooking.startTime?.substring(0, 5)} - {searchedBooking.endTime?.substring(0, 5)}
                                            </p>
                                        </div>
                                        <div className="bg-[#FDFBF7] p-4 rounded-xl border border-gold/5">
                                            <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Staff Member</p>
                                            <p className="font-bold text-sm text-black-deep">
                                                {searchedBooking.staffName || searchedBooking.staff?.fullName || "Not Assigned"}
                                            </p>
                                        </div>
                                    </div>

                                    {searchedBooking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(searchedBooking.id || searchedBooking.bookingId)}
                                            disabled={updating}
                                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {updating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                            {updating ? "Updating..." : "Start Session (IN_PROGRESS)"}
                                        </button>
                                    )}
                                    
                                    {searchedBooking.status === 'IN_PROGRESS' && (
                                        <div className="w-full py-4 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl font-bold uppercase tracking-widest text-xs text-center">
                                            Session currently in progress
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default StaffBookingManager;
