import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

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
      login(data);

      if (data.role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-ornament"></div>
      <div className="auth-bg-ornament-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title font-display text-4xl italic text-black-deep">Salon Luxe</h1>
          <p className="auth-subtitle text-secondary font-medium tracking-widest uppercase text-[10px] mt-2">Administrative Console</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="e.g. admin@salon.com"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="auth-label mb-0">Password</label>
              <button type="button" className="text-[11px] font-bold text-gold hover:underline bg-transparent border-0 cursor-pointer">Forgot?</button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="auth-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8 select-none cursor-pointer group">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gold/20 accent-gold" />
            <label htmlFor="remember" className="text-xs text-secondary font-medium group-hover:text-black-deep cursor-pointer">Stay signed in for 30 days</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn flex items-center justify-center gap-3 bg-gold text-black-deep hover:bg-gold/80 hover:shadow-luxe transition-all cursor-pointer border-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black-deep/30 border-t-black-deep rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="font-bold uppercase tracking-widest text-xs">Enter Sanctuary</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Authorized Personnel Only • Powered by SalonFlow</p>
        </div>
      </div>
    </div>
  );
};

export default Login;