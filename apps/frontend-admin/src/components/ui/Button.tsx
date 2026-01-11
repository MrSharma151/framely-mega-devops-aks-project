import React from "react";
import clsx from "clsx";

// Defines props for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "gradient" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  // Base styles applied to all buttons
  const baseStyle =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-all duration-150";

  // Size-specific styles
  const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
    icon: "p-2", // Used for icon-only buttons
  };

  // Variant-specific styles
  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-[var(--accent-primary)] text-white hover:bg-blue-700",
    secondary: "bg-[var(--surface-hover)] text-[var(--text-primary)] hover:bg-[var(--surface)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]",
    gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:opacity-90",
    ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]",
  };

  return (
    <button
      className={clsx(
        baseStyle,
        sizeClasses[size],
        variantClasses[variant],
        {
          "w-full": fullWidth,
          "opacity-50 cursor-not-allowed": disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        // Displays loading spinner when isLoading is true
        <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;