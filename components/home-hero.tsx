import { ArrowRight, MessageCircleMore } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCompanyInfo, getHomepageContent } from "@/lib/site-data";

function AbstractTradeComposition() {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-xl border border-border/70 bg-[linear-gradient(160deg,#ffffff_0%,#f3f7fb_100%)] p-5 shadow-soft md:h-[420px] md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,124,81,0.16),transparent_36%),radial-gradient(circle_at_20%_70%,rgba(91,143,185,0.13),transparent_42%)]" />

      <div className="relative h-full">
        <div className="absolute left-4 top-4 h-[86%] w-px bg-gradient-to-b from-transparent via-navy/22 to-transparent" />
        <div className="absolute left-0 right-0 top-20 h-px bg-gradient-to-r from-transparent via-navy/18 to-transparent" />
        <div className="absolute left-0 right-0 top-40 h-px bg-gradient-to-r from-transparent via-navy/12 to-transparent" />

        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-navy/16 bg-navy px-5 py-5 text-white md:bottom-8 md:left-10 md:right-10 md:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72">Structured Trade Operations</p>
          <p className="mt-2 text-base font-semibold leading-snug md:text-lg">
            Procurement, execution, and fulfillment coordinated in one governed flow.
          </p>
        </div>

        <div className="absolute right-10 top-10 h-20 w-20 rounded-full border border-bronze/45 bg-bronze/20 md:h-24 md:w-24" />
        <div className="absolute right-16 top-[4.6rem] h-28 w-28 rounded-full border border-sky/25 bg-sky/12 md:right-20 md:top-24 md:h-36 md:w-36" />

        <div className="absolute left-7 top-10 w-[min(72%,16.5rem)] rounded-lg border border-border/80 bg-white/96 p-4 md:left-12 md:top-16 md:w-64">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy/64">Execution and Compliance</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-navy/92">
            Counterparty vetting, document control, and milestone governance.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function HomeHero() {
  const [companyInfo, homepageContent] = await Promise.all([getCompanyInfo(), getHomepageContent()]);

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(165deg,#FFFFFF_0%,#F7FAFD_60%,#EDF3F8_100%)]">
      <Container className="grid gap-10 py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="max-w-xl">
          <span className="badge-premium">{homepageContent.heroBadge}</span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.06] text-navy md:text-6xl">
            {homepageContent.heroTitle}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-navy/74 md:text-lg">{homepageContent.heroSubtitle}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-navy/62">{homepageContent.heroMetricsLine}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={homepageContent.heroPrimaryCtaLink}>{homepageContent.heroPrimaryCtaLabel}</Button>
            <Button href={homepageContent.heroSecondaryCtaLink} variant="secondary">
              {homepageContent.heroSecondaryCtaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {homepageContent.heroTrustChips.map((chip) => (
              <span key={chip} className="meta-chip border-border/90 bg-white/95 normal-case tracking-normal">
                {chip}
              </span>
            ))}
            <a
              href={companyInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-border/90 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/70 transition hover:border-bronze/40 hover:text-bronze"
            >
              <MessageCircleMore className="mr-1 h-3.5 w-3.5" />
              WhatsApp Desk
            </a>
          </div>
        </div>

        <AbstractTradeComposition />
      </Container>
    </section>
  );
}
