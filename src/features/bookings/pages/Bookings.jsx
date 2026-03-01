import { useState, useEffect } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getBookingsByBusinessApi, acceptBookingApi, rejectBookingApi, rescheduleBookingApi } from "@/features/bookings/services/bookingService";
import { getStaffByServiceApi } from "@/features/staff/services/staffService";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);

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

  useEffect(() => {
    fetchMyBusinessAndBookings();
  }, [currentPage, sortOrder]);

  const fetchMyBusinessAndBookings = async () => {
    try {
      setLoading(true);
      let bId = businessId;
      if (!bId) {
        const business = await getMyBusinessApi();
        bId = business.id;
        setBusinessId(bId);
      }

      const sortParam = `bookingDate,${sortOrder}`;
      const data = await getBookingsByBusinessApi(bId, currentPage, 10, sortParam);
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
      if (booking.services && booking.services.length > 0) {
        const serviceId = booking.services[0].id;
        const staffList = await getStaffByServiceApi(serviceId);
        setEligibleStaff(staffList);
      }
    } catch (error) {
      console.error("Error fetching staff for service:", error);
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
    setRescheduleData({
      reason: "",
      alternativeStaffId: "",
      alternativeDate: "",
      alternativeStartTime: ""
    });
    setIsRescheduleModalOpen(true);
    setStaffLoading(true);
    setEligibleStaff([]);

    try {
      if (booking.services && booking.services.length > 0) {
        const serviceId = booking.services[0].id;
        const staffList = await getStaffByServiceApi(serviceId);
        setEligibleStaff(staffList);
      }
    } catch (error) {
      console.error("Error fetching staff for rescheduling:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleRescheduleBooking = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !rescheduleData.reason || !rescheduleData.alternativeStaffId || !rescheduleData.alternativeDate || !rescheduleData.alternativeStartTime) return;

    setIsRescheduling(true);
    try {
      const payload = {
        status: "RESCHEDULED",
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

  const formatDate = (dateString, timeString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeFormatted = timeString ? timeString.substring(0, 5) : "";
    return `${dateFormatted} ${timeFormatted}`;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesPayment = !paymentFilter || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)]">
      <main className="container mx-auto pb-12 pt-4 bg-transparent max-w-5xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl italic text-black-deep mb-2">Business Bookings</h1>
            <div className="flex items-center gap-3 text-sm text-secondary font-medium tracking-wide uppercase">
              <span>Business ID: {businessId || 'N/A'}</span>
              <span className="w-1 h-1 rounded-full bg-gold/50"></span>
              <span>Total: {totalElements}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-gold/10 p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep placeholder:text-slate-400"
              type="text"
              placeholder="Search by ID or custom name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none min-w-[150px] cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option>
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

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#FDFBF7] border-b border-gold/10">
                <tr>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Booking ID & Date</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Customer</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Services</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Staff</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Total</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Payment</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-6 py-4 font-bold text-secondary uppercase tracking-widest text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-secondary">Loading bookings...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-secondary">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        <span>No bookings found for the selected filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gold/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-black-deep tracking-wide">{booking.bookingNumber}</div>
                        <div className="text-[11px] text-secondary mt-1">
                          {formatDate(booking.bookingDate, booking.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 text-black-deep flex items-center justify-center font-bold text-xs uppercase">
                            {booking.customer?.firstName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-black-deep">{booking.customer?.firstName} {booking.customer?.lastName}</div>
                            <div className="text-[11px] text-secondary">{booking.customer?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600" title={booking.services?.map(s => s.name).join(', ')}>
                          {booking.services?.length > 0
                            ? booking.services[0].name + (booking.services.length > 1 ? ` (+${booking.services.length - 1})` : '')
                            : 'No services'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-black-deep text-sm">
                          {booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}` : <span className="text-secondary italic">Unassigned</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-black-deep">₹{booking.finalAmount?.toFixed(2) || '0.00'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${booking.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border border-green-200' :
                          booking.paymentStatus === 'PENDING' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            booking.paymentStatus === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-200' :
                              'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}>
                          {booking.paymentStatus || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            booking.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' :
                              booking.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' :
                                booking.status === 'RESCHEDULED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                  'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}>
                          {booking.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                className="px-3 py-1.5 bg-gold text-white rounded font-bold uppercase tracking-wider text-[10px] hover:bg-gold/80 transition-colors"
                                onClick={() => handleOpenAcceptModal(booking)}
                              >
                                Accept
                              </button>
                              <button
                                className="px-3 py-1.5 bg-red-50 text-red-700 rounded font-bold uppercase tracking-wider text-[10px] border border-red-200 hover:bg-red-100 transition-colors"
                                onClick={() => handleOpenRejectModal(booking)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                            <button
                              className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded font-bold uppercase tracking-wider text-[10px] border border-slate-200 hover:bg-slate-100 transition-colors"
                              onClick={() => handleOpenRescheduleModal(booking)}
                            >
                              Reschedule
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
        </div>
      </main>

      {/* Accept Booking Modal */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity" onClick={() => !isAccepting && setIsAcceptModalOpen(false)}>
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
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Assign Staff Member</label>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                    <span className="text-secondary mr-2">Required Service:</span>
                    <span className="font-bold text-black-deep">{selectedBooking?.services?.[0]?.name || 'N/A'}</span>
                  </div>

                  {staffLoading ? (
                    <div className="py-4 text-center text-secondary text-sm flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                      Loading available staff...
                    </div>
                  ) : (
                    <select
                      className="w-full mt-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none cursor-pointer"
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      required
                      disabled={isAccepting || eligibleStaff.length === 0}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em`, paddingRight: `2.5rem` }}
                    >
                      <option value="" disabled>Select a staff member</option>
                      {eligibleStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.userFullName} - {staff.designation} {staff.isAvailable ? '' : '(Busy)'}
                        </option>
                      ))}
                    </select>
                  )}

                  {!staffLoading && eligibleStaff.length === 0 && (
                    <div className="text-red-500 text-xs mt-2 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      No staff members setup for this service.
                    </div>
                  )}

                  {selectedStaffId && (
                    <div className="mt-4 p-4 bg-gold/5 border border-gold/10 rounded-xl">
                      {(() => {
                        const staff = eligibleStaff.find(s => s.id.toString() === selectedStaffId.toString());
                        if (!staff) return null;
                        return (
                          <>
                            <div className="font-bold text-black-deep text-base">{staff.userFullName}</div>
                            <div className="text-sm text-secondary mt-1">{staff.bio || 'No bio available'}</div>
                            <div className="mt-3 flex gap-4 text-xs font-medium">
                              <span className="flex items-center gap-1"><span className="text-gold">★</span> {staff.averageRating || 'New'}</span>
                              <span className="flex items-center gap-1 text-slate-500">Bookings: {staff.totalBookings || 0}</span>
                            </div>
                          </>
                        );
                      })()}
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
                  {isAccepting ? 'Accepting...' : 'Confirm & Accept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Booking Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity" onClick={() => !isRejecting && setIsRejectModalOpen(false)}>
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

      {/* Reschedule Booking Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity" onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)}>
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
                    <div className="py-3 text-secondary text-sm flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                      Loading available staff...
                    </div>
                  ) : (
                    <select
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep appearance-none cursor-pointer"
                      value={rescheduleData.alternativeStaffId}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeStaffId: e.target.value })}
                      required
                      disabled={isRescheduling || eligibleStaff.length === 0}
                      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em`, paddingRight: `2.5rem` }}
                    >
                      <option value="" disabled>Select new staff member</option>
                      {eligibleStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.userFullName} - {staff.designation}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Alternative Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep"
                      value={rescheduleData.alternativeDate}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeDate: e.target.value })}
                      required
                      disabled={isRescheduling}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Alternative Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all text-black-deep"
                      value={rescheduleData.alternativeStartTime}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeStartTime: e.target.value })}
                      required
                      disabled={isRescheduling}
                    />
                  </div>
                </div>
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
                  {isRescheduling ? 'Rescheduling...' : 'Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Bookings;
