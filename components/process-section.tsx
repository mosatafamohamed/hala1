import { ProcessStep } from "@/lib/types";

import { ProcessStepCard } from "@/components/process-step-card";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";

type ProcessSectionProps = {
  title: string;
  description: string;
  steps: ProcessStep[];
};

export function ProcessSection({ title, description, steps }: ProcessSectionProps) {
  return (
    <section className="section-shell bg-white">
      <Container>
        <SectionHeading
          eyebrow="How We Operate"
          title={title}
          description={description}
          className="mb-11"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <ProcessStepCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
