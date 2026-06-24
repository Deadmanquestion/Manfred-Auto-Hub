import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: AdminButtonProps) {
  return (
    <button className={`admin-button admin-button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

