import { useState, useEffect } from "react";
import { getMyBookingsApi } from "../services/bookingService";
import { toast } from "react-toastify";

const StaffBookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

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
        fetchMyBookings();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="w-full font-jost min-h-[calc(100vh-80px)]">
            <div className="mx-auto px-6 lg:px-10 pb-12 pt-4 bg-transparent max-w-[1600px]">
            <header className="mb-8">
                <h1 className="font-display text-4xl italic text-black-deep mb-2">My Bookings</h1>
                <p className="text-sm text-secondary font-medium tracking-wide uppercase opacity-60">Manage your assigned work schedule</p>
            </header>

            {/* Content */}
            <div className="min-h-[400px]">
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-secondary text-sm">Loading your schedule...</p>
                        </div>
                    ) : bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
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
            </div>
            </div>
        </div>
    );
};

export default StaffBookingManager;
