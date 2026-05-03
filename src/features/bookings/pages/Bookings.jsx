import { useState, useEffect } from 'react';
import {
  getBookingsByBusinessApi,
  acceptBookingApi,
  rejectBookingApi,
  rescheduleBookingApi,
  createWalkinBookingApi
} from '@/features/bookings/services/bookingService';
import { getStaffByBusinessApi, getStaffSlotsApi, getStaffByIdApi } from '@/features/staff/services/staffService';
import { getActiveServicesByBusinessApi } from '@/features/services/services/serviceService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useBusiness } from '@/context/BusinessContext';

const Bookings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { businessId, loading: businessLoading } = useBusiness();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Accept Booking Modal State
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [eligibleStaff, setEligibleStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);

  // Reject Booking Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Reschedule Booking Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsByDate, setSlotsByDate] = useState({}); // { "2026-03-08": ["09:00", "09:30", ...] }
  const [selectedSlotDate, setSelectedSlotDate] = useState(""); // active date tab
  const [rescheduleData, setRescheduleData] = useState({
    reason: "",
    alternativeStaffId: "",
    alternativeDate: "",
    alternativeStartTime: ""
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Walk-in Booking State
  const [isWalkinModalOpen, setIsWalkinModalOpen] = useState(false);
  const [currentWalkinStep, setCurrentWalkinStep] = useState(1);
  const [isCreatingWalkin, setIsCreatingWalkin] = useState(false);
  const [businessServices, setBusinessServices] = useState([]);
  const [businessStaff, setBusinessStaff] = useState([]);
  const [walkinSlots, setWalkinSlots] = useState([]);
  const [isWalkinSlotsLoading, setIsWalkinSlotsLoading] = useState(false);
  const [walkinData, setWalkinData] = useState({
    staffId: "",
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: "",
    serviceIds: [],
    customerNotes: "",
    paymentMethod: "CASH",
    walkinCustomerName: "",
    walkinPhone: "",
    walkinEmail: ""
  });

  useEffect(() => {
    if (businessId) fetchMyBusinessAndBookings();
  }, [currentPage, sortOrder, businessId]);

  const fetchMyBusinessAndBookings = async () => {
    try {
      setLoading(true);
      const sortParam = `bookingDate,${sortOrder}`;
      const data = await getBookingsByBusinessApi(businessId, currentPage, 10, sortParam);
      setBookings(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAcceptModal = async (booking) => {
    setSelectedBooking(booking);
    setIsAcceptModalOpen(true);
    setSelectedStaffId("");
    setStaffLoading(true);
    setEligibleStaff([]);

    try {
      const targetStaffId = booking.staff?.id || booking.staffId;
      if (targetStaffId) {
        const res = await getStaffByIdApi(targetStaffId);
        const staff = res?.body || res;
        setEligibleStaff(staff ? [staff] : []);
        if (staff && staff.id) {
          setSelectedStaffId(staff.id.toString());
        }
      } else {
        console.warn("No staff assigned or requested for this booking yet.", booking);
      }
    } catch (error) {
      console.error("Error fetching staff by ID:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleAcceptBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !selectedStaffId) return;

    setIsAccepting(true);
    try {
      await acceptBookingApi(selectedBooking.id, selectedStaffId);
      setIsAcceptModalOpen(false);
      fetchMyBusinessAndBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert("Failed to accept booking. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleOpenRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !rejectReason.trim()) return;

    setIsRejecting(true);
    try {
      await rejectBookingApi(selectedBooking.id, rejectReason);
      setIsRejectModalOpen(false);
      fetchMyBusinessAndBookings();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleOpenRescheduleModal = async (booking) => {
    setSelectedBooking(booking);
    setIsRescheduleModalOpen(true);
    setStaffLoading(true);
    setEligibleStaff([]);
    setSlotsByDate({});
    setSelectedSlotDate("");

    setRescheduleData({
      reason: "",
      alternativeStaffId: "",
      alternativeDate: "",
      alternativeStartTime: ""
    });

    try {
      if (booking.services && booking.services.length > 0) {
        const serviceId = booking.services[0].id;
        const staffList = await getStaffByServiceApi(serviceId);
        setEligibleStaff(staffList);
      }
    } catch (error) {
      console.error("Error fetching staff for reschedule:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  // When a staff member is selected in reschedule modal, fetch their slots for next 3 days
  useEffect(() => {
    if (!rescheduleData.alternativeStaffId || !isRescheduleModalOpen) {
      setSlotsByDate({});
      setSelectedSlotDate("");
      return;
    }

    let isMounted = true;
    setSlotsLoading(true);
    setSlotsByDate({});
    setSelectedSlotDate("");

    const fetchSlots = async () => {
      try {
        // Use local date to avoid UTC offset issues (toISOString gives UTC)
        const now = new Date();
        const localFmt = (d) => {
          const yr = d.getFullYear();
          const mo = String(d.getMonth() + 1).padStart(2, '0');
          const dy = String(d.getDate()).padStart(2, '0');
          return `${yr}-${mo}-${dy}`;
        };
        const startDate = localFmt(now);
        const endD = new Date(now);
        endD.setDate(now.getDate() + 3);
        const endDate = localFmt(endD);

        console.log('[Slots] staffId:', rescheduleData.alternativeStaffId, '|', startDate, '->', endDate);

        const slots = await getStaffSlotsApi(
          rescheduleData.alternativeStaffId,
          startDate,
          endDate
        );

        if (!isMounted) return; // discard result if effect was cleaned up

        console.log('[Slots] count:', Array.isArray(slots) ? slots.length : typeof slots, slots);

        // Group by date — AVAILABLE only
        const grouped = {};
        (Array.isArray(slots) ? slots : []).forEach(slot => {
          if (!slot.date || slot.status !== 'AVAILABLE') return;
          if (!grouped[slot.date]) grouped[slot.date] = [];
          grouped[slot.date].push(slot.startTime?.substring(0, 5));
        });

        console.log('[Slots] grouped:', Object.keys(grouped));

        setSlotsByDate(grouped);

        const firstDate = Object.keys(grouped).sort()[0];
        if (firstDate) {
          setSelectedSlotDate(firstDate);
          setRescheduleData(prev => ({ ...prev, alternativeDate: firstDate, alternativeStartTime: "" }));
        }
      } catch (e) {
        console.error("[Slots] Error:", e);
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    };

    fetchSlots();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescheduleData.alternativeStaffId, isRescheduleModalOpen]);

  // Fetch Slots for Walk-in Booking
  useEffect(() => {
    if (!isWalkinModalOpen || !walkinData.staffId || !walkinData.bookingDate) {
      setWalkinSlots([]);
      return;
    }

    const fetchWalkinSlots = async () => {
      setIsWalkinSlotsLoading(true);
      try {
        const slots = await getStaffSlotsApi(walkinData.staffId, walkinData.bookingDate, walkinData.bookingDate);
        // Filter AVAILABLE slots
        const available = (Array.isArray(slots) ? slots : [])
          .filter(s => s.status === 'AVAILABLE')
          .map(s => s.startTime?.substring(0, 5));
        setWalkinSlots(available);
      } catch (error) {
        console.error("Error fetching walk-in slots:", error);
      } finally {
        setIsWalkinSlotsLoading(false);
      }
    };

    fetchWalkinSlots();
  }, [walkinData.staffId, walkinData.bookingDate, isWalkinModalOpen]);

  const handleRescheduleBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !rescheduleData.reason || !rescheduleData.alternativeStaffId || !rescheduleData.alternativeDate || !rescheduleData.alternativeStartTime) return;

    setIsRescheduling(true);
    try {
      const payload = {
        status: selectedBooking.status, // keep same status
        reason: rescheduleData.reason,
        alternativeStaffId: parseInt(rescheduleData.alternativeStaffId, 10),
        alternativeDate: rescheduleData.alternativeDate,
        alternativeStartTime: rescheduleData.alternativeStartTime
      };
      await rescheduleBookingApi(selectedBooking.id, payload);
      setIsRescheduleModalOpen(false);
      fetchMyBusinessAndBookings();
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert("Failed to reschedule booking. Please try again.");
    } finally {
      setIsRescheduling(false);
    }
  };

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: i === 0 ? "Today" : d.toLocaleDateString('en-GB', { weekday: 'short' }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString('en-GB', { month: 'short' })
      });
    }
    return days;
  };

  const handleOpenWalkinModal = async () => {
    setIsWalkinModalOpen(true);
    setCurrentWalkinStep(1);
    setLoading(true);
    try {
      const servicesResponse = await getActiveServicesByBusinessApi(businessId);
      // Active services API returns the array directly
      setBusinessServices(Array.isArray(servicesResponse) ? servicesResponse : []);
      
      const staffResponse = await getStaffByBusinessApi(businessId, 0, 100);
      // Staff API response is wrapped in { body: { content: [...] } }
      setBusinessStaff(staffResponse.body?.content || staffResponse.content || []);
    } catch (error) {
      console.error("Error fetching services/staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWalkinBooking = async (e) => {
    e.preventDefault();
    if (!walkinData.staffId || walkinData.serviceIds.length === 0 || !walkinData.walkinCustomerName || !walkinData.walkinPhone) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsCreatingWalkin(true);
    try {
      const payload = {
        ...walkinData,
        businessId: parseInt(businessId, 10),
        staffId: parseInt(walkinData.staffId, 10),
        serviceIds: walkinData.serviceIds.map(id => parseInt(id, 10))
      };
      await createWalkinBookingApi(payload);
      setIsWalkinModalOpen(false);
      setWalkinData({
        staffId: "",
        bookingDate: new Date().toISOString().split('T')[0],
        startTime: "12:00",
        serviceIds: [],
        customerNotes: "",
        paymentMethod: "CASH",
        walkinCustomerName: "",
        walkinPhone: "",
        walkinEmail: ""
      });
      fetchMyBusinessAndBookings();
    } catch (error) {
      console.error("Error creating walk-in booking:", error);
      alert("Failed to create walk-in booking. Please try again.");
    } finally {
      setIsCreatingWalkin(false);
    }
  };

  const formatDate = (dateString, timeString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = timeString ? timeString.substring(0, 5) : "";
    return `${dateFormatted} ${timeFormatted}`;
  };

  const normalizedBookings = bookings.map(booking => ({
    ...booking,
    status: booking.status?.trim().toUpperCase() || 'UNKNOWN',
    paymentStatus: booking.paymentStatus?.trim().toUpperCase() || 'UNKNOWN'
  }));

  const filteredBookings = normalizedBookings.filter(booking => {
    const matchesSearch =
      booking.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.phoneNumber?.includes(searchQuery);

    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesPayment = !paymentFilter || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="w-full font-jost min-h-[calc(100vh-80px)]">
      <main className="mx-auto px-6 lg:px-10 pb-12 pt-4 bg-transparent max-w-[1600px]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep">Business Bookings</h1>
            {/* <div className="flex items-center gap-3 text-sm text-secondary font-medium tracking-wide uppercase">
              <span>Total: {totalElements}</span>
            </div> */}
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'RECEPTIONIST' || user?.role === 'SUPER_ADMIN') && (
            <button
              onClick={handleOpenWalkinModal}
              className="px-6 py-3 bg-gold text-black-deep rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold/80 transition-all shadow-lg shadow-gold/20 flex items-center gap-2 group"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-300">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Walk-in
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-gold/10 p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px] flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep placeholder:text-slate-400"
                type="text"
                placeholder="Search by ID or custom name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
               className="md:hidden p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 flex-shrink-0"
               onClick={() => setIsFilterMenuOpen(true)}
            >
               <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
               </svg>
            </button>
          </div>

          <div className="hidden md:flex flex-wrap gap-4 items-center">
            <select
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none min-w-[150px] cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="BROADCASTED">Broadcasted</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none min-w-[150px] cursor-pointer"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
            >
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            <select
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none min-w-[150px] cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isFilterMenuOpen && (
          <div className="fixed inset-0 z-[600] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:hidden" onClick={() => setIsFilterMenuOpen(false)}>
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-black-deep">Filters</h3>
                <button onClick={() => setIsFilterMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="BROADCASTED">Broadcasted</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none cursor-pointer"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                >
                  <option value="">All Payments</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>

                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none cursor-pointer"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List - Card Layout */}
        <div className="space-y-4">
          {(loading || authLoading || businessLoading) ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gold/10 p-20 text-center text-secondary">
              <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
              <span>Loading bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gold/10 p-20 text-center text-secondary">
              <div className="flex flex-col items-center justify-center gap-2">
                <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                <span className="text-lg font-medium">No bookings found</span>
                <p className="text-sm opacity-70">Try adjusting your filters or search query.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map(booking => {
                return (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden hover:shadow-md transition-all group">
                    {/* Card Header: ID & Status */}
                    <div className="px-5 py-3 bg-[#FDFBF7] border-b border-gold/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="px-2.5 py-0.5 bg-black-deep text-gold rounded-full text-[9px] font-bold tracking-widest uppercase">
                          {booking.bookingNumber}
                        </div>
                        <span className="text-[11px] font-bold text-secondary tracking-tight uppercase">
                          {formatDate(booking.bookingDate, booking.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Booking Status */}
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Booking Status</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                              booking.status === 'BROADCASTED' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                booking.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-100' :
                                  booking.status === 'RESCHEDULED' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                    (booking.status === 'CANCELLED' || booking.status === 'CANCELLED_BY_CUSTOMER' || booking.status === 'CANCELLED_BY_SALON') ? 'bg-red-50 text-red-700 border border-red-100' :
                                      'bg-slate-50 text-slate-700 border border-slate-100'
                            }`}>
                            {booking.status}
                          </span>
                        </div>
                        {/* Payment Status */}
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            booking.paymentStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-slate-50 text-slate-700 border border-slate-100'
                            }`}>
                            {booking.paymentStatus || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-0.5 opacity-60">Customer</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/10 to-gold/30 flex items-center justify-center text-gold shadow-sm overflow-hidden shrink-0 border border-gold/5 font-bold text-base">
                              {booking.customer?.profileImageUrl ? (
                                <img src={booking.customer.profileImageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                booking.customer?.fullName?.charAt(0) || '?'
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-black-deep text-sm m-0 leading-tight truncate">{booking.customer?.fullName || 'Guest'}</h3>
                              <p className="text-secondary text-[11px] font-semibold mt-0.5 tracking-tight">{booking.customer?.phoneNumber || 'No Phone'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Staff Info */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-0.5 opacity-60">Expert Provider</p>
                          {booking.staff ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm overflow-hidden shrink-0 font-bold text-base">
                                {booking.staff.profileImageUrl ? (
                                  <img src={booking.staff.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  booking.staff.fullName?.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-black-deep text-sm m-0 leading-tight truncate">{booking.staff.fullName}</h3>
                                {booking.staff.designation && (
                                  <p className="text-[10px] text-gold font-bold uppercase tracking-tighter mt-0.5">{booking.staff.designation}</p>
                                )}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${booking.staff.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                  <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">
                                    {booking.staff.isAvailable ? 'Available Now' : 'Currently Busy'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-10 flex items-center italic text-secondary text-[11px] font-medium opacity-70">Waiting for assignment...</div>
                          )}
                        </div>

                        {/* Financials & Services */}
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-0.5 opacity-60">Service Summary</p>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-secondary uppercase tracking-tight">Final Amount</span>
                              <span className="font-extrabold text-black-deep text-base">AED {booking.finalAmount?.toFixed(0)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {booking.services?.map(svc => (
                                <span key={svc.id} className="text-[8px] font-extrabold bg-white px-1.5 py-0.5 rounded-lg border border-slate-200 text-slate-500 uppercase tracking-tighter">
                                  {svc.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      {(booking.customerNotes || booking.adminNotes) && (
                        <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {booking.customerNotes && (
                            <div>
                              <p className="text-[8px] font-extrabold text-secondary uppercase tracking-widest mb-1.5 flex items-center gap-1.5 opacity-70">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                Guest Message
                              </p>
                              <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-dashed border-gold/20 text-xs text-black-deep/80 italic leading-snug">
                                "{booking.customerNotes}"
                              </div>
                            </div>
                          )}
                          {booking.adminNotes && (
                            <div>
                              <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 opacity-70">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                Internal Memo
                              </p>
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-black-deep/85 leading-snug font-medium">
                                {booking.adminNotes}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap items-center justify-end gap-2.5">
                        {(booking.status === 'PENDING' || booking.status === 'BROADCASTED') && (
                          <>
                            <button
                              className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                              onClick={() => handleOpenRejectModal(booking)}
                            >
                              Reject
                            </button>
                            <button
                              className="px-6 py-2 bg-gold text-black-deep rounded-xl font-bold uppercase tracking-widest text-[9px] hover:shadow-md hover:brightness-105 transition-all active:scale-95"
                              onClick={() => handleOpenAcceptModal(booking)}
                            >
                              Approve Booking
                            </button>
                          </>
                        )}
{/* {(booking.status === 'CONFIRMED' || booking.status === 'PENDING' || booking.status === 'BROADCASTED' || booking.status === 'RESCHEDULED') && (
                          <button
                            className="px-4 py-2 bg-white text-black-deep border border-slate-200 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:border-gold hover:text-gold transition-all active:scale-95 shadow-sm"
                            onClick={() => handleOpenRescheduleModal(booking)}
                          >
                            Reschedule
                          </button>
                        )} */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gold/10 bg-[#FDFBF7] flex items-center justify-between">
            <div className="text-secondary text-sm font-medium">
              Showing page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <button
                className="px-3 py-2 text-slate-400 hover:text-black-deep hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 text-sm font-medium border-l border-slate-200 transition-colors
                      ${currentPage === idx ? 'bg-gold/10 text-gold' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                  onClick={() => setCurrentPage(idx)}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                className="px-3 py-2 border-l border-slate-200 text-slate-400 hover:text-black-deep hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Accept Booking Modal - Fixed z-index */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity" onClick={() => !isAccepting && setIsAcceptModalOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
              <h3 className="font-display text-2xl italic text-black-deep">Accept Booking</h3>
              <button
                className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors"
                onClick={() => setIsAcceptModalOpen(false)}
                disabled={isAccepting}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleAcceptBooking}>
              <div className="px-6 py-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Assigned Expert</label>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                    <span className="text-secondary mr-2">Required Service:</span>
                    <span className="font-bold text-black-deep">{selectedBooking?.services?.[0]?.name || 'N/A'}</span>
                  </div>

                  {staffLoading ? (
                    <div className="py-12 text-center text-secondary text-sm flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                      <span className="font-medium">Fetching assigned expert...</span>
                    </div>
                  ) : eligibleStaff.length === 0 ? (
                    <div className="text-red-500 text-xs mt-2 bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col items-center text-center gap-2">
                      <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <p className="font-bold">No Staff Found</p>
                      <p>There is no staff assigned to this booking yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[320px] overflow-y-auto px-1 py-1 custom-scrollbar">
                      {eligibleStaff.map(staff => (
                        <div
                          key={staff.id || 'staff-assigned'}
                          className={`group relative p-4 rounded-2xl border-2 transition-all flex gap-4 ${selectedStaffId && staff.id && selectedStaffId === staff.id.toString()
                            ? 'border-gold bg-gold/5 shadow-md shadow-gold/10'
                            : 'border-slate-100 bg-white hover:border-gold/30 hover:bg-slate-50'
                            } ${!staff.isAvailable ? 'opacity-70' : ''}`}
                        >
                          {/* Staff Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/10 to-gold/30 flex items-center justify-center text-gold overflow-hidden border border-gold/10">
                              {(staff.userProfileImageUrl || staff.profileImageUrl) ? (
                                <img src={staff.userProfileImageUrl || staff.profileImageUrl} alt={staff.userFullName || staff.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg font-bold">{(staff.userFullName || staff.fullName)?.charAt(0)}</span>
                              )}
                            </div>
                            {staff.isAvailable ? (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" title="Available"></div>
                            ) : (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" title="Busy"></div>
                            )}
                          </div>

                          {/* Staff Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-black-deep text-sm truncate uppercase tracking-tight">{staff.userFullName || staff.fullName}</h4>
                                <p className="text-[11px] text-secondary font-medium uppercase tracking-wider">{staff.designation}</p>
                              </div>
                              {staff.averageRating && (
                                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-slate-100 shadow-sm shrink-0">
                                  <span className="text-gold text-[10px]">★</span>
                                  <span className="text-[10px] font-bold text-black-deep">{staff.averageRating}</span>
                                </div>
                              )}
                            </div>

                            <p className="text-[11px] text-secondary mt-2 line-clamp-1 italic">
                              {staff.bio || 'Professional salon specialist'}
                            </p>

                            <div className="mt-2.5 flex items-center gap-4">
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-secondary/70 font-bold">Bookings</span>
                                <span className="text-xs font-bold text-black-deep">{staff.totalBookings || '0'}</span>
                              </div>
                              <div className="w-px h-6 bg-slate-200"></div>
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-secondary/70 font-bold">Services</span>
                                <span className="text-xs font-bold text-black-deep">{staff.serviceCount || '1'}</span>
                              </div>
                              <div className="ml-auto">
                                <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
                  onClick={() => setIsAcceptModalOpen(false)}
                  disabled={isAccepting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isAccepting || !selectedStaffId}
                >
                  {isAccepting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {isAccepting ? 'Accepting...' : 'Accept Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Booking Modal - Fixed z-index */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity" onClick={() => !isRejecting && setIsRejectModalOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
              <h3 className="font-display text-2xl italic text-black-deep">Reject Booking</h3>
              <button
                className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isRejecting}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleRejectBooking}>
              <div className="px-6 py-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Rejection Reason</label>
                  <textarea
                    className="w-full mt-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all text-black-deep placeholder:text-slate-400 resize-none h-28"
                    placeholder="e.g. Staff not available, out of operational hours..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                    disabled={isRejecting}
                  />
                </div>
              </div>
              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isRejecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isRejecting || !rejectReason.trim()}
                >
                  {isRejecting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {isRejecting ? 'Rejecting...' : 'Reject Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Booking Modal - Fixed z-index */}
      {/* {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity" onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)}>
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7]">
              <h3 className="font-display text-2xl italic text-black-deep">Reschedule Booking</h3>
              <button
                className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors"
                onClick={() => setIsRescheduleModalOpen(false)}
                disabled={isRescheduling}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleRescheduleBooking}>
              <div className="px-6 py-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Reason for Rescheduling</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep placeholder:text-slate-400"
                    placeholder="e.g. Staff unavailable, Client request..."
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                    required
                    disabled={isRescheduling}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Select Alternative Staff</label>
                  {staffLoading ? (
                    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-xs text-secondary font-medium tracking-wide">Assigning experts...</span>
                    </div>
                  ) : eligibleStaff.length === 0 ? (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-xs text-center">
                      No staff members found for this service.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto px-1 py-1 custom-scrollbar">
                      {eligibleStaff.map(staff => (
                        <div
                          key={staff.id}
                          onClick={() => !isRescheduling && setRescheduleData({ ...rescheduleData, alternativeStaffId: staff.id.toString() })}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${rescheduleData.alternativeStaffId === staff.id.toString()
                            ? 'border-gold bg-gold/5'
                            : 'border-slate-100 bg-white hover:border-gold/20 hover:bg-slate-50'
                            }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-sm shrink-0">
                            {staff.userFullName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-black-deep text-[13px] truncate uppercase tracking-tight">{staff.userFullName}</h4>
                            <p className="text-[10px] text-secondary font-medium uppercase tracking-wider truncate">{staff.designation}</p>
                          </div>
                          {rescheduleData.alternativeStaffId === staff.id.toString() && (
                            <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {rescheduleData.alternativeStaffId && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Pick a Slot</label>

                    {slotsLoading ? (
                      <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-2"></div>
                        <span className="text-xs text-secondary font-medium">Fetching available slots...</span>
                      </div>
                    ) : Object.keys(slotsByDate).length === 0 ? (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-xs text-center">
                        No available slots found for the next 3 days.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {Object.keys(slotsByDate).sort().map(date => {
                            const d = new Date(date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isToday = d.toDateString() === today.toDateString();
                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => {
                                  setSelectedSlotDate(date);
                                  setRescheduleData(prev => ({ ...prev, alternativeDate: date, alternativeStartTime: "" }));
                                }}
                                className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border-2 transition-all ${selectedSlotDate === date
                                  ? 'bg-black-deep text-gold border-black-deep shadow-sm'
                                  : 'bg-white text-secondary border-slate-100 hover:border-gold/30'
                                  }`}
                              >
                                {isToday ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                              </button>
                            );
                          })}
                        </div>

                        {selectedSlotDate && slotsByDate[selectedSlotDate]?.length > 0 ? (
                          <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                            <div className="grid grid-cols-4 gap-2">
                              {slotsByDate[selectedSlotDate].map(time => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => {
                                    console.log('Time selected:', time);
                                    setRescheduleData(prev => ({ ...prev, alternativeStartTime: time }));
                                  }}
                                  className={`py-2 px-1 text-[11px] font-bold rounded-xl border-2 transition-all ${rescheduleData.alternativeStartTime === time
                                    ? 'bg-gold text-black-deep border-gold shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-100 hover:border-gold/40 hover:bg-gold/5'
                                    }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-center text-secondary py-3 italic">No slots on this day.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  disabled={isRescheduling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-black-deep bg-gold rounded-xl hover:bg-gold/80 hover:shadow-lg transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={
                    isRescheduling ||
                    !rescheduleData.reason ||
                    !rescheduleData.alternativeStaffId ||
                    !rescheduleData.alternativeDate ||
                    !rescheduleData.alternativeStartTime
                  }
                >
                  {isRescheduling && <div className="w-4 h-4 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin"></div>}
                  {isRescheduling ? 'Rescheduling...' : 'Reschedule Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      {/* Walk-in Booking Modal */}
      {isWalkinModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gold/10 flex justify-between items-center bg-[#FDFBF7] shrink-0">
              <div>
                <h3 className="font-display text-2xl italic text-black-deep">New Walk-in Booking</h3>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1 w-8 rounded-full ${currentWalkinStep >= s ? 'bg-gold' : 'bg-gold/20'}`} />
                  ))}
                </div>
              </div>
              <button
                className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-full transition-colors"
                onClick={() => setIsWalkinModalOpen(false)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {/* STEP 1: CUSTOMER DETAILS */}
              {currentWalkinStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Step 1: Customer Details</h4>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Customer Name *</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep"
                          placeholder="Full Name"
                          value={walkinData.walkinCustomerName}
                          onChange={(e) => setWalkinData({ ...walkinData, walkinCustomerName: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Phone *</label>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50"
                            placeholder="Phone Number"
                            value={walkinData.walkinPhone}
                            onChange={(e) => setWalkinData({ ...walkinData, walkinPhone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Email (Optional)</label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50"
                            placeholder="Email Address"
                            value={walkinData.walkinEmail}
                            onChange={(e) => setWalkinData({ ...walkinData, walkinEmail: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Notes</label>
                        <textarea
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 min-h-[100px] resize-none"
                          placeholder="Any special requests..."
                          value={walkinData.customerNotes}
                          onChange={(e) => setWalkinData({ ...walkinData, customerNotes: e.target.value })}
                        />
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: SERVICES */}
              {currentWalkinStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Step 2: Select Services</h4>
                   <div className="grid grid-cols-1 gap-2">
                      {businessServices.map(service => (
                        <label 
                          key={service.id} 
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            walkinData.serviceIds.includes(service.id.toString())
                              ? 'border-gold bg-gold/5'
                              : 'border-slate-50 bg-slate-50/50 hover:border-gold/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={walkinData.serviceIds.includes(service.id.toString())}
                              onChange={(e) => {
                                const ids = e.target.checked
                                  ? [...walkinData.serviceIds, service.id.toString()]
                                  : walkinData.serviceIds.filter(id => id !== service.id.toString());
                                setWalkinData({ ...walkinData, serviceIds: ids });
                              }}
                            />
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                              walkinData.serviceIds.includes(service.id.toString()) ? 'bg-gold border-gold' : 'bg-white border-slate-300'
                            }`}>
                              {walkinData.serviceIds.includes(service.id.toString()) && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                              )}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-black-deep uppercase tracking-tight">{service.name}</p>
                               <p className="text-[10px] text-secondary font-medium tracking-wider">{service.durationMinutes} Mins</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gold">₹{service.price}</span>
                        </label>
                      ))}
                   </div>
                </div>
              )}

              {/* STEP 3: STAFF & SLOTS */}
              {currentWalkinStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Step 3: Assign Staff & Time</h4>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Assign Staff Member *</label>
                        <select
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 appearance-none"
                          value={walkinData.staffId}
                          onChange={(e) => setWalkinData({ ...walkinData, staffId: e.target.value, startTime: "" })}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                          <option value="">Select Staff</option>
                          {businessStaff.map(staff => (
                            <option key={staff.id} value={staff.id}>{staff.userFullName} ({staff.designation})</option>
                          ))}
                        </select>
                      </div>

                      {walkinData.staffId && (
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Select Date *</label>
                              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                 {getNext7Days().map(day => (
                                    <button
                                      key={day.fullDate}
                                      type="button"
                                      onClick={() => setWalkinData({ ...walkinData, bookingDate: day.fullDate, startTime: "" })}
                                      className={`shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-2xl border-2 transition-all ${
                                        walkinData.bookingDate === day.fullDate
                                          ? 'bg-black-deep border-black-deep text-gold shadow-lg shadow-black-deep/20'
                                          : 'bg-white border-slate-100 text-secondary hover:border-gold/30'
                                      }`}
                                    >
                                       <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${walkinData.bookingDate === day.fullDate ? 'text-gold/60' : 'text-slate-400'}`}>
                                          {day.dayName}
                                       </span>
                                       <span className="text-sm font-bold">{day.dateNum}</span>
                                       <span className="text-[10px] font-medium uppercase tracking-tighter">{day.month}</span>
                                    </button>
                                 ))}
                              </div>
                           </div>
                           
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Available Slots *</label>
                              {isWalkinSlotsLoading ? (
                                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                   <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-2"></div>
                                   <span className="text-xs text-secondary font-medium uppercase tracking-widest">Fetching slots...</span>
                                </div>
                              ) : walkinSlots.length === 0 ? (
                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-xs text-center font-bold uppercase tracking-widest">
                                   No available slots for this date.
                                </div>
                              ) : (
                                <div className="grid grid-cols-4 gap-2">
                                   {walkinSlots.map(time => (
                                      <button
                                        key={time}
                                        type="button"
                                        onClick={() => setWalkinData({ ...walkinData, startTime: time })}
                                        className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${
                                          walkinData.startTime === time
                                            ? 'bg-gold border-gold text-black-deep shadow-lg shadow-gold/20'
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-gold/30'
                                        }`}
                                      >
                                        {time}
                                      </button>
                                   ))}
                                </div>
                              )}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* STEP 4: PAYMENT */}
              {currentWalkinStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Step 4: Payment Method</h4>
                   <div className="space-y-4">
                      {['CASH', 'UPI', 'CARD'].map(method => (
                        <label key={method} className="block cursor-pointer">
                           <input
                             type="radio"
                             name="walkinPayment"
                             className="hidden"
                             value={method}
                             checked={walkinData.paymentMethod === method}
                             onChange={(e) => setWalkinData({ ...walkinData, paymentMethod: e.target.value })}
                           />
                           <div className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                             walkinData.paymentMethod === method
                               ? 'border-gold bg-gold/5'
                               : 'border-slate-50 bg-slate-50/50 hover:border-gold/20'
                           }`}>
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                   walkinData.paymentMethod === method ? 'bg-gold text-black-deep' : 'bg-slate-200 text-slate-500'
                                 }`}>
                                    {method === 'CASH' && <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>}
                                    {method === 'UPI' && <span className="font-bold text-[10px]">UPI</span>}
                                    {method === 'CARD' && <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
                                 </div>
                                 <span className="font-bold text-black-deep tracking-wider">{method}</span>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                walkinData.paymentMethod === method ? 'border-gold bg-gold' : 'border-slate-300 bg-white'
                              }`}>
                                 {walkinData.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-black-deep" />}
                              </div>
                           </div>
                        </label>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <div className="px-6 py-5 bg-[#FDFBF7] border-t border-gold/10 flex justify-between items-center shrink-0">
              <button
                type="button"
                className={`px-6 py-3 text-xs font-bold text-secondary bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest ${currentWalkinStep === 1 ? 'invisible' : ''}`}
                onClick={() => setCurrentWalkinStep(prev => prev - 1)}
              >
                Back
              </button>
              
              <div className="flex gap-3">
                {currentWalkinStep < 4 ? (
                  <button
                    type="button"
                    className="px-8 py-3 bg-black-deep text-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black-deep/90 transition-all disabled:opacity-50"
                    disabled={
                      (currentWalkinStep === 1 && (!walkinData.walkinCustomerName || !walkinData.walkinPhone)) ||
                      (currentWalkinStep === 2 && walkinData.serviceIds.length === 0) ||
                      (currentWalkinStep === 3 && (!walkinData.staffId || !walkinData.startTime))
                    }
                    onClick={() => setCurrentWalkinStep(prev => prev + 1)}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleCreateWalkinBooking}
                    disabled={isCreatingWalkin}
                    className="px-8 py-3 bg-black-deep text-gold rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black-deep/90 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    {isCreatingWalkin ? (
                      <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    )}
                    Complete Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;


