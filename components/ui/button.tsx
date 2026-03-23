import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(variant === "primary" ? "btn-primary" : "btn-secondary", className)}
    >
      {children}
    </Link>
  );
}
