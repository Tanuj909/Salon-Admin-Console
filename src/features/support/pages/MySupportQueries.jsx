import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyQueriesApi, createQueryApi, deleteQueryApi } from "../services/supportService";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const MySupportQueries = () => {
  const { user } = useAuth();
  
  // States
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab & Filter states
  const [activeTab, setActiveTab] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  // Form submission / deletion progress
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    subject: "",
    message: "",
    suggestion: "",
    phoneNumber: user?.phoneNumber || user?.phone || "",
  });

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchMyQueries();
  }, []);

  // Sync phone number if user profile finishes loading later
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        phoneNumber: prev.phoneNumber || user.phoneNumber || user.phone || ""
      }));
    }
  }, [user]);

  const fetchMyQueries = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch up to 1000 queries to group/filter them client-side
      const data = await getMyQueriesApi(0, 1000);
      setQueries(data.content || []);
    } catch (err) {
      console.error("Failed to load queries", err);
      setError("Failed to load your past support tickets.");
      toast.error("Error loading queries");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.warning("Please fill in the required fields (Subject and Message).");
      return;
    }

    try {
      setSubmitting(true);
      await createQueryApi(form);
      toast.success("Support query submitted successfully!");
      setForm({
        subject: "",
        message: "",
        suggestion: "",
        phoneNumber: user?.phoneNumber || user?.phone || "",
      });
      setIsSubmitModalOpen(false);
      // Refresh list and reset tab to PENDING
      setActiveTab("PENDING");
      fetchMyQueries();
    } catch (err) {
      console.error("Failed to submit query", err);
      toast.error("Failed to submit support query. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      setActionLoading(id);
      await deleteQueryApi(id);
      toast.success("Query deleted successfully.");
      setConfirmDeleteId(null);
      fetchMyQueries();
    } catch (err) {
      console.error("Failed to delete query", err);
      toast.error("Failed to delete query. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // Reset pagination when active tab or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Group queries by status for counts
  const counts = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = queries.filter(q => q.status === status).length;
    return acc;
  }, {});

  // Filter queries based on search query and active tab
  const filteredQueries = queries
    .filter(q => q.status === activeTab)
    .filter(q => {
      const term = searchQuery.toLowerCase();
      return (
        (q.subject || "").toLowerCase().includes(term) ||
        (q.message || "").toLowerCase().includes(term) ||
        (q.suggestion || "").toLowerCase().includes(term) ||
        (q.phoneNumber || "").toLowerCase().includes(term)
      );
    });

  // Paginated queries for current view
  const totalItems = filteredQueries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/20";
      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-600 border-indigo-100 ring-indigo-500/20";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/20";
      case "CLOSED":
        return "bg-slate-50 text-slate-600 border-slate-100 ring-slate-500/20";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] p-3 sm:p-6">
      <div className="responsive-container pb-12 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-1">
          <div>
            <h1 className="text-responsive-h2 font-display italic text-black-deep mb-2 leading-tight">My Queries</h1>
            <p className="text-secondary text-sm sm:text-base">Submit support requests, ask questions, or provide suggestions to the platform administration.</p>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="group bg-gold text-white px-5 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:bg-black-deep hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 flex items-center justify-center gap-3 border-0 cursor-pointer w-full sm:w-auto shrink-0"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-gold transition-colors duration-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>
            Submit New Query
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 border-b border-gold/10 pb-4">
          {STATUS_OPTIONS.map(status => {
            const isActive = activeTab === status;
            const count = counts[status] || 0;
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 border ${
                  isActive
                    ? "bg-gold text-white border-gold shadow-md shadow-gold/10"
                    : "bg-white text-secondary border-gold/10 hover:bg-gold/5 hover:border-gold/30"
                }`}
              >
                <span>{status.replace("_", " ")}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-4 py-4 sm:px-6 bg-[#FDFBF7] flex justify-between items-center relative overflow-hidden">
            <div className="absolute -left-4 -top-4 text-gold/5 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v-6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            
            <div className="relative z-10 w-full md:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-black-deep py-2.5 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="p-4 sm:p-6 bg-white min-h-[400px]">
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                <span className="text-secondary font-medium tracking-wider uppercase text-[10px]">Loading tickets...</span>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500 font-medium">
                <p>{error}</p>
                <button
                  onClick={fetchMyQueries}
                  className="mt-4 px-6 py-2 bg-gold text-white font-bold rounded-xl uppercase tracking-widest text-[10px] hover:bg-black-deep transition-all"
                >
                  Reload
                </button>
              </div>
            ) : totalItems === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-black-deep mb-1">No tickets found</p>
                <p className="text-sm text-secondary font-medium">
                  {searchQuery ? "No results match your search query." : `You have no ${activeTab.toLowerCase().replace("_", " ")} support tickets.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {paginatedQueries.map((query) => (
                  <div
                    key={query.id}
                    className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-gold/5 hover:border-gold/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(query.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            query.status === "PENDING" ? "bg-amber-500 animate-pulse" :
                            query.status === "IN_PROGRESS" ? "bg-indigo-500 animate-pulse" :
                            query.status === "RESOLVED" ? "bg-emerald-500" : "bg-slate-400"
                          }`}></span>
                          {query.status.replace("_", " ")}
                        </span>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 font-semibold">{formatDate(query.createdAt)}</span>
                          
                          {/* Cancel Query Action */}
                          {query.status === "PENDING" && (
                            <button
                              onClick={() => setConfirmDeleteId(query.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer shrink-0"
                              title="Cancel Support Request"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subject */}
                      <h3 className="font-bold text-black-deep text-base mb-2 group-hover:text-gold transition-colors">
                        {query.subject}
                      </h3>

                      {/* Message */}
                      <p className="text-sm text-secondary leading-relaxed mb-4">
                        {query.message}
                      </p>

                      {/* Suggestions */}
                      {query.suggestion && (
                        <div className="text-xs text-amber-800 bg-amber-50/30 border-l-2 border-amber-500/50 p-3 rounded-r-xl mb-4 font-medium leading-relaxed">
                          <strong className="block text-[9px] uppercase tracking-wider mb-0.5 font-bold">My Suggestion:</strong>
                          {query.suggestion}
                        </div>
                      )}
                    </div>

                    {/* Footer / Admin Response Block */}
                    {query.adminReply ? (
                      <div className="mt-2 p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl relative overflow-hidden">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase tracking-wider text-[9px] mb-1.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          Admin Response
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed italic">"{query.adminReply}"</p>
                        <div className="text-[9px] text-slate-400 font-semibold text-right mt-2">{formatDate(query.repliedAt)}</div>
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] text-slate-400 font-semibold italic flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        Awaiting response from platform administrators
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <span className="text-secondary text-xs sm:text-sm font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>
                <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium border-l border-slate-200 transition-colors cursor-pointer ${
                        currentPage === i + 1 ? "bg-gold/10 text-gold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors border-l border-slate-200 disabled:opacity-30 cursor-pointer"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Query Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-md z-[1001] flex items-center justify-center p-3 sm:p-6 transition-all duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsSubmitModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl sm:rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col mx-2">
            <div className="bg-[#FDFBF7] px-5 py-5 sm:p-8 border-b border-gold/10 flex justify-between items-center flex-shrink-0">
              <div className="space-y-1">
                <h2 className="font-display text-xl sm:text-2xl italic text-black-deep">New Support Ticket</h2>
                <p className="text-secondary text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Submit your request to administration</p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="bg-white text-slate-400 hover:text-black-deep hover:bg-slate-50 w-9 h-9 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center cursor-pointer transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              <form onSubmit={handleSubmitQuery} className="p-5 sm:p-8 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 ml-1">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief summary of the issue..."
                    className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 ml-1">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe your issue or question in detail..."
                    className="w-full h-32 bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 ml-1">Suggestion (Optional)</label>
                  <textarea
                    name="suggestion"
                    value={form.suggestion}
                    onChange={handleInputChange}
                    placeholder="Any suggestion to improve the platform..."
                    className="w-full h-24 bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 ml-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all bg-white uppercase tracking-[0.15em] text-[10px] sm:text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-gold text-white font-bold hover:bg-black-deep hover:shadow-xl hover:shadow-black/10 transition-all disabled:opacity-50 border-0 uppercase tracking-[0.15em] text-[10px] sm:text-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Cancel Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1500] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 mx-2">
            <div className="p-6 text-center bg-red-50/30">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-100 text-red-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </div>
              <h3 className="text-lg font-bold text-black-deep mb-2">Delete Ticket?</h3>
              <p className="text-secondary text-[11px] sm:text-sm leading-relaxed">
                Are you sure you want to delete this support request? This action cannot be undone.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-secondary hover:bg-slate-100 font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuery(confirmDeleteId)}
                disabled={actionLoading === confirmDeleteId}
                className="w-full px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-600/10 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading === confirmDeleteId ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySupportQueries;
