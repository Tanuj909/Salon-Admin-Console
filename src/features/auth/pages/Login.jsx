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
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 font-sans-alt">
      {/* Decorative top bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#B5A58A] to-transparent"></div>

      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05),0_12px_40px_rgba(0,0,0,0.08)] border border-[#E2DDD8] p-10 sm:p-12 animate-[fadeIn_0.5s_ease-out]">
        {/* Header */}
        <div className="text-center mb-9">
          <div className="w-11 h-11 border-[1.5px] border-[#B5A58A] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 stroke-[#B5A58A] fill-none stroke-[1.5]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>

          <div className="flex items-center gap-2.5 mx-auto mb-4.5 w-fit">
            <div className="w-8 h-[1px] bg-[#E2DDD8]"></div>
            <div className="w-1 h-1 bg-[#B5A58A] rounded-full"></div>
            <div className="w-8 h-[1px] bg-[#E2DDD8]"></div>
          </div>

          <h1 className="font-display text-[28px] font-semibold text-[#1C1A18] tracking-wide mb-1.5">
            Analytic Portal
          </h1>
          <p className="text-[13.5px] text-[#9E9790] font-light tracking-wide">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="text-[#C0392B] text-xs py-2 px-3 bg-[#C0392B]/5 border border-[#C0392B]/10 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-[#6B6560] tracking-[0.08em] uppercase ml-0.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full h-[46px] px-3.5 border border-[#E2DDD8] rounded-lg bg-[#FAFAF9] text-sm text-[#1C1A18] outline-none transition-all focus:border-[#B5A58A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(181,165,138,0.12)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-medium text-[#6B6560] tracking-[0.08em] uppercase ml-0.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full h-[46px] pl-3.5 pr-11 border border-[#E2DDD8] rounded-lg bg-[#FAFAF9] text-sm text-[#1C1A18] outline-none transition-all focus:border-[#B5A58A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(181,165,138,0.12)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9E9790] hover:text-[#6B6560] transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between -mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-[15px] h-[15px] border border-[#E2DDD8] rounded-[3px] bg-[#FAFAF9] accent-[#B5A58A] cursor-pointer" />
              <span className="text-[13px] text-[#6B6560]">Remember me</span>
            </label>
            <a href="#" className="text-[13px] text-[#9E9080] hover:text-[#1C1A18] transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1C1A18] hover:bg-[#2E2B28] active:translate-y-[1px] text-[#F5F4F2] rounded-lg text-[13.5px] font-medium tracking-[0.1em] uppercase transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-[#E2DDD8] text-center">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[#9E9790] tracking-wide">
            <svg className="w-[13px] h-[13px] stroke-[#9E9790] fill-none stroke-[1.8]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secured connection — authorized personnel only
          </span>
        </div>
      </div>

      <p className="mt-5 text-xs text-[#9E9790] text-center tracking-wide">
        © 2025 Analytic Portal. All rights reserved.
      </p>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Login;