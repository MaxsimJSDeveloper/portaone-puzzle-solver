import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  isLoading?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-md shadow-indigo-900/20",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-900 border border-slate-700",
    outline: "bg-transparent text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500",
    danger: "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}