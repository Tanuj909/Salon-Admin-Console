import { useState, useEffect } from "react";
import { getMyBusinessApi } from "@/features/salons/services/salonService";
import { getBookingsByBusinessApi, acceptBookingApi, rejectBookingApi, rescheduleBookingApi } from "../services/bookingService";
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
  const [sortOrder, setSortOrder] = useState("desc"); // desc or asc

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
    setSelectedStaffId(""); // Reset previously selected staff
    setStaffLoading(true);
    setEligibleStaff([]);

    try {
      // Assuming the booking has at least one service, we fetch staff based on the first service.
      // Adjust this logic if staff selection needs to handle multiple services differently.
      if (booking.services && booking.services.length > 0) {
        const serviceId = booking.services[0].id;
        const staffList = await getStaffByServiceApi(serviceId);
        // Filter to show only available staff visually, or just list them
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
      fetchMyBusinessAndBookings(); // Refresh the list
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-green';
      case 'PENDING': return 'badge-amber';
      case 'CANCELLED': return 'badge-red';
      case 'COMPLETED': return 'badge-blue';
      case 'RESCHEDULED': return 'badge-blue'; // Added for rescheduled status
      default: return 'badge-gray';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'PAID': return 'badge-green';
      case 'PENDING': return 'badge-amber';
      case 'FAILED': return 'badge-red';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page active" style={{ minHeight: '100vh', padding: '0' }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@600;700&display=swap');

        .bookings-container {
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          padding: 32px;
          width: 100%;
          margin: 0 auto;
        }

        .bookings-container *, .bookings-container *::before, .bookings-container *::after { 
            box-sizing: border-box; 
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .page-header-left h1 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.3px;
          margin: 0;
        }

        .page-header-left p {
          font-size: 13.5px;
          color: #6B7280;
          margin-top: 4px;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 320px;
        }

        .search-wrap svg {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-input:focus { border-color: #1B3F6E; }
        .search-input::placeholder { color: #9CA3AF; }

        .filter-select {
          padding: 8px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 7px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #374151;
          background: #FFFFFF;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
          transition: border-color 0.15s;
        }
        .filter-select:focus { border-color: #1B3F6E; }

        .table-container {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: #F9FAFB;
          border-bottom: 1px solid #E5E7EB;
        }

        thead th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #6B7280;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid #F3F4F6;
          transition: background 0.12s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #F8FAFC; }

        tbody td {
          padding: 14px 16px;
          vertical-align: middle;
          font-size: 13.5px;
          color: #374151;
        }

        .booking-id {
          font-weight: 600;
          font-size: 14px;
          color: #111827;
          margin-bottom: 3px;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .customer-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #F3F4F6;
          color: #6B7280;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600;
          font-size: 13px;
        }

        .customer-name {
          font-weight: 500;
          color: #111827;
        }

        .customer-email {
          font-size: 12px;
          color: #6B7280;
        }

        .service-list {
          font-size: 13px;
          color: #4B5563;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .badge-gray {
          background: #F3F4F6;
          color: #374151;
          border: 1px solid #E5E7EB;
        }

        .badge-green {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .badge-amber {
          background: #FFFBEB;
          color: #92400E;
          border: 1px solid #FCD34D;
        }

        .badge-red {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .badge-blue {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
        }

        .price-main {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid #E5E7EB;
          background: #FFFFFF;
          border-radius: 0 0 10px 10px;
        }

        .pagination-info {
          font-size: 13px;
          color: #6B7280;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.15s;
        }

        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .page-btn.current {
          background: #1B3F6E;
          border-color: #1B3F6E;
          color: white;
          cursor: default;
          opacity: 1;
        }

        .empty-row td {
          text-align: center;
          padding: 48px 0;
          color: #6B7280;
          font-size: 13.5px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #1B3F6E;
          color: white;
          border: none;
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #152f55; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal {
          background: #FFFFFF;
          width: 100%;
          max-width: 460px;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.15s;
        }
        .modal-close:hover { color: #374151; }

        .modal-body {
          padding: 24px;
        }

        .modal-form-group {
          margin-bottom: 20px;
        }
        .modal-form-group:last-child { margin-bottom: 0; }

        .modal-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .modal-input, .modal-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .modal-input:focus, .modal-select:focus {
          border-color: #1B3F6E;
          box-shadow: 0 0 0 3px rgba(27, 63, 110, 0.1);
        }

        .modal-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #E5E7EB;
          background: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-secondary {
          background: #FFFFFF;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-secondary:hover { background: #F3F4F6; }

        .btn-submit {
          background: #1B3F6E;
          color: white;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-submit:hover { background: #152f55; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-danger {
          background: #DC2626;
        }
        .btn-danger:hover { background: #B91C1C; }

        .staff-summary {
          margin-top: 12px;
          padding: 12px;
          background: #F3F4F6;
          border-radius: 8px;
          font-size: 12.5px;
          color: #4B5563;
        }
        `}
      </style>

      <main className="bookings-container">
        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Business Bookings</h1>
            <p>Manage and view all appointments &nbsp;·&nbsp; Business ID: {businessId || '...'} &nbsp;·&nbsp; Total: {totalElements}</p>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-wrap">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search by ID or custom name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option> {/* Added for rescheduled status */}
          </select>
          <select
            className="filter-select"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* ── Table ── */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID & Date</th>
                <th>Customer</th>
                <th>Services</th>
                <th>Staff</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="empty-row">
                  <td colSpan="8">Loading bookings...</td> {/* Changed colspan to 8 */}
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="8">No bookings found for the selected filters.</td> {/* Changed colspan to 8 */}
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-id">{booking.bookingNumber}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        {formatDate(booking.bookingDate, booking.startTime)}
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {booking.customer?.firstName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="customer-name">{booking.customer?.firstName} {booking.customer?.lastName}</div>
                          <div className="customer-email">{booking.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="service-list" title={booking.services?.map(s => s.name).join(', ')}>
                        {booking.services?.length > 0
                          ? booking.services[0].name + (booking.services.length > 1 ? ` (+${booking.services.length - 1})` : '')
                          : 'No services'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '500', color: '#374151' }}>
                        {booking.staff ? `${booking.staff.firstName} ${booking.staff.lastName}` : 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <span className="price-main">₹{booking.finalAmount?.toFixed(2) || '0.00'}</span>
                    </td>
                    <td>
                      <span className={`badge ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              className="btn-primary"
                              onClick={() => handleOpenAcceptModal(booking)}
                            >
                              Accept
                            </button>
                            <button
                              className="btn-secondary"
                              style={{ padding: '7px 14px', fontSize: '12.5px', color: '#DC2626', borderColor: '#FCA5A5', background: '#FEF2F2' }}
                              onClick={() => handleOpenRejectModal(booking)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '7px 14px', fontSize: '12.5px' }}
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

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <div className="pagination-info">
                Showing page {currentPage + 1} of {totalPages}
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`page-btn ${currentPage === idx ? 'current' : ''}`}
                    onClick={() => setCurrentPage(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  className="page-btn"
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
      {/* ── Accept Booking Modal ── */}
      {isAcceptModalOpen && (
        <div className="modal-overlay" onClick={() => !isAccepting && setIsAcceptModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Accept Booking</h3>
              <button
                className="modal-close"
                onClick={() => setIsAcceptModalOpen(false)}
                disabled={isAccepting}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleAcceptBooking}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">Assign Staff Member</label>
                  <div style={{ marginBottom: '8px', fontSize: '12px', color: '#6B7280' }}>
                    Required Service: <span style={{ fontWeight: 600, color: '#374151' }}>{selectedBooking?.services?.[0]?.name || 'N/A'}</span>
                  </div>
                  {staffLoading ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                      Loading available staff...
                    </div>
                  ) : (
                    <select
                      className="modal-select"
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      required
                      disabled={isAccepting || eligibleStaff.length === 0}
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
                    <div style={{ marginTop: '8px', color: '#DC2626', fontSize: '12.5px' }}>
                      No staff members setup for this service.
                    </div>
                  )}

                  {selectedStaffId && (
                    <div className="staff-summary">
                      {(() => {
                        const staff = eligibleStaff.find(s => s.id.toString() === selectedStaffId.toString());
                        if (!staff) return null;
                        return (
                          <>
                            <div style={{ fontWeight: 600 }}>{staff.userFullName}</div>
                            <div style={{ marginTop: '2px' }}>{staff.bio || 'No bio available'}</div>
                            <div style={{ marginTop: '4px', display: 'flex', gap: '12px' }}>
                              <span>⭐ {staff.averageRating || 'New'}</span>
                              <span>Bookings: {staff.totalBookings || 0}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAcceptModalOpen(false)}
                  disabled={isAccepting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isAccepting || !selectedStaffId}
                >
                  {isAccepting ? 'Accepting...' : 'Confirm & Accept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reject Booking Modal ── */}
      {isRejectModalOpen && (
        <div className="modal-overlay" onClick={() => !isRejecting && setIsRejectModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Booking</h3>
              <button
                className="modal-close"
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isRejecting}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleRejectBooking}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">Rejection Reason</label>
                  <textarea
                    className="modal-input modal-textarea"
                    placeholder="e.g. Staff not available, out of operational hours..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                    disabled={isRejecting}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isRejecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit btn-danger"
                  disabled={isRejecting || !rejectReason.trim()}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reschedule Booking Modal ── */}
      {isRescheduleModalOpen && (
        <div className="modal-overlay" onClick={() => !isRescheduling && setIsRescheduleModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reschedule Booking</h3>
              <button
                className="modal-close"
                onClick={() => setIsRescheduleModalOpen(false)}
                disabled={isRescheduling}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleRescheduleBooking}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">Reason for Rescheduling</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Staff unavailable, Client request..."
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                    required
                    disabled={isRescheduling}
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">Select Alternative Staff</label>
                  {staffLoading ? (
                    <div style={{ padding: '8px', color: '#6B7280', fontSize: '13px' }}>
                      Loading available staff...
                    </div>
                  ) : (
                    <select
                      className="modal-select"
                      value={rescheduleData.alternativeStaffId}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeStaffId: e.target.value })}
                      required
                      disabled={isRescheduling || eligibleStaff.length === 0}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="modal-form-group">
                    <label className="modal-label">Alternative Date</label>
                    <input
                      type="date"
                      className="modal-input"
                      value={rescheduleData.alternativeDate}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeDate: e.target.value })}
                      required
                      disabled={isRescheduling}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Alternative Time</label>
                    <input
                      type="time"
                      className="modal-input"
                      value={rescheduleData.alternativeStartTime}
                      onChange={(e) => setRescheduleData({ ...rescheduleData, alternativeStartTime: e.target.value })}
                      required
                      disabled={isRescheduling}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  disabled={isRescheduling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={
                    isRescheduling ||
                    !rescheduleData.reason ||
                    !rescheduleData.alternativeStaffId ||
                    !rescheduleData.alternativeDate ||
                    !rescheduleData.alternativeStartTime
                  }
                >
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
