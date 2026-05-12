import { useState, useEffect } from "react";
import { uploadAgreementApi, getAgreementsByBusinessApi } from "../services/salonService";
import { toast } from "react-toastify";

const AgreementModal = ({ salon, onClose }) => {
  const [step, setStep] = useState(0); // 0: Select Type/History, 1: Upload File, 2: Finalize
  const [agreementType, setAgreementType] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingAgreements, setExistingAgreements] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [viewingAgreement, setViewingAgreement] = useState(null);
  
  const [formData, setFormData] = useState({
    businessId: salon.id,
    signerName: salon.name || "",
    signerEmail: salon.email || "",
    signerPhone: salon.phone || "",
    signatureImageUrl: "",
    file: null,
  });

  useEffect(() => {
    fetchAgreementHistory();
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
    <div className="flex items-center justify-center mb-8 px-4">
      {[
        { id: 0, label: "Type" },
        { id: 1, label: "Upload" },
        { id: 2, label: "Finalize" }
      ].map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
            step >= s.id ? 'bg-gold border-gold text-white' : 'border-slate-200 text-slate-400'
          }`}>
            {step > s.id ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <span className="text-xs font-bold">{i + 1}</span>
            )}
          </div>
          {i < 2 && (
            <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-all ${
              step > s.id ? 'bg-gold' : 'bg-slate-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderAgreementView = (agreement) => (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => setViewingAgreement(null)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-black-deep transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to List
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Agreement ID: #{agreement.id}</span>
      </div>

      <div className="w-full max-w-5xl mx-auto bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        {/* DOCUMENT VIEW */}
        <div className="bg-slate-50 border-b border-slate-100 flex flex-col">
           <div className="w-full h-full min-h-[600px] flex flex-col items-center">
              {agreement.agreementFileUrl ? (
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(agreement.agreementFileUrl)}&embedded=true`}
                  className="w-full h-[600px] border-none"
                  title="Agreement Preview"
                />
              ) : (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-200">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">No document URL found</span>
                </div>
              )}
           </div>
           
           <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
              <a 
                href={agreement.agreementFileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-gold transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                View in Fullscreen
              </a>
           </div>
        </div>

        {/* TEMPLATE SECTION */}
        <div style={{ padding: "80px 100px", fontFamily: "Times New Roman, serif", color: "#000", backgroundColor: "#fff" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "40px", borderBottom: "2px solid #000", paddingBottom: "8px", display: "inline-block" }}>
            {agreement.agreementType} Agreement
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "180px" }}>Signer Name:</span>
              <span style={{ fontSize: "16px", flex: 1, borderBottom: "1px solid #eee", paddingBottom: "4px" }}>{agreement.signerName}</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "180px" }}>Signer Email:</span>
              <span style={{ fontSize: "16px", flex: 1, borderBottom: "1px solid #eee", paddingBottom: "4px" }}>{agreement.signerEmail}</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "180px" }}>Signed At:</span>
              <span style={{ fontSize: "16px", flex: 1, borderBottom: "1px solid #eee", paddingBottom: "4px" }}>{new Date(agreement.signedAt).toLocaleString()}</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "180px" }}>Stamp Image:</span>
              <div style={{ flex: 1, borderBottom: "1px solid #eee", paddingBottom: "4px" }}>
                {agreement.stampImageUrl ? (
                  <img src={agreement.stampImageUrl} alt="Stamp" style={{ maxHeight: "120px", objectFit: "contain" }} />
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic", fontSize: "14px" }}>No stamp image available</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "100px", textAlign: "right" }}>
             <div style={{ display: "inline-block", padding: "20px", border: "2px double #000", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase" }}>
               Agreement Status: {agreement.status}
             </div>
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
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-2xl font-display italic text-black-deep mb-2">Salon Agreement Management</h3>
              <p className="text-sm text-secondary">Manage and view agreements for <span className="text-gold font-bold">{salon.name}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setAgreementType("VENDOR");
                  setStep(1);
                }}
                className="p-8 border-2 border-gold/10 hover:border-gold rounded-3xl bg-white hover:shadow-xl hover:shadow-gold/5 transition-all text-center group"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M18 7a4 4 0 0 0-3-3.87"/></svg>
                </div>
                <div className="font-bold text-lg text-black-deep">New Vendor Agreement</div>
              </button>
              <button
                onClick={() => toast.info("Customer Agreement coming soon!")}
                className="p-8 border-2 border-slate-50 hover:border-slate-200 rounded-3xl bg-slate-50/30 transition-all text-center group grayscale opacity-60"
              >
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <div className="font-bold text-lg text-slate-500">New Customer Agreement</div>
              </button>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Agreement History</h4>
                <div className="w-1/2 h-px bg-slate-100" />
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {fetchingHistory ? (
                  <div className="p-12 text-center flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fetching history...</span>
                  </div>
                ) : existingAgreements.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <p className="text-sm italic">No existing agreements found for this salon.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {existingAgreements.map((agreement) => (
                      <div 
                        key={agreement.id} 
                        onClick={() => setViewingAgreement(agreement)}
                        className="p-5 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            agreement.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {agreement.agreementType.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-black-deep group-hover:text-gold transition-colors">{agreement.signerName}</div>
                            <div className="text-[10px] text-secondary font-medium">
                              {new Date(agreement.signedAt).toLocaleDateString()} • {agreement.agreementType}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                            agreement.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {agreement.status}
                          </span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 group-hover:text-gold transition-colors"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-display italic text-black-deep mb-2">Upload Document</h3>
              <p className="text-sm text-secondary">Step 1: Upload the agreement file (PDF/DOC)</p>
            </div>

            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`p-12 border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center text-center ${
                formData.file ? 'border-green-400 bg-green-50/30' : 'border-gold/20 bg-white hover:border-gold/40'
              }`}>
                {formData.file ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <div className="font-bold text-black-deep truncate max-w-xs">{formData.file.name}</div>
                    <div className="text-xs text-green-600 font-bold mt-1 uppercase tracking-widest">File Ready</div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gold/5 text-gold rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div className="font-bold text-black-deep text-lg text-center">Click or Drag to Upload</div>
                  </>
                )}
              </div>
            </div>

            {formData.file && (
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-black-deep text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 animate-in zoom-in duration-300"
              >
                Next Step
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            )}

            <button onClick={() => setStep(0)} className="w-full text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-colors">
              Back to history
            </button>
          </div>
        );

      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col items-center gap-6">
              {/* Single continuous white document - signature block only */}
              <div className="w-full max-w-[850px] bg-white shadow-lg border border-gray-300 flex flex-col">

                {/* ── Signer Details Section (plain B&W, DOCX style) ── */}
                <div style={{ padding: "80px 100px", fontFamily: "Times New Roman, serif", color: "#000", minHeight: "600px" }}>

                  <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "40px", borderBottom: "2px solid #000", paddingBottom: "8px", display: "inline-block" }}>
                    Signature Block
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "20px" }}>

                    {/* signerName */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "150px" }}>Signer Name:</span>
                      <input
                        type="text"
                        name="signerName"
                        value={formData.signerName}
                        onChange={handleInputChange}
                        placeholder="________________________________________________"
                        style={{
                          flex: 1,
                          border: "none",
                          borderBottom: "1px solid #333",
                          outline: "none",
                          fontSize: "16px",
                          fontFamily: "Times New Roman, serif",
                          padding: "4px 0",
                          background: "transparent",
                          color: "#000",
                        }}
                      />
                    </div>

                    {/* signerEmail */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "150px" }}>Signer Email:</span>
                      <input
                        type="email"
                        name="signerEmail"
                        value={formData.signerEmail}
                        onChange={handleInputChange}
                        placeholder="________________________________________________"
                        style={{
                          flex: 1,
                          border: "none",
                          borderBottom: "1px solid #333",
                          outline: "none",
                          fontSize: "16px",
                          fontFamily: "Times New Roman, serif",
                          padding: "4px 0",
                          background: "transparent",
                          color: "#000",
                        }}
                      />
                    </div>

                    {/* signerPhone */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "150px" }}>Signer Phone:</span>
                      <input
                        type="text"
                        name="signerPhone"
                        value={formData.signerPhone}
                        onChange={handleInputChange}
                        placeholder="________________________________________________"
                        style={{
                          flex: 1,
                          border: "none",
                          borderBottom: "1px solid #333",
                          outline: "none",
                          fontSize: "16px",
                          fontFamily: "Times New Roman, serif",
                          padding: "4px 0",
                          background: "transparent",
                          color: "#000",
                        }}
                      />
                    </div>

                    {/* signatureImageUrl */}
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "150px" }}>Signature:</span>
                        <input
                          type="text"
                          name="signatureImageUrl"
                          value={formData.signatureImageUrl}
                          onChange={handleInputChange}
                          placeholder="Paste signature image URL here"
                          style={{
                            flex: 1,
                            border: "none",
                            borderBottom: "1px solid #333",
                            outline: "none",
                            fontSize: "14px",
                            fontFamily: "Times New Roman, serif",
                            padding: "4px 0",
                            background: "transparent",
                            color: "#666",
                            fontStyle: "italic",
                          }}
                        />
                      </div>
                      {formData.signatureImageUrl && (
                        <div style={{ marginTop: "16px", marginLeft: "162px" }}>
                          <img
                            src={formData.signatureImageUrl}
                            alt="Signature"
                            style={{ maxHeight: "100px", objectFit: "contain" }}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "150px" }}>Date:</span>
                      <span style={{ fontSize: "16px", fontFamily: "Times New Roman, serif", borderBottom: "1px solid #333", padding: "4px 0", minWidth: "250px" }}>
                        {new Date().toLocaleDateString("en-GB")}
                      </span>
                    </div>

                  </div>
                  
                  <div style={{ marginTop: "100px", textAlign: "right" }}>
                    <div style={{ display: "inline-block", width: "200px", height: "200px", border: "1px dashed #ccc", textAlign: "center", lineHeight: "200px", color: "#ccc", fontSize: "12px" }}>
                      Company Stamp
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[850px] flex gap-4 pb-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-white text-slate-600 border border-slate-200 rounded-[24px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  Change Document
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-5 bg-gold text-white rounded-[24px] font-bold uppercase tracking-widest hover:bg-gold-dark transition-all shadow-2xl shadow-gold/20 flex items-center justify-center gap-3"
                >
                  {loading ? "Submitting..." : "Submit Agreement"}
                  {!loading && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all" onClick={onClose} />
      <div className={`relative bg-[#FDFBF7] w-full ${(step === 2 || viewingAgreement) ? 'max-w-6xl' : 'max-w-2xl'} rounded-[48px] shadow-2xl overflow-hidden border border-gold/10 transition-all duration-500 ease-in-out`}>
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors z-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="p-8 sm:p-12 max-h-[95vh] overflow-y-auto custom-scrollbar">
          {!viewingAgreement && <ProgressBar />}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
