"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { registerUser } from "@/services/authService"; // Centralized registration service

/* Register page component */
export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* Frontend form validation */
  const validateForm = () => {
    if (fullName.trim().length < 6) {
      toast.error("Full name must be at least 6 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
      );
      return false;
    }

    return true;
  };

  /* Handles form submission */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await registerUser({ fullName, email, phoneNumber, password });
      toast.success("User registered successfully! Please login to continue.");
      router.push("/auth/login"); // redirect to login
    } catch (error: unknown) {
      // Narrowing unknown error to preserve type safety and avoid eslint violations
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
      } else {
        console.error("Unknown registration error:", error);
      }
      toast.error("Registration failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-4 relative">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-transparent to-[var(--background-alt)] opacity-70"></div>

      {/* Glassy registration card */}
      <div className="glass p-8 w-full max-w-md animate-fadeInUp relative z-10 shadow-2xl rounded-2xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[var(--accent)] to-[#78c7ff] bg-clip-text text-transparent">
          Create Your Account
        </h1>
        <p className="text-center text-sm text-[var(--foreground-muted)] mb-6">
          Join us and explore premium features
        </p>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-[var(--foreground-muted)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background-alt)] text-[var(--foreground)] placeholder-gray-500 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-[var(--foreground-muted)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background-alt)] text-[var(--foreground)] placeholder-gray-500 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-[var(--foreground-muted)] mb-1">
              Phone Number
            </label>
            <div className="flex">
              <span className="px-3 py-3 rounded-l-xl bg-[var(--background-alt)] border border-[var(--glass-border)] text-[var(--foreground-muted)] text-sm">
                +91
              </span>
              <input
                type="text"
                placeholder="10-digit mobile number"
                maxLength={10}
                className="w-full px-4 py-3 rounded-r-xl bg-[var(--background-alt)] text-[var(--foreground)] placeholder-gray-500 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-sm"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[var(--foreground-muted)] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background-alt)] text-[var(--foreground)] placeholder-gray-500 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-[var(--foreground-muted)] mt-1 leading-snug">
              Must include <span className="text-[var(--accent)] font-medium">8+ chars</span>, an uppercase, lowercase, number & special symbol
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 shadow-lg hover:shadow-[0_6px_18px_rgba(77,166,255,0.3)]"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        {/* Already have an account link */}
        <p className="text-sm text-center mt-6 text-[var(--foreground-muted)]">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}