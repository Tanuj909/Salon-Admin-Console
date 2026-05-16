import { useState, useEffect } from "react";
import { getAllPaymentsApi } from "../services/paymentService";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const PAYMENT_METHODS = [
    { value: "CASH", label: "Cash", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { value: "CARD", label: "Card", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { value: "UPI", label: "UPI", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { value: "WALLET", label: "Wallet", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { value: "BANK_TRANSFER", label: "Bank Transfer", color: "bg-slate-50 text-slate-600 border-slate-100" },
];

const PAYMENT_STATUSES = [
    { value: "PAID", label: "Paid", dot: "bg-emerald-500" },
    { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
    { value: "PARTIALLY_PAID", label: "Partial", dot: "bg-blue-500" },
    { value: "REFUNDED", label: "Refunded", dot: "bg-slate-500" },
    { value: "FAILED", label: "Failed", dot: "bg-red-500" },
];

const PaymentsList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    
    // Filters
    const [filters, setFilters] = useState({
        page: 0,
        size: 10,
        sortBy: "paymentDate",
        sortDirection: "DESC",
        fromDate: "",
        toDate: "",
        paymentMethod: "",
        paymentStatus: "",
    });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await getAllPaymentsApi(cleanFilters);
            setPayments(response.content || []);
            setTotalElements(response.totalElements || 0);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error("Error fetching payments:", error);
            const status = error.response?.status;
            toast.error(status === 401 ? "Unauthorized: Check permissions" : "Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [filters.page, filters.sortBy, filters.sortDirection]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 0 }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        fetchPayments();
    };

    const handleResetFilters = () => {
        setFilters({
            page: 0,
            size: 10,
            sortBy: "paymentDate",
            sortDirection: "DESC",
            fromDate: "",
            toDate: "",
            paymentMethod: "",
            paymentStatus: "",
        });
    };

    return (
        <div className="w-full font-jost min-h-screen bg-[#FDFBF7]/50">
            <main className="mx-auto px-6 lg:px-10 pb-12 pt-4 max-w-[1600px]">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-display text-3xl sm:text-4xl italic text-black-deep mb-1">Payments</h1>
                        <p className="text-[10px] sm:text-xs text-secondary font-bold tracking-[0.2em] uppercase opacity-50">Transaction History</p>
                    </motion.div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all ${showFilters ? 'bg-gold text-black-deep border-gold shadow-lg shadow-gold/20' : 'bg-white text-secondary border-gold/10 hover:border-gold/30'}`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Filters</span>
                            {Object.values(filters).filter(v => v !== "" && v !== 0 && v !== 10 && v !== "paymentDate" && v !== "DESC").length > 0 && (
                                <span className="w-5 h-5 rounded-full bg-black-deep text-gold text-[10px] flex items-center justify-center border border-gold/20">
                                    {Object.values(filters).filter(v => v !== "" && v !== 0 && v !== 10 && v !== "paymentDate" && v !== "DESC").length}
                                </span>
                            )}
                        </button>

                        <div className="hidden sm:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gold/10">
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-secondary/40 uppercase tracking-widest leading-none">Total</p>
                                <p className="text-xl font-display italic text-black-deep leading-none mt-1">{totalElements}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22m5-18H8.5a4.5 4.5 0 0 0 0 9h7a4.5 4.5 0 0 1 0 9H7"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible Filter Bar */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-white rounded-[28px] border border-gold/10 shadow-sm p-6 sm:p-8">
                                <form onSubmit={handleApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">From Date</label>
                                        <input 
                                            type="date" 
                                            name="fromDate"
                                            value={filters.fromDate}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-3 bg-[#FDFBF7] border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-gold transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">To Date</label>
                                        <input 
                                            type="date" 
                                            name="toDate"
                                            value={filters.toDate}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-3 bg-[#FDFBF7] border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-gold transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Method</label>
                                        <select 
                                            name="paymentMethod"
                                            value={filters.paymentMethod}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-3 bg-[#FDFBF7] border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-gold transition-all appearance-none"
                                        >
                                            <option value="">All Methods</option>
                                            {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Status</label>
                                        <select 
                                            name="paymentStatus"
                                            value={filters.paymentStatus}
                                            onChange={handleFilterChange}
                                            className="w-full px-4 py-3 bg-[#FDFBF7] border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-gold transition-all appearance-none"
                                        >
                                            <option value="">All Statuses</option>
                                            {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="lg:col-span-4 flex justify-end gap-3 pt-2">
                                        <button 
                                            type="button"
                                            onClick={handleResetFilters}
                                            className="px-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-8 py-3 bg-black-deep text-gold rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:shadow-black-deep/20 transition-all active:scale-95"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table Section */}
                <div className="bg-white rounded-[32px] border border-gold/10 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FDFBF7] border-b border-gold/5">
                                    <th className="px-6 py-5 text-[10px] font-bold text-secondary uppercase tracking-widest">Transaction Info</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-secondary uppercase tracking-widest hidden md:table-cell">Customer</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-secondary uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-secondary uppercase tracking-widest hidden sm:table-cell">Method</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={`skeleton-${i}`} className="animate-pulse">
                                                <td colSpan="6" className="px-6 py-8">
                                                    <div className="h-6 bg-slate-100 rounded-full w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : payments.length > 0 ? (
                                        payments.map((p, idx) => (
                                            <motion.tr 
                                                key={p.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="hover:bg-gold/5 transition-colors group"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-mono font-bold text-black-deep">
                                                            {p.transactionId || `#TRN${p.id}`}
                                                        </span>
                                                        <span className="text-[10px] text-secondary font-medium mt-0.5 md:hidden">
                                                            {p.patientName || "Guest"}
                                                        </span>
                                                        <span className="text-[9px] text-secondary/40 font-bold uppercase mt-1">
                                                            {new Date(p.paymentDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 hidden md:table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-[10px] font-bold shrink-0">
                                                            {p.patientName?.charAt(0) || "C"}
                                                        </div>
                                                        <span className="text-sm font-bold text-black-deep tracking-tight">{p.patientName || "Anonymous"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-bold text-emerald-600">AED {p.amount?.toFixed(2) || "0.00"}</span>
                                                    <div className="sm:hidden mt-1">
                                                        <span className="text-[9px] font-bold text-secondary/60 uppercase">{p.paymentMethod}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 hidden sm:table-cell">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${PAYMENT_METHODS.find(m => m.value === p.paymentMethod)?.color || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                                                        {p.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${PAYMENT_STATUSES.find(s => s.value === p.paymentStatus)?.dot || "bg-slate-300"}`}></span>
                                                        <span className="text-[11px] font-bold text-black-deep uppercase tracking-wide">{p.paymentStatus}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button 
                                                        onClick={() => setSelectedPayment(p)}
                                                        className="px-4 py-2 rounded-xl bg-black-deep text-gold text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-32 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3 opacity-20">
                                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 1v22m5-18H8.5a4.5 4.5 0 0 0 0 9h7a4.5 4.5 0 0 1 0 9H7"/></svg>
                                                    <p className="text-lg font-bold">No transactions found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-6 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
                                Page {filters.page + 1} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    disabled={filters.page === 0}
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                    className="w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-30"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                                </button>
                                <button 
                                    disabled={filters.page === totalPages - 1}
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                    className="w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-30"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedPayment && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPayment(null)}
                            className="absolute inset-0 bg-black-deep/60 backdrop-blur-md"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gold/10"
                        >
                            <div className="px-8 py-8 border-b border-gold/5 flex justify-between items-center bg-[#FDFBF7]">
                                <div>
                                    <h3 className="font-display text-2xl text-black-deep italic">Transaction Details</h3>
                                    <p className="text-[10px] font-bold text-gold uppercase tracking-widest mt-1">ID: {selectedPayment.transactionId || `#TRN${selectedPayment.id}`}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedPayment(null)}
                                    className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black-deep transition-all"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Customer Name</p>
                                        <p className="text-sm font-bold text-black-deep tracking-tight">{selectedPayment.patientName || "Anonymous"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Invoice ID</p>
                                        <p className="text-sm font-mono font-bold text-black-deep">#{selectedPayment.invoiceId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Payment Method</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${PAYMENT_METHODS.find(m => m.value === selectedPayment.paymentMethod)?.color.split(' ')[1] || 'bg-slate-400'}`}></div>
                                            <p className="text-sm font-bold text-black-deep">{selectedPayment.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Payment Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${PAYMENT_STATUSES.find(s => s.value === selectedPayment.paymentStatus)?.dot || 'bg-slate-400'}`}></div>
                                            <p className="text-sm font-bold text-black-deep">{selectedPayment.paymentStatus}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gold/5 rounded-3xl p-6 flex items-center justify-between border border-gold/10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Total Amount</p>
                                        <p className="text-3xl font-display italic text-black-deep leading-none">AED {selectedPayment.amount?.toFixed(2) || "0.00"}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                    </div>
                                </div>

                                <div className="space-y-1 pt-4 border-t border-gold/5">
                                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">Timestamp</p>
                                    <p className="text-sm font-medium text-black-deep">
                                        {new Date(selectedPayment.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(selectedPayment.paymentDate).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="p-8 bg-[#FDFBF7] border-t border-gold/5">
                                <button 
                                    onClick={() => setSelectedPayment(null)}
                                    className="w-full py-4 rounded-2xl bg-black-deep text-gold text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-black-deep/20 transition-all"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaymentsList;
