import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Satellite, Eye, EyeOff, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-orbital-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `pulse-glow ${2 + Math.random() * 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-orbital-primary flex items-center justify-center">
              <Satellite className="w-5 h-5 text-orbital-primary" />
            </div>
            <span className="text-2xl font-bold text-orbital-primary font-mono tracking-wider">
              ORBITAL-X
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="card-glow p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-orbital-muted text-center text-sm mb-6">
            Sign in to access Mission Control
          </p>

          {error && (
            <div className="bg-orbital-danger/10 border border-orbital-danger/30 rounded-md px-4 py-3 mb-4 text-sm text-orbital-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-mono block mb-1.5">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@orbitalx.sys"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label-mono block mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orbital-muted hover:text-orbital-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-orbital-bg/30 border-t-orbital-bg rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-orbital-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-orbital-primary hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Dev credentials hint */}
        <div className="mt-4 card p-3 text-xs text-orbital-muted">
          <p className="font-mono text-center mb-1 text-orbital-text-dim">
            Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@orbitalx.sys");
                setPassword("admin123");
              }}
              className="border border-orbital-border rounded px-2 py-1 hover:border-orbital-primary hover:text-orbital-primary transition-colors cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("operator@orbitalx.sys");
                setPassword("operator123");
              }}
              className="border border-orbital-border rounded px-2 py-1 hover:border-orbital-primary hover:text-orbital-primary transition-colors cursor-pointer"
            >
              Operator
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("viewer@orbitalx.sys");
                setPassword("viewer123");
              }}
              className="border border-orbital-border rounded px-2 py-1 hover:border-orbital-primary hover:text-orbital-primary transition-colors cursor-pointer"
            >
              Viewer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
