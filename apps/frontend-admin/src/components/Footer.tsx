export default function Footer() {
  // Dynamically retrieves the current year
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        mt-12 
        bg-[rgba(11,30,57,0.9)]
        backdrop-blur-xl 
        border-t border-[var(--border-color)]
        shadow-[0_-2px_12px_rgba(0,0,0,0.4)]
        text-center 
        py-6 
        transition-all
      "
    >
      {/* Displays footer branding and legal notice */}
      <div
        className="
          text-xs 
          text-[var(--text-secondary)]
          tracking-wide
        "
      >
        © {year}{" "}
        <span
          className="
            font-semibold 
            bg-gradient-to-r from-[#A5D7E8] to-[#8AB4F8]
            bg-clip-text text-transparent
            drop-shadow-[0_0_6px_rgba(165,215,232,0.25)]
          "
        >
          Framely Admin
        </span>{" "}
        · All rights reserved.
      </div>
    </footer>
  );
}