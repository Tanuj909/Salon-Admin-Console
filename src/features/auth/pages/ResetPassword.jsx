import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPasswordApi } from "@/services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(location.state?.showSuccessPopup || false);
  const [popupProgress, setPopupProgress] = useState(100);

  // Auto-dismiss popup after 10 seconds with progress bar
  useEffect(() => {
    if (showPopup) {
      const duration = 10000; // 10 seconds
      const interval = 100; // Update every 100ms
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const remaining = 100 - (currentStep / steps) * 100;
        setPopupProgress(remaining);
        
        if (currentStep >= steps) {
          setShowPopup(false);
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [showPopup]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword
      };
      await resetPasswordApi(payload);
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please verify your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F8F4EE] flex items-center justify-center p-6 relative overflow-hidden font-jost">
      {/* 10-Second Success Popup */}
      {showPopup && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-black-deep text-white rounded-2xl shadow-2xl border border-gold/20 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-gold">OTP Sent!</p>
                  <p className="text-[10px] text-white/70">Please check your email inbox.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Progress Bar */}
            <div className="h-1 bg-white/10 w-full">
              <div 
                className="h-full bg-gold transition-all duration-100 ease-linear" 
                style={{ width: `${popupProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gold/5 to-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gold/5 to-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl italic text-black-deep mb-1">Set New Password</h1>
          <p className="text-secondary font-medium tracking-[0.2em] uppercase text-[10px]">Complete verification to continue</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                  <p className="text-red-600 text-xs font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">{success}</p>
                </div>
              )}

              {/* Email (Pre-filled/Read-only) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-secondary/60 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* OTP Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Verification OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono tracking-[0.5em] text-center
                             focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                  maxLength="6"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full relative overflow-hidden group mt-4"
              >
                <div className="absolute inset-0 bg-black-deep rounded-xl transition-colors group-hover:bg-black-deep/90"></div>
                <div className="relative px-6 py-3.5 flex items-center justify-center gap-3 text-gold font-bold">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                  ) : (
                    <span className="uppercase tracking-widest text-xs">Reset Password</span>
                  )}
                </div>
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-[10px] font-bold text-secondary/60 hover:text-gold transition-colors uppercase tracking-widest"
                >
                  Cancel and Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
