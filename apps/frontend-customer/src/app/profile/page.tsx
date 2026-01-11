"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function MyProfilePage() {
  const { user, hydrated, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (hydrated && !user) {
      toast.error("⚠️ Please login to view your profile");
      router.replace("/auth/login");
    }
  }, [hydrated, user, router]);

  if (!user) return null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-center text-white mb-10 drop-shadow-lg">
          👤 My Profile
        </h1>

        {/* Profile Card */}
        <div className="relative p-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-2xl bg-white/5 text-center hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User Avatar"
                className="rounded-full border-4 border-white/20 shadow-xl w-28 h-28" // ✅ width and height classes add ki hain
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl"></div>
            </div>
          </div>

          {/* Name & Email */}
          <h2 className="text-3xl font-bold text-white mt-6">{user.fullName}</h2>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>

          {/* Role Badge */}
          <div className="mt-3 inline-block px-5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-600/40 shadow-sm">
            {user.role || "USER"}
          </div>

          {/* Session Info */}
          {user.expiresAt && (
            <div className="mt-4 text-sm text-gray-300">
              🔐 <span className="text-gray-400">Session valid till</span>{" "}
              <span className="text-white font-medium bg-white/10 px-2 py-0.5 rounded-md">
                {new Date(user.expiresAt).toLocaleString()}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-5">
            {/* My Orders */}
            <button
              className="px-7 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
              onClick={() => router.push("/orders")}
            >
              📦 My Orders
            </button>

            {/* Logout */}
            <button
              className="px-7 py-3 rounded-xl font-semibold border border-red-500/60 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:scale-105 transition-all"
              onClick={() => {
                logout();
                toast.success("✅ Logged out successfully");
                router.replace("/");
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* Placeholder for future features */}
          <div className="mt-8 text-xs text-gray-500">
            ✨ Future updates: Address, Mobile, Wishlist & more...
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          🔒 Your data is safe & secure.
        </div>
      </div>
    </section>
  );
}