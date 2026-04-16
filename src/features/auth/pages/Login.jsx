import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { removeToken } from "@/utils/token";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Clear any existing tokens when login page loads
  useEffect(() => {
    removeToken();
    localStorage.removeItem("admin_user");
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginApi(form);
      // Process login (store token, fetch profile)
      await login(data);
      
      // Use the root redirect logic which is role-aware
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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
          <h1 className="font-display text-5xl italic text-black-deep mb-2">FastBooking</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
            <p className="text-secondary font-medium tracking-[0.3em] uppercase text-[10px]">Administrative Console</p>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Subtle top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>

          <div className="p-8">
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
                    name="email"
                    value={form.email}
                    onChange={handleChange}
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

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-gold hover:text-gold/80 transition-colors uppercase tracking-wider"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm 
                             placeholder:text-slate-400 text-black-deep pr-12
                             focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10
                             transition-all duration-300 group-hover:border-gold/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                             hover:text-gold transition-colors duration-300"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
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
                      <span className="uppercase tracking-wider text-xs">Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span className="uppercase tracking-wider text-xs">Enter Sanctuary</span>
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

              {/* Security note */}
              <div className="text-center">
                <p className="text-[10px] text-secondary/60 uppercase tracking-wider">
                  🔒 Secured by SalonFlow • SSL Encrypted
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="relative px-8 py-4 bg-gradient-to-r from-black-deep/5 to-black-deep/10 border-t border-white/50">
            <p className="text-[10px] text-secondary/60 uppercase tracking-wider text-center">
              Authorized Personnel Only • Powered by SalonFlow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;