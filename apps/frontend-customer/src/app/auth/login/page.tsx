"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { loginUser } from "@/services/authService"; // Service to handle login

/* Login page component */
export default function LoginPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!auth) return null;

  /* Handles login form submission */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call login service
      const response = await loginUser({ email, password });

      // Update AuthContext with user info
      auth.login(response);

      toast.success("Login successful");
      router.push("/"); // Redirect to homepage
    } catch (error: unknown) {
      // ✅ Type-safe error handling using `unknown`
      if (error instanceof Error) {
        console.error("Login error:", error.message);
      } else {
        console.error("Login error:", error);
      }
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen px-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--background-alt)]/20 blur-3xl opacity-30"></div>

      {/* Glassy login card */}
      <div className="glass p-8 sm:p-10 w-full max-w-md animate-fadeInUp relative z-10 rounded-2xl shadow-2xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent)] relative inline-block">
            Welcome Back
            <span className="block h-[3px] w-12 bg-[var(--accent)] rounded-full mx-auto mt-3"></span>
          </h1>
          <p className="text-[var(--foreground-muted)] text-sm mt-3">
            Sign in to continue your journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm text-[var(--foreground-muted)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background-alt)] text-[var(--foreground)] placeholder-gray-500 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-[var(--foreground-muted)]">Password</label>
              <span className="text-xs text-[var(--foreground-muted)] italic opacity-50">
                (Forgot password?)
              </span>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background-alt)] text-[var(--foreground)] placeholder-gray-500 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 shadow-lg hover:shadow-[0_6px_18px_rgba(77,166,255,0.3)]"
          >
            {loading ? "Logging in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-[var(--glass-border)]"></div>
          <span className="px-3 text-xs text-[var(--foreground-muted)]">or</span>
          <div className="flex-grow h-px bg-[var(--glass-border)]"></div>
        </div>

        {/* Register Link */}
        <p className="text-sm text-center text-[var(--foreground-muted)]">
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition"
          >
            Create one now
          </a>
        </p>
      </div>
    </div>
  );
}