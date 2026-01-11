// src/components/ui/Button.tsx
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

// Reusable button component with variant, size, and animation support
export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  // Base layout and interaction styles
  const baseStyles = `
    relative inline-flex items-center justify-center rounded-xl font-semibold
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]
    overflow-hidden
    group
  `;

  // Size-specific padding and font sizing
  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  // Variant-specific color, border, and hover behavior
  const variantStyles = {
    primary: `
      text-white 
      bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
      shadow-[0_4px_14px_rgba(80,120,255,0.4)]
      hover:shadow-[0_6px_20px_rgba(90,140,255,0.5)]
      hover:scale-[1.03]
    `,
    secondary: `
      text-[var(--foreground)]
      bg-[var(--background-alt)]
      border border-white/10
      hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10
      hover:scale-[1.02]
    `,
    outline: `
      border border-blue-400/50 
      text-blue-400 
      hover:bg-blue-500/10 hover:text-white 
      hover:scale-[1.03]
      shadow-[0_0_8px_rgba(80,120,255,0.3)]
    `,
    glass: `
      bg-white/5 backdrop-blur-md 
      text-white 
      border border-white/10
      hover:border-blue-400/30 hover:bg-blue-500/10
      hover:shadow-[0_0_10px_rgba(80,120,255,0.3)]
      hover:scale-[1.02]
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${baseStyles} 
        ${sizeStyles[size]} 
        ${variantStyles[variant]} 
        ${className}
      `}
    >
      {/* Main label */}
      {children}

      {/* Shine animation on hover */}
      <span
        className="
          absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-200%] group-hover:translate-x-[200%]
          transition-transform duration-700 ease-in-out
        "
      />

      {/* Glow outline on hover */}
      <span
        className="
          absolute inset-0 rounded-xl pointer-events-none
          opacity-0 group-hover:opacity-100
          transition duration-500
          shadow-[0_0_15px_rgba(100,150,255,0.4)]
        "
      />
    </button>
  );
}