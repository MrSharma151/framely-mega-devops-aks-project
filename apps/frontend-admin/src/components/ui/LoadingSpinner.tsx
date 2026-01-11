"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[var(--background)] to-[var(--surface)] text-[var(--text-primary)]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner element */}
        <div className="w-14 h-14 border-4 border-transparent border-t-[var(--highlight)] border-l-[var(--highlight)] rounded-full animate-spin shadow-xl shadow-[var(--highlight)]/10" />

        {/* Loading status message */}
        <span className="text-lg font-medium tracking-wide text-[var(--text-secondary)]">
          Loading Admin Panel...
        </span>
      </div>
    </div>
  );
}