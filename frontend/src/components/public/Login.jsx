import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Login = () => {
  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/admin/vehicles", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 
        Embedded Custom CSS for the Staggered Entrance Animation.
        Ensures the animation works immediately upon copy-pasting.
      */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
        `}
      </style>

      <main className="min-h-screen flex bg-[#0A0A0A] font-sans text-[#FFFFFF] overflow-hidden">
        {/* ========================================== */}
        {/* LEFT COLUMN: Media (Hidden on Mobile)      */}
        {/* ========================================== */}
        <div className="relative hidden lg:flex lg:w-1/2 h-screen overflow-hidden">
          {/* Moody Premium Car Image */}
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"
            alt="Fantics Motors Premium Vehicle"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradients to seamlessly blend the image into the dark theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>

          {/* Subtle branding overlay on image */}
          <div className="absolute bottom-12 left-12 animate-fade-in-up delay-400">
            <h2 className="text-3xl font-extrabold tracking-wider">
              Fantics<span className="text-[#0066FF]">Cars</span>
            </h2>
            <p className="text-gray-400 mt-2 font-medium">
              Performance, Prestige, and Power.
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: Form Area                    */}
        {/* ========================================== */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
          {/* Top Left Navigation (Absolute on mobile, flowing on desktop if desired, but absolute keeps it clean) */}
          <Link
            to="/"
            className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-sm text-gray-400 hover:text-[#0066FF] transition-all duration-300 hover:-translate-x-1 group animate-fade-in-up"
          >
            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          {/* Form Container */}
          <div className="w-full max-w-md flex flex-col pt-12 sm:pt-0">
            {/* Header */}
            <div className="mb-10 animate-fade-in-up delay-100">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Enter your details to access your Fantics Motors account and
                manage your fleet.
              </p>
            </div>

            {/* Login Form */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </div>
            )}
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5 animate-fade-in-up delay-200"
            >
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="text-sm font-semibold text-gray-300 ml-1"
                >
                  Email or username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#0066FF] transition-colors">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="login-email"
                    autoComplete="username"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#171717] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-[#FFFFFF] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300 shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-gray-300 ml-1"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#0066FF] transition-colors">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#171717] border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-[#FFFFFF] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300 shadow-inner"
                  />
                  {/* Eye Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#0066FF] transition-colors focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0066FF] text-[#FFFFFF] font-bold text-lg py-3.5 rounded-xl mt-4 hover:-translate-y-0.5 hover:shadow-[0_4px_25px_rgba(0,102,255,0.5)] transition-all duration-300 flex justify-center items-center"
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;

// ==========================================
// REUSABLE SVGs (Lucide-React Equivalents)
// ==========================================
const ArrowLeftIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);
