"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "ghost" | "destructive";
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, className, onClick, loading, variant = "primary", disabled, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
      }
      onClick?.(e);
    };

    const variantClasses = {
      primary: "bg-[#007AFF] text-white hover:bg-[#0066D6] active:bg-[#0055B3]",
      ghost: "bg-transparent text-[#007AFF] hover:bg-blue-50 border border-[#007AFF]",
      destructive: "bg-[#FF3B30] text-white hover:bg-[#D93025] active:bg-[#B02020]",
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        className={cn(
          "w-full py-4 px-6 rounded-2xl font-semibold text-[15px] tracking-[-0.01em]",
          "transition-all duration-150 ease-out",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Thinking...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
