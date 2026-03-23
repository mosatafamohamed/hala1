import { BadgeCheck, SearchCheck, ShieldCheck } from "lucide-react";

import { ProcessStep } from "@/lib/types";

type ProcessStepCardProps = {
  step: ProcessStep;
  index: number;
};

const icons = [SearchCheck, ShieldCheck, BadgeCheck];

export function ProcessStepCard({ step, index }: ProcessStepCardProps) {
  const Icon = icons[index] ?? BadgeCheck;

  return (
    <article className="surface-card card-hover-lift h-full p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="inline-flex rounded-full border border-border bg-slate/45 p-3 text-navy">
          <Icon className="h-4 w-4" />
        </div>
        <span className="rounded-full border border-bronze/45 bg-bronze/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze">
          Step {index + 1}
        </span>
      </div>
      <h3 className="mb-3 text-2xl font-bold leading-tight text-navy">{step.title}</h3>
      <p className="text-sm leading-relaxed text-navy/74">{step.description}</p>
    </article>
  );
}
