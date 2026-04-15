import { useState } from "react";
import { getBookingDetailsByNumberApi, processPaymentApi, getBillDetailsApi, updateBookingStatusApi } from "../services/bookingService";
import { toast } from "react-hot-toast";
import BillModal from "../components/BillModal";

const PAYMENT_METHODS = [
    { value: "CASH", label: "Cash", icon: "💵" },
    { value: "UPI", label: "UPI", icon: "📱" },
    { value: "CARD", label: "Card", icon: "💳" },
    { value: "NET_BANKING", label: "Net Banking", icon: "🏦" },
];

const CompleteBooking = () => {
    const [bookingNumber, setBookingNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(null);
    const [billData, setBillData] = useState(null);
    const [showBillModal, setShowBillModal] = useState(false);

    // Payment form state
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [amountPaid, setAmountPaid] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!bookingNumber.trim()) return;

        setLoading(true);
        setBooking(null);
        setBillData(null);
        setShowPaymentForm(false);
        setPaymentSuccess(null);
        try {
            const data = await getBookingDetailsByNumberApi(bookingNumber.trim());
            setBooking(data);
            setAmountPaid(data.finalAmount?.toString() || "");
            setDiscountAmount(data.discountAmount?.toString() || "0");
            setPaymentMethod("CASH");
            setNotes("");

            // Fetch bill details
            const bill = await getBillDetailsApi(bookingNumber.trim());
            setBillData(bill);
        } catch (error) {
            console.error("Error fetching booking details:", error);
            toast.error(error.response?.data?.message || "Booking not found or unexpected error.");
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        if (!booking) return;

        setProcessing(true);
        try {
            const payload = {
                bookingNumber: booking.bookingNumber,
                paymentMethod,
                amountPaid: parseFloat(amountPaid),
                discountAmount: parseFloat(discountAmount) || 0,
                notes: notes.trim() || null,
            };
            const result = await processPaymentApi(payload);
            setPaymentSuccess(result);
            setShowPaymentForm(false);
            toast.success("Payment processed successfully!");

            // Refresh bill details to show Complete Booking button
            const bill = await getBillDetailsApi(booking.bookingNumber);
            setBillData(bill);
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error(error.response?.data?.message || "Payment processing failed.");
        } finally {
            setProcessing(false);
        }
    };

    const handleCompleteBooking = async () => {
        if (!booking) return;

        setProcessing(true);
        try {
            await updateBookingStatusApi(booking.id || booking.bookingId, 'COMPLETED');
            toast.success("Booking marked as completed!");

            // Refresh both to get latest status
            const updatedBooking = await getBookingDetailsByNumberApi(booking.bookingNumber);
            setBooking(updatedBooking);
        } catch (error) {
            console.error("Error completing booking:", error);
            toast.error(error.response?.data?.message || "Failed to complete booking.");
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const statusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' };
            case 'COMPLETED': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' };
            case 'PENDING': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' };
            case 'CANCELLED': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' };
        }
    };

    const sc = booking ? statusColor(booking.status) : {};

    return (
        <div className="w-full font-jost min-h-[calc(100vh-80px)]">
            <main className="mx-auto px-6 lg:px-10 pb-12 pt-4 bg-transparent max-w-[1600px]">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h1 className="font-display text-4xl italic text-black-deep mb-2">Complete Booking</h1>
                        <p className="text-sm text-secondary font-medium tracking-wide uppercase opacity-60">Search · Verify · Settle Payment</p>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-2xl border border-gold/10 shadow-sm p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={bookingNumber}
                                onChange={(e) => setBookingNumber(e.target.value)}
                                placeholder="Enter Booking Number (e.g. BKG-2026-0001)"
                                className="w-full pl-12 pr-4 py-3.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-sm font-medium text-black-deep focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !bookingNumber.trim()}
                            className="px-8 py-3.5 bg-black-deep text-gold rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 shrink-0 flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    Search
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-2xl border border-gold/10 shadow-sm p-20 text-center">
                        <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4"></div>
                        <span className="text-secondary font-medium text-sm">Retrieving booking data...</span>
                    </div>
                )}

                {/* Payment Success Banner */}
                {paymentSuccess && (
                    <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden mb-6">
                        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="font-bold text-emerald-800 text-sm uppercase tracking-wide">Payment Processed Successfully</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-5">
                            <div>
                                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Booking</p>
                                <p className="font-bold text-sm text-black-deep">{paymentSuccess.bookingNumber}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Method</p>
                                <p className="font-bold text-sm text-black-deep">{paymentSuccess.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Amount Paid</p>
                                <p className="font-bold text-sm text-emerald-600">₹{paymentSuccess.amountPaid}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Discount</p>
                                <p className="font-bold text-sm text-black-deep">₹{paymentSuccess.discountAmount}</p>
                            </div>
                            {paymentSuccess.notes && (
                                <div className="col-span-full pt-3 border-t border-slate-100">
                                    <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Notes</p>
                                    <p className="text-xs text-secondary italic">"{paymentSuccess.notes}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Booking Result */}
                {booking && !loading && (
                    <div className="space-y-6">

                        {/* Booking Header Card */}
                        <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-[#FDFBF7] border-b border-gold/10 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="px-3 py-1 bg-black-deep text-gold rounded-lg text-[10px] font-black tracking-widest uppercase">
                                        {booking.bookingNumber}
                                    </div>
                                    <span className="text-xs font-bold text-secondary tracking-tight">
                                        {formatDate(booking.bookingDate)} · {booking.startTime?.substring(0, 5)} – {booking.endTime?.substring(0, 5)}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text} border ${sc.border}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                    {booking.status}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Customer Info */}
                                    <div>
                                        <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-3">Guest Information</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/10 to-gold/25 flex items-center justify-center text-gold font-bold text-lg border border-gold/10 shrink-0">
                                                {booking.customerName?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-black-deep truncate">{booking.customerName}</p>
                                                <p className="text-[11px] text-secondary font-medium">{booking.customerPhone}</p>
                                                <p className="text-[10px] text-secondary/50 truncate">{booking.customerEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    <div>
                                        <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-3">Services</p>
                                        <div className="space-y-2">
                                            {booking.services?.map((svc, idx) => (
                                                <div key={idx} className="flex items-center justify-between px-3 py-2 bg-[#FDFBF7] rounded-lg border border-gold/5">
                                                    <div>
                                                        <p className="font-bold text-xs text-black-deep">{svc.name}</p>
                                                        <p className="text-[9px] text-secondary/50 font-medium">{svc.quantity} × ₹{svc.price}</p>
                                                    </div>
                                                    <p className="font-bold text-xs text-black-deep">₹{svc.subtotal}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Billing Summary */}
                                    <div>
                                        <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mb-3">Billing</p>
                                        <div className="bg-black-deep rounded-xl p-4 text-white relative overflow-hidden">
                                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/8 rounded-full blur-[40px]"></div>
                                            <div className="space-y-2 relative z-10">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white/50">Total</span>
                                                    <span className="font-bold">₹{booking.totalAmount}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gold/60">Discount</span>
                                                    <span className="font-bold text-gold/80">- ₹{booking.discountAmount}</span>
                                                </div>
                                                <div className="h-px bg-white/10 my-1"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-bold text-gold/40 uppercase tracking-widest">Payable</span>
                                                    <span className="text-xl font-display italic text-gold">₹{booking.finalAmount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-3 space-y-2">
                                            {/* Generate Bill Button - Always Visible */}
                                            <button
                                                disabled={!billData?.payments?.length && !paymentSuccess}
                                                onClick={() => setShowBillModal(true)}
                                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${(billData?.payments?.length > 0 || paymentSuccess)
                                                    ? "bg-black-deep text-gold hover:shadow-lg active:scale-[0.98]"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                Generate Bill
                                            </button>

                                            <div className="h-px bg-slate-100 my-1"></div>

                                            {/* Status specific buttons/badges */}
                                            {booking.status === 'COMPLETED' ? (
                                                <div className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl font-bold uppercase tracking-widest text-[9px] text-center flex items-center justify-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    Already Settled & Completed
                                                </div>
                                            ) : paymentSuccess ? (
                                                <div className="space-y-2">
                                                    <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl font-bold uppercase tracking-widest text-[9px] text-center flex items-center justify-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                        Payment Settled
                                                    </div>
                                                    <button
                                                        onClick={handleCompleteBooking}
                                                        disabled={processing}
                                                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {processing && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                                        Complete Booking
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Process Payment Button (only show if no payments) */}
                                                    {(!billData?.payments || billData?.payments?.length === 0) && (
                                                        <button
                                                            onClick={() => setShowPaymentForm(true)}
                                                            className="w-full py-3 bg-gold text-black-deep rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98] transition-all"
                                                        >
                                                            Process Payment
                                                        </button>
                                                    )}

                                                    {/* Complete Booking Button (show if payments exist in DB but not yet completed) */}
                                                    {billData?.payments?.length > 0 && (
                                                        <button
                                                            onClick={handleCompleteBooking}
                                                            disabled={processing}
                                                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {processing && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                                            Complete Booking
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!booking && !loading && (
                    <div className="bg-white rounded-2xl border border-gold/10 shadow-sm p-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 opacity-25">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <p className="text-sm font-medium">Enter a booking number above to get started</p>
                        </div>
                    </div>
                )}

                {/* ─── Payment Modal ─── */}
                {showPaymentForm && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                        onClick={() => !processing && setShowPaymentForm(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 bg-[#FDFBF7] flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="font-display text-xl italic text-black-deep">Process Payment</h3>
                                    <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest mt-0.5">{booking.bookingNumber} · ₹{booking.finalAmount}</p>
                                </div>
                                <button
                                    className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-2 rounded-lg transition-colors"
                                    onClick={() => setShowPaymentForm(false)}
                                    disabled={processing}
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>

                            {/* Scrollable Form Body */}
                            <form onSubmit={handleProcessPayment} className="flex flex-col flex-1 min-h-0">
                                <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

                                    {/* Payment Method */}
                                    <div>
                                        <label className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-2">Payment Method</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {PAYMENT_METHODS.map((method) => (
                                                <button
                                                    key={method.value}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method.value)}
                                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === method.value
                                                        ? 'border-gold bg-gold/5'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                                        }`}
                                                >
                                                    <span className="text-lg leading-none">{method.icon}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-wide ${paymentMethod === method.value ? 'text-gold' : 'text-secondary/60'
                                                        }`}>{method.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount & Discount - side by side */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1.5">Amount (₹)</label>
                                            <input
                                                type="number"
                                                value={amountPaid}
                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                className="w-full px-3 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-sm font-bold text-black-deep focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all"
                                                required
                                                min="0"
                                                step="0.01"
                                                disabled={processing}
                                            />
                                            <p className="text-[8px] text-secondary/40 mt-1">Auto-filled: ₹{booking.finalAmount}</p>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1.5">Discount (₹)</label>
                                            <input
                                                type="number"
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-black-deep focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all"
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                                disabled={processing}
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1.5">Notes <span className="text-secondary/30">(optional)</span></label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-black-deep focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all placeholder:text-slate-300 resize-none h-16"
                                            placeholder="e.g. Full payment received via UPI"
                                            disabled={processing}
                                        />
                                    </div>

                                    {/* Summary Strip */}
                                    <div className="bg-black-deep rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.icon}</span>
                                            <div>
                                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Collecting via {paymentMethod}</p>
                                                <p className="text-xs font-bold text-white">{booking.bookingNumber}</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-display italic text-gold">₹{amountPaid || '0'}</span>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
                                        onClick={() => setShowPaymentForm(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 text-xs font-bold text-black-deep bg-gold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                                        disabled={processing || !amountPaid}
                                    >
                                        {processing && <div className="w-3.5 h-3.5 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin"></div>}
                                        {processing ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* ─── Bill Modal ─── */}
                <BillModal 
                    isOpen={showBillModal} 
                    onClose={() => setShowBillModal(false)} 
                    billData={billData} 
                />


            </main>
        </div>
    );
};

export default CompleteBooking;
