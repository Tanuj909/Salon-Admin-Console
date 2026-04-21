import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordApi } from "@/services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await forgotPasswordApi(email);
      // Navigate to reset password with email in state
      navigate("/reset-password", { state: { email, showSuccessPopup: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F8F4EE] flex items-center justify-center p-6 relative overflow-hidden font-jost">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gold/5 to-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gold/5 to-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Branding outside card */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-luxe p-2 flex items-center justify-center">
              <img src="/logo/fastbooking.png" alt="FastBooking Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="font-display text-5xl italic text-black-deep mb-2">Recover Access</h1>
          <p className="text-secondary font-medium tracking-[0.2em] uppercase text-[10px]">Secure Password Recovery</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>

          <div className="p-8">
            <div className="mb-6 text-center">
              <p className="text-sm text-secondary/70">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message */}
              {error && (
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-500/5"></div>
                  <div className="relative p-4 bg-red-50/80 border border-red-200 rounded-xl text-center">
                    <p className="text-red-600 text-xs font-bold uppercase tracking-wider">{error}</p>
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@salon.com"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm 
                             placeholder:text-slate-400 text-black-deep
                             focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
                             transition-all duration-300 group-hover:border-gold/30"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"></div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold/80 rounded-xl opacity-100"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative px-6 py-3.5 flex items-center justify-center gap-3 text-black-deep font-bold">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin"></div>
                      <span className="uppercase tracking-wider text-xs">Sending OTP...</span>
                    </div>
                  ) : (
                    <>
                      <span className="uppercase tracking-wider text-xs">Send Reset OTP</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="transform group-hover:translate-x-1 transition-transform"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </div>
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-[10px] font-bold text-gold hover:text-gold/80 transition-colors uppercase tracking-widest"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
