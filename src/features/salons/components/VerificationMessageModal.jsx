import { useState, useEffect, useRef } from "react";
import { getVerificationMessagesApi, sendVerificationMessageApi } from "../services/salonService";

const VerificationMessageModal = ({ isOpen, onClose, businessId, businessName }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && businessId) {
      fetchMessages();
    }
  }, [isOpen, businessId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVerificationMessagesApi(businessId);
      // Data is paginated, we want the content reversed for chat flow (oldest at top)
      setMessages((data.content || []).reverse());
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    try {
      setSending(true);
      await sendVerificationMessageApi(businessId, newMessage, attachment);
      setNewMessage("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchMessages();
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1001] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-[20px] sm:rounded-[24px] w-full max-w-2xl h-[90vh] sm:h-[80vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col my-2 sm:my-8">
        {/* Header */}
        <div className="bg-[#FDFBF7] p-4 sm:p-6 border-b border-gold/10 flex justify-between items-start shrink-0">
          <div className="max-w-[80%]">
            <h2 className="font-display text-xl sm:text-2xl italic text-black-deep text-left leading-tight">Verification Messages</h2>
            <p className="text-secondary tracking-wide text-[10px] mt-1 uppercase font-bold tracking-widest text-left truncate">
              Business: <span className="text-gold break-all">{businessName || "Unknown"}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-black-deep hover:bg-slate-100 p-1.5 sm:p-2 rounded-full transition-colors shrink-0"
          >
            <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30 custom-scrollbar">
          {loading && messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
              <span className="text-secondary font-medium tracking-wider uppercase text-[10px]">Loading conversation...</span>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <p className="text-red-500 font-medium text-xs">{error}</p>
              <button onClick={fetchMessages} className="text-gold text-[10px] font-bold uppercase hover:underline">Retry</button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm border border-slate-100">
                <svg width="20" height="20" sm:width="24" sm:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </div>
              <p className="text-black-deep font-bold italic text-base sm:text-lg">No messages yet</p>
              <p className="text-secondary text-xs sm:text-sm">Start a conversation with the business owner regarding their verification.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 shadow-sm border ${
                  msg.isFromAdmin 
                    ? 'bg-black-deep text-white border-black-deep' 
                    : 'bg-white text-black-deep border-slate-100'
                }`}>
                  <div className="flex justify-between items-center gap-3 sm:gap-4 mb-1.5">
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate ${msg.isFromAdmin ? 'text-gold' : 'text-secondary'}`}>
                      {msg.senderName} 
                    </span>
                    <span className={`text-[8px] sm:text-[9px] shrink-0 ${msg.isFromAdmin ? 'text-slate-400' : 'text-slate-400'}`}>
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-left whitespace-pre-wrap break-words">{msg.message}</p>
                  
                  {msg.attachmentUrl && (
                    <div className={`mt-2.5 pt-2.5 border-t ${msg.isFromAdmin ? 'border-white/10' : 'border-slate-100'}`}>
                      <a 
                        href={msg.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold hover:underline ${msg.isFromAdmin ? 'text-gold' : 'text-gold'}`}
                      >
                        <svg width="12" height="12" sm:width="14" sm:height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                        <span className="truncate max-w-[120px] sm:max-w-[200px]">{msg.attachmentUrl.split('/').pop()}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSend} className="space-y-4">
            {attachment && (
              <div className="flex items-center justify-between bg-gold/5 border border-gold/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl">
                <div className="flex items-center gap-2 text-gold text-[10px] sm:text-xs font-bold truncate">
                  <svg width="12" height="12" sm:width="14" sm:height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                  <span className="truncate max-w-[150px] sm:max-w-xs">{attachment.name}</span>
                </div>
                <button type="button" onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-600 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            )}
            
            <div className="flex gap-2 sm:gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  className="w-full bg-slate-50 border border-slate-200 text-black-deep py-2.5 px-3 sm:py-3 sm:px-4 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all font-medium placeholder:text-slate-400 resize-none min-h-[40px] max-h-[120px]"
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute right-2.5 bottom-2.5 sm:right-3 sm:bottom-3 text-slate-400 hover:text-gold transition-colors"
                >
                  <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <button
                type="submit"
                disabled={sending || (!newMessage.trim() && !attachment)}
                className="bg-gold text-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 disabled:opacity-50 disabled:shadow-none shrink-0"
              >
                {sending ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationMessageModal;
