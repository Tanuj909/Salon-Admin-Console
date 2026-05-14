import { useState, useEffect } from "react";
import { getAllAgreementsApi, reviewAgreementApi } from "../services/salonService";
import AgreementModal from "../components/AgreementModal";
import { toast } from "react-toastify";

const SalonAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal state
  const [selectedSalonForAgreement, setSelectedSalonForAgreement] = useState(null);
  const [selectedAgreementToView, setSelectedAgreementToView] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // { id, signerName }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAgreements();
  }, [currentPage]);

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      const data = await getAllAgreementsApi(currentPage, pageSize);
      setAgreements(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to fetch agreements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, approved, rejectionReason = null) => {
    try {
      setActionLoading(id);
      await reviewAgreementApi(id, approved, rejectionReason);
      toast.success(`Agreement ${approved ? 'approved' : 'rejected'} successfully`);
      setReviewAction(null);
      fetchAgreements();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${approved ? 'approve' : 'reject'} agreement`);
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredAgreements = agreements.filter((agreement) => {
    const query = searchQuery.toLowerCase();
    return (
      agreement.signerName?.toLowerCase().includes(query) ||
      agreement.signerEmail?.toLowerCase().includes(query) ||
      agreement.status?.toLowerCase().includes(query)
    );
  });

  if (error) return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 font-medium flex items-center gap-3 shadow-sm max-w-md">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        {error}
      </div>
    </div>
  );

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] p-4 sm:p-6">
      <div className="responsive-container pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 px-1">
          <div>
            <h1 className="text-responsive-h2 font-display italic text-black-deep mb-2 leading-tight">Salon Agreements</h1>
            <p className="text-secondary text-sm sm:text-base hidden lg:block">View and manage all signed agreements.</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-gold/10 shadow-sm flex items-center gap-4 self-start md:self-auto min-w-[150px]">
            <div className="text-[10px] text-secondary font-bold uppercase tracking-widest text-left leading-tight">
                Total<br className="hidden lg:block" /> 
                <span>Agreements</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gold">{totalElements}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden">
          <div className="px-4 py-4 sm:px-6 border-b border-gold/10 bg-[#FDFBF7] flex flex-col sm:flex-row gap-4 justify-between items-center relative overflow-hidden">
            <div className="absolute -left-4 -top-4 text-gold/5 pointer-events-none hidden sm:block">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
            </div>
            <div className="relative z-10 w-full sm:w-auto">
               <h2 className="text-sm font-bold text-black-deep/70 uppercase tracking-widest px-1">Agreement Records</h2>
            </div>
            <div className="relative z-10 w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search agreements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-black-deep py-2.5 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Signer Details</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest hidden sm:table-cell">Acceptance Status</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest hidden md:table-cell">Signed At</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Admin Status</th>
                  <th className="py-4 px-4 sm:px-6 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && agreements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                        <span className="text-secondary font-medium tracking-wider uppercase text-xs">Loading agreements...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAgreements.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center px-4">
                      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                      </div>
                      <p className="text-lg font-bold text-black-deep mb-1">No agreements found</p>
                      <p className="text-sm text-secondary">No agreements match your search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAgreements.map((agreement) => {
                    const isAccepted = agreement.isAcpt;
                    const isPending = agreement.status === "PENDING";
                    const isApproved = agreement.status === "APPROVED";

                    return (
                      <tr key={agreement.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-black-deep text-sm flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] shrink-0">{agreement.signerName?.substring(0, 2).toUpperCase() || "AG"}</div>
                            <div className="flex flex-col">
                              <span>{agreement.signerName}</span>
                              <span className="text-[10px] text-secondary font-medium">{agreement.signerEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 hidden sm:table-cell">
                           {isAccepted ? (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                               Owner has accepted
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                               Not Accepted Yet
                             </span>
                           )}
                        </td>
                        <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-sm text-secondary font-medium">
                          {agreement.signedAt ? new Date(agreement.signedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap ${
                            agreement.status === 'APPROVED' 
                              ? 'bg-green-50 text-green-600 border-green-100' 
                              : agreement.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              agreement.status === 'APPROVED' ? 'bg-green-500' : agreement.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                            }`}></span>
                            {agreement.status || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSelectedSalonForAgreement({ id: agreement.businessId, name: agreement.signerName });
                                setSelectedAgreementToView(agreement);
                              }}
                              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gold/5 text-gold hover:bg-gold/10 border border-gold/20 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              View
                            </button>
                            
                            <button
                              disabled={!isAccepted || isApproved}
                              onClick={() => setReviewAction({ id: agreement.id, signerName: agreement.signerName })}
                              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 
                                ${isApproved 
                                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed' 
                                  : !isAccepted 
                                  ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                                  : 'bg-black-deep text-white hover:bg-black border border-black-deep'
                                }`}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              {isApproved ? "Already Approved!" : "Review"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-4 sm:px-6 border-t border-gold/10 bg-[#FDFBF7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-secondary text-xs sm:text-sm font-medium">
                Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
              </span>
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-l border-slate-200 transition-colors ${currentPage === i ? 'bg-gold/10 text-gold' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors border-l border-slate-200 disabled:opacity-30"
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedSalonForAgreement && (
        <AgreementModal 
          salon={selectedSalonForAgreement} 
          initialAgreement={selectedAgreementToView}
          onClose={() => {
            setSelectedSalonForAgreement(null);
            setSelectedAgreementToView(null);
          }} 
        />
      )}

      {/* Review Confirmation Modal */}
      {reviewAction && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1500] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 text-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-gold/10 text-gold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 className="text-lg font-bold text-black-deep mb-2">Review Agreement</h3>
              <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                Review agreement from <br/>
                <span className="text-gold font-bold italic">"{reviewAction.signerName}"</span>
              </p>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={() => handleReview(reviewAction.id, true)}
                disabled={actionLoading === reviewAction.id}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-green-600/10 hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === reviewAction.id ? "Processing..." : "Approve Agreement"}
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Enter rejection reason:");
                  if (reason !== null) handleReview(reviewAction.id, false, reason);
                }}
                disabled={actionLoading === reviewAction.id}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-600/10 hover:bg-red-700 disabled:opacity-50"
              >
                Reject Agreement
              </button>
              <button
                onClick={() => setReviewAction(null)}
                className="w-full px-4 py-2 text-secondary text-[9px] font-bold uppercase tracking-widest hover:text-black-deep"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonAgreements;
