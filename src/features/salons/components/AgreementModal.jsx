import { useState, useEffect } from "react";
import { 
  uploadAgreementApi, 
  getAgreementsByBusinessApi, 
  getBusinessOwnerApi, 
  getBusinessDocumentsApi,
  reviewAgreementApi
} from "../services/salonService";
import { toast } from "react-toastify";
import VendorAgreementTemplate from "./VendorAgreementTemplate";

const AgreementModal = ({ salon, onClose, initialAgreement = null }) => {
  const [step, setStep] = useState(0); // 0: Select Type/History, 1: Upload File, 2: Finalize, 3: Vendor Template
  const [agreementType, setAgreementType] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingAgreements, setExistingAgreements] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [viewingAgreement, setViewingAgreement] = useState(initialAgreement);
  
  const [formData, setFormData] = useState({
    businessId: salon.id,
    signerName: "",
    signerEmail: "",
    signerPhone: "",
    signatureImageUrl: "",
    file: null,
  });

  useEffect(() => {
    fetchAgreementHistory();
    fetchOwnerAndSignature();
  }, [salon.id]);

  const fetchAgreementHistory = async () => {
    try {
      setFetchingHistory(true);
      const data = await getAgreementsByBusinessApi(salon.id);
      setExistingAgreements(data.content || []);
    } catch (error) {
      console.error("Error fetching agreement history:", error);
    } finally {
      setFetchingHistory(false);
    }
  };

  const fetchOwnerAndSignature = async () => {
    try {
      const owner = await getBusinessOwnerApi(salon.id);
      const docs = await getBusinessDocumentsApi(salon.id);
      const signatureDoc = docs.find(d => d.documentType === "SIGNATURE");

      setFormData(prev => ({
        ...prev,
        signerName: owner.fullName || "",
        signerEmail: owner.email || "",
        signerPhone: owner.phoneNumber || "",
        signatureImageUrl: signatureDoc ? signatureDoc.fileUrl : ""
      }));
    } catch (error) {
      console.error("Error fetching owner/signature details:", error);
      setFormData(prev => ({
        ...prev,
        signerName: prev.signerName || salon.name || ""
      }));
    }
  };

  const handleReviewAction = async (id, approved, rejectionReason = null) => {
    try {
      setLoading(true);
      await reviewAgreementApi(id, approved, rejectionReason);
      toast.success(`Agreement ${approved ? 'approved' : 'rejected'} successfully`);
      fetchAgreementHistory();
      setViewingAgreement(null);
    } catch (error) {
      console.error("Error reviewing agreement:", error);
      toast.error(error.response?.data?.message || "Failed to review agreement");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.file) {
      toast.error("Please upload the agreement document first");
      setStep(1);
      return;
    }

    const data = new FormData();
    data.append("agreementType", agreementType);
    data.append("businessId", formData.businessId);
    data.append("signerName", formData.signerName);
    data.append("signerEmail", formData.signerEmail);
    data.append("signerPhone", formData.signerPhone);
    data.append("signatureImageUrl", formData.signatureImageUrl);
    data.append("file", formData.file);

    try {
      setLoading(true);
      await uploadAgreementApi(data);
      toast.success("Agreement submitted successfully!");
      fetchAgreementHistory();
      setStep(0);
    } catch (error) {
      console.error("Error submitting agreement:", error);
      toast.error(error.response?.data?.message || "Failed to submit agreement");
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8 px-2 sm:px-4">
      {[
        { id: 0, label: "Type" },
        { id: 1, label: "Upload" },
        { id: 2, label: "Finalize" }
      ].map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
            step >= s.id ? 'bg-gold border-gold text-white' : 'border-slate-200 text-slate-400'
          }`}>
            {step > s.id ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <span className="text-[10px] sm:text-xs font-bold">{i + 1}</span>
            )}
          </div>
          {i < 2 && (
            <div className={`w-6 sm:w-16 h-0.5 mx-1 sm:mx-4 transition-all ${
              step > s.id ? 'bg-gold' : 'bg-slate-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderAgreementView = (agreement) => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => setViewingAgreement(null)}
          className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary hover:text-black-deep transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-gold">ID: #{agreement.id}</span>
      </div>

      <div className="w-full max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        {/* Document Preview */}
        <div className="bg-slate-50 border-b border-slate-100 flex flex-col">
           <div className="w-full h-full min-h-[500px] sm:min-h-[600px] flex flex-col items-center relative group">
              {agreement.agreementFileUrl ? (
                <>
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(agreement.agreementFileUrl)}&embedded=true`}
                    className="w-full h-[500px] sm:h-[700px] border-none bg-white"
                    title="Agreement Preview"
                  />
                  {/* Overlay button for easier access on mobile */}
                  <a 
                    href={agreement.agreementFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-black-deep/80 backdrop-blur-md text-white p-3 rounded-full shadow-xl sm:hidden active:scale-95 transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                  </a>
                </>
              ) : (
                <div className="p-10 sm:p-20 text-center flex flex-col items-center gap-4 bg-white">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No document found</span>
                </div>
              )}
           </div>
           {/* Desktop/General Fullscreen Link */}
           <div className="p-3 bg-white border-t border-slate-50 flex justify-center">
              <a 
                href={agreement.agreementFileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-gold transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                View in Fullscreen (Recommended for Mobile)
              </a>
           </div>
        </div>

        {/* Signer Details */}
        <div className="p-6 sm:p-10 md:p-20 bg-white" style={{ fontFamily: "Times New Roman, serif", color: "#000" }}>
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 border-b border-slate-50 pb-2">
              <span className="text-sm font-bold whitespace-nowrap sm:min-w-[160px]">Agreement Type:</span>
              <span className="text-sm flex-1">{agreement.agreementType}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <span className="text-[13px] sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Signer Name:</span>
              <span className="text-[13px] sm:text-base flex-1 border-b border-slate-100 pb-1 break-all">{agreement.signerName}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <span className="text-[13px] sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Signer Email:</span>
              <span className="text-[13px] sm:text-base flex-1 border-b border-slate-100 pb-1 break-all">{agreement.signerEmail}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 border-b border-slate-50 pb-2">
              <span className="text-sm font-bold whitespace-nowrap sm:min-w-[160px]">Signed At:</span>
              <span className="text-sm flex-1">{new Date(agreement.signedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex flex-col gap-2">
               <div className="px-4 py-3 border-2 border-double border-black font-bold text-[10px] sm:text-[11px] uppercase tracking-[2px]">
                 Status: {agreement.status}
               </div>
               
               {agreement.status === "PENDING" && (
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${agreement.isAcpt ? 'text-green-600' : 'text-amber-600'}`}>
                   {agreement.isAcpt ? "● Owner has accepted the Agreement" : "● Owner has not Accepted yet!"}
                 </span>
               )}
             </div>
             
             {agreement.isAcpt && agreement.status === "PENDING" ? (
               <div className="flex gap-3">
                 <button
                   onClick={() => handleReviewAction(agreement.id, true)}
                   className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-green-600/10 hover:bg-green-700 transition-all"
                 >
                   Approve
                 </button>
                 <button
                   onClick={() => {
                     const reason = prompt("Enter rejection reason:");
                     if (reason !== null) handleReviewAction(agreement.id, false, reason);
                   }}
                   className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/10 hover:bg-red-700 transition-all"
                 >
                   Reject
                 </button>
               </div>
             ) : agreement.status === "APPROVED" ? (
                <div className="px-6 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                   Already Approved!
                </div>
             ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    if (viewingAgreement) return renderAgreementView(viewingAgreement);

    switch (step) {
      case 0:
        return (
          <div className="space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-display italic text-black-deep mb-2">Salon Agreement</h3>
              <p className="text-xs sm:text-sm text-secondary">Manage agreements for <span className="text-gold font-bold">{salon.name}</span></p>
            </div>

            <div className="flex justify-center max-w-xl mx-auto">
              <button
                onClick={() => {
                  setAgreementType("VENDOR");
                  setStep(3);
                }}
                className="w-full sm:w-1/2 p-4 sm:p-5 border-2 border-gold/10 hover:border-gold rounded-2xl bg-white hover:shadow-lg transition-all text-center group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M18 7a4 4 0 0 0-3-3.87"/></svg>
                </div>
                <div className="font-bold text-sm sm:text-base text-black-deep">Vendor Agreement</div>
              </button>
            </div>

            <div className="space-y-4 pt-4 sm:pt-6">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">History</h4>
                <div className="w-1/2 h-px bg-slate-100" />
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {fetchingHistory ? (
                  <div className="p-10 text-center flex flex-col items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Loading...</span>
                  </div>
                ) : existingAgreements.length === 0 ? (
                  <div className="p-10 text-center text-slate-400">
                    <p className="text-xs italic">No agreements found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 max-h-[250px] overflow-y-auto custom-scrollbar">
                    {existingAgreements.map((agreement) => {
                      const isAccepted = agreement.isAcpt;
                      const isPending = agreement.status === "PENDING";
                      const isApproved = agreement.status === "APPROVED";

                      return (
                        <div 
                          key={agreement.id} 
                          className="p-4 sm:p-5 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group border-b border-slate-50 last:border-0"
                        >
                          <div 
                            className="flex items-center gap-3 sm:gap-4 overflow-hidden cursor-pointer flex-1"
                            onClick={() => setViewingAgreement(agreement)}
                          >
                            <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-[10px] sm:text-xs ${
                              isApproved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {agreement.agreementType.substring(0, 1)}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-xs sm:text-sm text-black-deep truncate group-hover:text-gold transition-colors">{agreement.signerName}</div>
                              <div className="flex flex-col gap-0.5">
                                <div className="text-[9px] sm:text-[10px] text-secondary font-medium">
                                  {new Date(agreement.signedAt).toLocaleDateString()}
                                </div>
                                <span className={`text-[8px] font-bold uppercase tracking-widest ${isAccepted ? 'text-green-600' : 'text-amber-500'}`}>
                                  {isAccepted ? "● Owner Accepted" : "● Not Accepted Yet"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className={`px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold uppercase tracking-widest border ${
                              isApproved ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {agreement.status}
                            </span>
                            
                            {isAccepted && isPending ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReviewAction(agreement.id, true);
                                  }}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-bold uppercase tracking-widest text-[8px] hover:bg-green-700 transition-all shadow-md shadow-green-600/10"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const reason = prompt("Enter rejection reason:");
                                    if (reason !== null) handleReviewAction(agreement.id, false, reason);
                                  }}
                                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold uppercase tracking-widest text-[8px] hover:bg-red-700 transition-all shadow-md shadow-red-600/10"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : isApproved ? (
                              <span className="text-[8px] font-bold uppercase tracking-widest text-green-600 italic">Already Approved!</span>
                            ) : null}

                            <button 
                              onClick={() => setViewingAgreement(agreement)}
                              className="p-1.5 hover:bg-gold/10 rounded-full text-slate-300 group-hover:text-gold transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-display italic text-black-deep mb-2">Upload File</h3>
              <p className="text-xs sm:text-sm text-secondary">Step 1: Upload (PDF/DOC)</p>
            </div>

            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`p-8 sm:p-12 border-2 border-dashed rounded-3xl sm:rounded-[32px] transition-all flex flex-col items-center justify-center text-center ${
                formData.file ? 'border-green-400 bg-green-50/30' : 'border-gold/20 bg-white hover:border-gold/40'
              }`}>
                {formData.file ? (
                  <>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <div className="font-bold text-black-deep truncate max-w-[200px] sm:max-w-xs text-xs sm:text-sm">{formData.file.name}</div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gold/5 text-gold rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div className="font-bold text-black-deep text-sm sm:text-lg">Upload Document</div>
                  </>
                )}
              </div>
            </div>

            {formData.file && (
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 sm:py-4 bg-black-deep text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                Next Step
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            )}

            <button onClick={() => setStep(0)} className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-secondary">
              Back
            </button>
          </div>
        );

      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-[850px] bg-white shadow-lg border border-gray-300 flex flex-col">
                <div className="p-6 sm:p-10 md:p-20" style={{ fontFamily: "Times New Roman, serif", color: "#000", minHeight: "400px" }}>
                  <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-10 border-b-2 border-black pb-2 inline-block">
                    Signature Block
                  </h2>

                  <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                      <span className="text-[13px] sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Signer Name:</span>
                      <input
                        type="text"
                        name="signerName"
                        value={formData.signerName}
                        onChange={handleInputChange}
                        className="flex-1 border-none border-b border-black outline-none text-[13px] sm:text-base bg-transparent p-1"
                        placeholder="____________________"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                      <span className="text-[13px] sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Signer Email:</span>
                      <input
                        type="email"
                        name="signerEmail"
                        value={formData.signerEmail}
                        onChange={handleInputChange}
                        className="flex-1 border-none border-b border-black outline-none text-[13px] sm:text-base bg-transparent p-1"
                        placeholder="____________________"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                      <span className="text-[13px] sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Signer Phone:</span>
                      <input
                        type="text"
                        name="signerPhone"
                        value={formData.signerPhone}
                        onChange={handleInputChange}
                        className="flex-1 border-none border-b border-black outline-none text-[13px] sm:text-base bg-transparent p-1"
                        placeholder="____________________"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                      <span className="text-sm sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Signature:</span>
                      <div className="flex-1 min-h-[40px]">
                         {formData.signatureImageUrl ? (
                           <img
                             src={formData.signatureImageUrl}
                             alt="Signature"
                             className="max-h-16 sm:max-h-24 object-contain"
                           />
                         ) : (
                           <span className="text-slate-400 italic text-xs sm:text-sm">No signature image</span>
                         )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                      <span className="text-sm sm:text-base font-bold whitespace-nowrap sm:min-w-[150px]">Date:</span>
                      <span className="flex-1 border-b border-black p-1 text-sm sm:text-base">
                        {new Date().toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[850px] flex flex-col sm:flex-row gap-3 sm:gap-4 pb-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:flex-1 py-3 sm:py-5 bg-white text-slate-600 border border-slate-200 rounded-2xl sm:rounded-[24px] font-bold text-xs sm:text-sm uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full sm:flex-[2] py-3 sm:py-5 bg-gold text-white rounded-2xl sm:rounded-[24px] font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 sm:gap-3"
                >
                  {loading ? "Submitting..." : "Submit Agreement"}
                  {!loading && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-display italic text-black-deep mb-2">Vendor Agreement Template</h3>
              <p className="text-xs sm:text-sm text-secondary">Review, edit & generate agreement for <span className="text-gold font-bold">{salon.name}</span></p>
            </div>
            <VendorAgreementTemplate
              formData={formData}
              loading={loading}
              onGenerate={async (pdfFile) => {
                const data = new FormData();
                data.append("agreementType", "VENDOR");
                data.append("businessId", formData.businessId);
                data.append("signerName", formData.signerName);
                data.append("signerEmail", formData.signerEmail);
                data.append("signerPhone", formData.signerPhone);
                data.append("signatureImageUrl", formData.signatureImageUrl);
                data.append("file", pdfFile);
                try {
                  setLoading(true);
                  await uploadAgreementApi(data);
                  toast.success("Vendor Agreement submitted successfully!");
                  fetchAgreementHistory();
                  setStep(0);
                } catch (error) {
                  console.error("Error submitting agreement:", error);
                  toast.error(error.response?.data?.message || "Failed to submit agreement");
                } finally {
                  setLoading(false);
                }
              }}
            />
            <div className="text-center mt-4">
              <button onClick={() => setStep(0)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-secondary">
                ← Back to Selection
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all" onClick={onClose} />
      <div className={`relative bg-[#FDFBF7] w-full ${(step === 2 || step === 3 || viewingAgreement) ? 'max-w-7xl' : 'max-w-4xl'} rounded-[32px] sm:rounded-[48px] shadow-2xl overflow-hidden border border-gold/10 transition-all duration-500 ease-in-out`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 hover:bg-slate-100 rounded-full transition-colors z-40"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="p-5 sm:p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {!viewingAgreement && <ProgressBar />}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
