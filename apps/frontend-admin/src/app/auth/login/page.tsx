"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/services/authService";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Local state for form inputs and loading indicator
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles login form submission and authentication flow
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that both fields are filled
    if (!email || !password) {
      toast.dismiss();
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // Attempt login with provided credentials
      const response = await loginUser({ email, password });

      // Restrict access to admin users only
      if (response.role !== "ADMIN") {
        toast.dismiss();
        toast.error("Only Admin users can access this panel.");
        return;
      }

      // Store user session and redirect to dashboard
      login(response);
      toast.dismiss();
      toast.success("Login successful");
      router.push("/");
    } catch {
      // Handle authentication failure
      toast.dismiss();
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial px-4">
      <div className="card glass w-full max-w-md p-6 rounded-xl shadow-lg border border-border">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Admin Panel Login
        </h2>

        {/* Login form with email and password fields */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="input w-full"
            />
          </div>

          {/* Submit button with loading state */}
          <Button
            type="submit"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}