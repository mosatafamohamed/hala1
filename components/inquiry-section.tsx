import { CheckCircle2 } from "lucide-react";

import { InquiryForm } from "@/components/inquiry-form";
import { Container } from "@/components/ui/container";
import { getCompanyInfo } from "@/lib/site-data";

type InquirySectionProps = {
  title: string;
  description: string;
  interestOptions: string[];
  sourcePage?: string;
  productName?: string;
  categoryName?: string;
};

export async function InquirySection({
  title,
  description,
  interestOptions,
  sourcePage,
  productName,
  categoryName
}: InquirySectionProps) {
  const companyInfo = await getCompanyInfo();

  return (
    <section className="section-shell bg-navy text-white" id="inquiry">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.08fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-bronze/45 bg-bronze/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Inquiry
            </span>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
            <p className="max-w-xl text-sm leading-relaxed text-white/82 md:text-base">{description}</p>
            <div className="premium-divider max-w-sm !bg-gradient-to-r !from-white/10 !via-white/45 !to-white/10" />
            <ul className="space-y-2.5">
              {companyInfo.trustCues.slice(0, 3).map((cue) => (
                <li key={cue} className="flex items-start gap-2 text-sm text-white/82">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
                  {cue}
                </li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-[0.15em] text-white/70">Response window: within one business day</p>
          </div>

          <div className="surface-card-strong p-6 md:p-8">
            <h3 className="text-2xl font-bold text-navy">Request a tailored proposal</h3>
            <p className="mt-2 text-sm text-navy/70">
              Provide your requirements and we will return with a structured response.
            </p>
            <InquiryForm
              interestOptions={interestOptions}
              className="mt-6"
              sourcePage={sourcePage}
              productName={productName}
              categoryName={categoryName}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
