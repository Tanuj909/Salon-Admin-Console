import { useState, useEffect } from "react";
import { getAllQueriesApi, getQueryByIdApi, replyToQueryApi } from "../services/supportService";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const SupportQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected tab
  const [activeTab, setActiveTab] = useState("PENDING");
  
  // Search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [replyText, setReplyText] = useState("");
  const [newStatus, setNewStatus] = useState("RESOLVED");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch up to 1000 queries to group/filter them client-side
      const data = await getAllQueriesApi(0, 1000);
      setQueries(data.content || []);
    } catch (err) {
      console.error("Failed to fetch queries", err);
      setError("Failed to fetch support queries. Please try again later.");
      toast.error("Error loading queries");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQueryDetails = async (queryId) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      const queryDetail = await getQueryByIdApi(queryId);
      setSelectedQuery(queryDetail);
      setReplyText(queryDetail.adminReply || "");
      // Default newStatus to either the current status, or RESOLVED if currently PENDING/IN_PROGRESS
      setNewStatus(
        queryDetail.status === "PENDING" || queryDetail.status === "IN_PROGRESS"
          ? "RESOLVED"
          : queryDetail.status
      );
    } catch (err) {
      console.error("Failed to fetch query details", err);
      toast.error("Failed to load query details");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.warning("Please enter a reply message");
      return;
    }

    try {
      setSubmittingReply(true);
      await replyToQueryApi(selectedQuery.id, {
        reply: replyText,
        newStatus: newStatus
      });
      toast.success("Reply submitted successfully!");
      setIsModalOpen(false);
      fetchQueries();
    } catch (err) {
      console.error("Failed to submit reply", err);
      toast.error("Failed to submit reply. Please try again.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
        (q.email || "").toLowerCase().includes(term) ||
        (q.phoneNumber || "").toLowerCase().includes(term) ||
        (q.suggestion || "").toLowerCase().includes(term)
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 sm:gap-6 px-1">
          <div>
            <h1 className="text-responsive-h2 font-display italic text-black-deep mb-2 leading-tight">Support Queries</h1>
            <p className="text-secondary text-sm sm:text-base">Review, organize, and reply to user inquiries submitted to the platform.</p>
          </div>
          <div className="bg-white px-4 py-3 sm:px-5 sm:py-3 rounded-2xl border border-gold/10 shadow-sm flex items-center gap-4 w-full md:w-auto self-start md:self-auto min-w-[180px]">
            <div className="text-[10px] text-secondary font-bold uppercase tracking-widest text-left leading-tight">
              Unresolved<br />
              <span className="text-amber-600 font-extrabold">Pending Queries</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gold ml-auto md:ml-0">
              {counts["PENDING"] || 0}
            </div>
          </div>
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

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden mb-6">
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
                placeholder="Search by subject, email, phone, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-black-deep py-2.5 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          {/* List and Grid Layout */}
          <div className="p-4 sm:p-6 bg-white min-h-[400px]">
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                <span className="text-secondary font-medium tracking-wider uppercase text-[10px]">Loading queries...</span>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500 font-medium">
                <p>{error}</p>
                <button
                  onClick={fetchQueries}
                  className="mt-4 px-6 py-2 bg-gold text-white font-bold rounded-xl uppercase tracking-widest text-[10px] hover:bg-black-deep transition-all"
                >
                  Retry
                </button>
              </div>
            ) : totalItems === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-black-deep mb-1">No queries found</p>
                <p className="text-sm text-secondary">
                  {searchQuery ? "No results match your search query." : `There are no ${activeTab.toLowerCase().replace("_", " ")} support queries.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {paginatedQueries.map((query) => (
                  <div
                    key={query.id}
                    onClick={() => handleOpenQueryDetails(query.id)}
                    className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-gold/5 hover:border-gold/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(query.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            query.status === "PENDING" ? "bg-amber-500 animate-pulse" :
                            query.status === "IN_PROGRESS" ? "bg-indigo-500 animate-pulse" :
                            query.status === "RESOLVED" ? "bg-emerald-50" : "bg-slate-400"
                          }`}></span>
                          {query.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{formatDate(query.createdAt)}</span>
                      </div>

                      {/* Subject */}
                      <h3 className="font-bold text-black-deep text-base mb-2 group-hover:text-gold transition-colors line-clamp-1">
                        {query.subject || "No Subject"}
                      </h3>

                      {/* Message Snippet */}
                      <p className="text-sm text-secondary line-clamp-3 leading-relaxed mb-4">
                        {query.message}
                      </p>
                    </div>

                    {/* Sender Details Footer */}
                    <div className="pt-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                          <span className="truncate max-w-[130px] xs:max-w-[160px] sm:max-w-[180px]">{query.email}</span>
                        </div>
                        {query.phoneNumber && (
                          <div className="flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span>{query.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                      
                      {query.adminReply && (
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ml-auto">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          Replied
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
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

      {/* Details & Reply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-md z-[1001] flex items-center justify-center p-3 sm:p-6 transition-all duration-300">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-white rounded-2xl sm:rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col mx-2">
            {/* Modal Header */}
            <div className="bg-[#FDFBF7] px-5 py-5 sm:px-10 border-b border-gold/10 flex justify-between items-center flex-shrink-0">
              <div className="space-y-1">
                <h2 className="font-display text-xl sm:text-3xl italic text-black-deep tracking-tight max-w-[220px] xs:max-w-[320px] sm:max-w-[450px] truncate">
                  {modalLoading ? "Loading..." : selectedQuery?.subject || "Query Details"}
                </h2>
                <p className="text-secondary tracking-wide text-[10px] sm:text-xs font-semibold uppercase">
                  {modalLoading ? "Connecting to service" : `Support Query #${selectedQuery?.id}`}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white text-slate-400 hover:text-black-deep hover:bg-slate-50 w-9 h-9 sm:w-12 sm:h-12 rounded-2xl transition-all border border-slate-100 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              {modalLoading ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                  <span className="text-secondary font-medium tracking-wider uppercase text-[10px]">Fetching full details...</span>
                </div>
              ) : selectedQuery ? (
                <div className="p-5 sm:p-10 space-y-5 sm:space-y-6">
                  
                  {/* Sender & Time Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Sender Information</div>
                      <div className="flex items-center gap-2 font-medium text-black-deep break-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        <span>{selectedQuery.email}</span>
                      </div>
                      {selectedQuery.phoneNumber && (
                        <div className="flex items-center gap-2 font-medium text-black-deep">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          <span>{selectedQuery.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Metadata</div>
                      <div className="text-xs text-slate-500 font-semibold space-y-1">
                        <div>Submitted: <span className="text-black-deep">{formatDate(selectedQuery.createdAt)}</span></div>
                        <div>Last Active: <span className="text-black-deep">{formatDate(selectedQuery.updatedAt)}</span></div>
                        <div className="flex items-center gap-1.5 pt-1">
                          Status: 
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(selectedQuery.status)}`}>
                            {selectedQuery.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="space-y-2">
                    <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Original Inquiry</label>
                    <div className="bg-slate-50/50 border-l-4 border-gold/40 p-4 sm:p-5 rounded-r-2xl text-black-deep text-sm font-medium leading-relaxed italic shadow-inner">
                      "{selectedQuery.message}"
                    </div>
                  </div>

                  {/* User Suggestion (if exists) */}
                  {selectedQuery.suggestion && (
                    <div className="space-y-2">
                      <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">User Suggestion</label>
                      <div className="bg-amber-50/30 border-l-4 border-amber-500/40 p-4 sm:p-5 rounded-r-2xl text-amber-900 text-sm font-medium leading-relaxed shadow-inner">
                        {selectedQuery.suggestion}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="border-t border-slate-100 pt-5 sm:pt-6 space-y-4 sm:space-y-5">
                    <h3 className="font-display text-lg italic text-black-deep mb-2">Respond to Inquiry</h3>
                    
                    <div className="space-y-2">
                      <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Your Reply</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        placeholder="Type your response here..."
                        className="w-full h-32 sm:h-36 bg-slate-50/50 border border-slate-200 text-black-deep py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <div>
                        <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 ml-1">Update Query Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 text-slate-700 py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-gold/50 focus:ring-4 focus:ring-gold/5 transition-all cursor-pointer shadow-sm"
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                              {status.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 justify-end w-full">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all bg-white uppercase tracking-[0.15em] text-[10px] sm:text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingReply}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gold text-white font-bold hover:bg-black-deep hover:shadow-xl hover:shadow-black/10 transition-all disabled:opacity-50 border-0 uppercase tracking-[0.15em] text-[10px] sm:text-xs cursor-pointer flex items-center justify-center gap-2"
                        >
                          {submittingReply ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <span>Submit Reply</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              ) : (
                <div className="py-20 text-center text-slate-500">
                  Failed to load details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportQueries;
