import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4",
        isCentered && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="badge-premium w-fit">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-3xl text-3xl font-bold leading-[1.12] text-navy md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-navy/72 md:text-[1.03rem]">
          {description}
        </p>
      ) : null}
      {actions}
    </div>
  );
}
