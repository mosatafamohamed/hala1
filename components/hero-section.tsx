import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  badge: string;
  title: string;
  description: string;
  statsLine?: string;
  trustPills?: string[];
  backgroundImage: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
  className?: string;
};

export function HeroSection({
  badge,
  title,
  description,
  statsLine,
  trustPills,
  backgroundImage,
  primaryAction,
  secondaryAction,
  children,
  className
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-white/10",
        className
      )}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="hero-overlay absolute inset-0 z-[1]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_84%_20%,rgba(168,124,81,0.28),transparent_36%),radial-gradient(circle_at_18%_86%,rgba(91,143,185,0.18),transparent_30%)]" />
      <div className="absolute -bottom-40 right-16 z-[1] h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-3xl" />
      <Container className="relative z-[2] py-24 md:py-28">
        <div className="max-w-4xl space-y-7 text-white">
          <span className="inline-flex rounded-full border border-bronze/55 bg-bronze/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {badge}
          </span>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.06] md:text-[4.2rem]">{title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/86 md:text-lg">{description}</p>
          {statsLine ? (
            <p className="text-xs uppercase tracking-[0.18em] text-white/78 md:text-sm">{statsLine}</p>
          ) : null}
          {trustPills?.length ? (
            <div className="flex flex-wrap gap-2.5">
              {trustPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/90"
                >
                  {pill}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {primaryAction ? <Button href={primaryAction.href}>{primaryAction.label}</Button> : null}
            {secondaryAction ? (
              <Button
                href={secondaryAction.href}
                variant="secondary"
                className="border-white/75 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                {secondaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
          {children ? <div className="pt-1">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
