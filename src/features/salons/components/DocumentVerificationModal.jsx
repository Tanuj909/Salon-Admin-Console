import { useState, useEffect } from "react";
import { getVerificationDocumentsApi, reviewDocumentApi } from "../services/salonService";

const DocumentVerificationModal = ({ isOpen, onClose, businessId, businessName }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(null);

  useEffect(() => {
    if (isOpen && businessId) {
      fetchDocuments();
    }
  }, [isOpen, businessId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVerificationDocumentsApi(businessId);
      setDocuments(data || []);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      // More specific error message
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please try loggin in again or check permissions.");
      } else if (err.response?.status === 404) {
        setError("Endpoint not found. The API path might be incorrect.");
      } else {
        setError("Failed to load documents. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (documentId, approve) => {
    let rejectionReason = null;
    if (!approve) {
      rejectionReason = window.prompt("Please enter the reason for rejection:");
      if (rejectionReason === null) return; // User cancelled prompt
      if (!rejectionReason.trim()) {
        alert("Rejection reason is required.");
        return;
      }
    }

    try {
      setReviewLoading(documentId);
      await reviewDocumentApi(documentId, approve, rejectionReason);
      await fetchDocuments(); // Refresh list to show updated status
    } catch (err) {
      console.error("Failed to review document", err);
      alert(`Failed to ${approve ? 'approve' : 'reject'} document. Please try again.`);
    } finally {
      setReviewLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-[20px] sm:rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 sm:my-8">
        {/* Header */}
        <div className="bg-[#FDFBF7] p-4 sm:p-6 border-b border-gold/10 flex justify-between items-start">
          <div className="max-w-[80%]">
            <h2 className="font-display text-xl sm:text-2xl italic text-black-deep leading-tight">Verify Documents</h2>
            <p className="text-secondary tracking-wide text-[10px] mt-1 uppercase font-bold tracking-widest leading-relaxed">
              Salon: <span className="text-gold break-all">{businessName || "Unknown Business"}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-1.5 sm:p-2 rounded-full transition-colors shrink-0"
          >
            <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-12 sm:py-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <span className="text-secondary font-medium tracking-wider uppercase text-[10px]">Fetching business documents...</span>
            </div>
          ) : error ? (
            <div className="py-8 sm:py-12 text-center">
                <div className="bg-red-50 text-red-600 px-4 py-3 sm:px-6 sm:py-4 rounded-xl border border-red-100 font-medium flex items-center justify-center gap-3 shadow-sm mx-auto max-w-md text-xs sm:text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
                <button 
                    onClick={fetchDocuments}
                    className="mt-4 text-gold font-bold text-[10px] uppercase tracking-widest hover:underline"
                >
                    Retry Loading
                </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100 italic text-slate-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /><line x1="9" y1="11" x2="15" y2="11" /><line x1="9" y1="19" x2="15" y2="19" /></svg>
              </div>
              <p className="text-base sm:text-lg font-bold text-black-deep mb-1">No documents found</p>
              <p className="text-xs sm:text-sm text-secondary">This business hasn't uploaded any verification documents yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="group bg-white border border-slate-100 hover:border-gold/30 rounded-2xl p-3 sm:p-4 transition-all hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10 shrink-0">
                      <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-black-deep text-xs sm:text-sm mb-0.5 truncate uppercase tracking-wide">{doc.documentType.replace(/_/g, " ")}</h4>
                      <p className="text-[10px] sm:text-xs text-secondary font-medium truncate">{doc.fileName}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between sm:justify-end shrink-0">
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap ${
                        doc.verificationStatus === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                        doc.verificationStatus === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {doc.verificationStatus === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                        {doc.verificationStatus}
                      </span>
                      {doc.rejectionReason && (
                        <span className="text-[8px] sm:text-[9px] text-red-500 font-medium max-w-[120px] sm:max-w-[150px] truncate" title={doc.rejectionReason}>
                          Reason: {doc.rejectionReason}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FDFBF7] text-gold border border-gold/20 hover:bg-gold/5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all text-center no-underline whitespace-nowrap"
                      >
                        View
                      </a>
                      
                      {doc.verificationStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleReview(doc.id, true)}
                            disabled={reviewLoading === doc.id}
                            className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 whitespace-nowrap"
                          >
                            {reviewLoading === doc.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReview(doc.id, false)}
                            disabled={reviewLoading === doc.id}
                            className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 whitespace-nowrap"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl bg-black-deep text-white font-bold hover:bg-black-deep/90 transition-all shadow-lg shadow-black-deep/10 uppercase tracking-wider text-[9px] sm:text-[10px]"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationModal;
