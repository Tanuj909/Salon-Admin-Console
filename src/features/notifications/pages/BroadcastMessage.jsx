import { useState } from "react";
import { sendBroadcastApi } from "../services/broadcastService";
import { toast } from "react-toastify";

const TARGET_OPTIONS = ["ALL_USERS", "CUSTOMERS", "ADMINS", "STAFF", "RECEPTIONISTS"];

const BroadcastMessage = () => {
  // Form states
  const [target, setTarget] = useState("ALL_USERS");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [metadata, setMetadata] = useState([{ key: "", value: "" }]);
  
  // Status states
  const [sending, setSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Metadata key-value handlers
  const handleAddMetaRow = () => {
    setMetadata(prev => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveMetaRow = (index) => {
    setMetadata(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMetaChange = (index, field, value) => {
    setMetadata(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Convert key-value array into JSON object
  const serializeMetadata = () => {
    const dataObj = {};
    metadata.forEach(row => {
      if (row.key.trim()) {
        dataObj[row.key.trim()] = row.value;
      }
    });
    return Object.keys(dataObj).length > 0 ? dataObj : null;
  };

  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.warning("Please fill in the Title and Message fields.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    try {
      setSending(true);
      setShowConfirmModal(false);
      
      const payload = {
        title,
        message,
        target,
        actionUrl: actionUrl.trim() || null,
        data: serializeMetadata()
      };

      await sendBroadcastApi(payload);
      toast.success("Broadcast initiated successfully!");
      
      // Reset form
      setTitle("");
      setMessage("");
      setActionUrl("");
      setMetadata([{ key: "", value: "" }]);
    } catch (err) {
      console.error("Failed to initiate broadcast", err);
      toast.error(err.response?.data?.message || "Failed to initiate broadcast. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full font-jost font-light min-h-[calc(100vh-80px)] p-3 sm:p-6">
      <div className="responsive-container pb-12 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 px-1">
          <h1 className="text-responsive-h2 font-display italic text-black-deep mb-2 leading-tight">Broadcast Message</h1>
          <p className="text-secondary text-sm sm:text-base">Distribute custom announcements, push notifications, and priority updates to targeted segments of users.</p>
        </div>

        {/* Target Tabs */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 border-b border-gold/10 pb-4">
          {TARGET_OPTIONS.map(opt => {
            const isActive = target === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setTarget(opt)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all cursor-pointer border ${
                  isActive
                    ? "bg-gold text-white border-gold shadow-md shadow-gold/10"
                    : "bg-white text-secondary border-gold/10 hover:bg-gold/5 hover:border-gold/30"
                }`}
              >
                {opt.replace("_", " ")}
              </button>
            );
          })}
        </div>

        {/* Form Panel */}
        <div className="bg-white rounded-2xl sm:rounded-[32px] border border-gold/10 shadow-sm overflow-hidden">
          <div className="bg-[#FDFBF7] px-5 py-5 sm:p-8 border-b border-gold/10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl sm:text-2xl italic text-black-deep">Configure Broadcast</h2>
              <p className="text-secondary text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">
                Targeting: <span className="text-gold font-bold">{target.replace("_", " ")}</span>
              </p>
            </div>
            
            <div className="bg-gold/10 p-2 rounded-xl text-gold hidden sm:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>

          <form onSubmit={handleOpenConfirmation} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 sm:mb-2.5 ml-1">Broadcast Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. System Maintenance Notification"
                className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 sm:mb-2.5 ml-1">Message Content *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Type the message that will be delivered to target users..."
                className="w-full h-32 bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Action URL */}
            <div>
              <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 sm:mb-2.5 ml-1">Action URL (Optional)</label>
              <input
                type="text"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="e.g. /offers/health-camp"
                className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-3 sm:py-3.5 px-4 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Key-Value Data */}
            <div className="border-t border-slate-100 pt-5 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">Custom Payload Data (Optional)</label>
                <button
                  type="button"
                  onClick={handleAddMetaRow}
                  className="px-2.5 py-1.5 border border-gold/20 hover:bg-gold/5 text-gold text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Add Field
                </button>
              </div>

              <div className="space-y-3">
                {metadata.map((row, index) => (
                  <div key={index} className="flex gap-2 sm:gap-3 items-center">
                    <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={row.key}
                        onChange={(e) => handleMetaChange(index, "key", e.target.value)}
                        placeholder="Key"
                        className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-xl text-xs focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-semibold min-w-0"
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleMetaChange(index, "value", e.target.value)}
                        placeholder="Value"
                        className="w-full bg-slate-50/50 border border-slate-200 text-black-deep py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-xl text-xs focus:outline-none focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/5 transition-all placeholder:text-slate-400 font-semibold min-w-0"
                      />
                    </div>
                    
                    {metadata.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMetaRow(index)}
                        className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border border-red-100 text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-all shrink-0"
                        title="Remove Metadata Field"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 sm:py-4 rounded-xl bg-gold text-white font-bold hover:bg-black-deep hover:shadow-xl hover:shadow-black/10 transition-all disabled:opacity-50 border-0 uppercase tracking-[0.15em] text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Initiating...</span>
                </>
              ) : (
                <span>Publish Broadcast</span>
              )}
            </button>

          </form>
        </div>

      </div>

      {/* Safety Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1500] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 mx-2">
            <div className="p-5 sm:p-8 bg-[#FDFBF7] border-b border-gold/10 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-gold/10 text-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>
              </div>
              <h3 className="font-display text-lg sm:text-2xl italic text-black-deep mb-2">Confirm Broadcast Delivery</h3>
              <p className="text-secondary text-[11px] sm:text-sm leading-relaxed">
                You are about to publish a broadcast message immediately to all users in: <strong>{target.replace("_", " ")}</strong>.
              </p>
            </div>

            <div className="p-5 sm:p-8 space-y-4 text-[11px] sm:text-xs font-semibold text-left max-h-[350px] overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Broadcast Title</div>
                <div className="text-black-deep font-bold text-xs sm:text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-100">{title}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Broadcast Message</div>
                <div className="text-black-deep text-[11px] sm:text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-medium">{message}</div>
              </div>

              {actionUrl && (
                <div className="space-y-1">
                  <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Action URL</div>
                  <div className="text-gold font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100 break-all">{actionUrl}</div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-3 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-secondary hover:bg-slate-100 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 px-3 py-2.5 sm:py-3 rounded-xl bg-gold text-white hover:bg-black-deep font-bold uppercase tracking-widest text-[9px] sm:text-[10px] transition-all shadow-lg shadow-gold/20 cursor-pointer"
              >
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BroadcastMessage;
