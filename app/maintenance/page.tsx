import Image from "next/image";
import { Mail, MessageCircleMore, Phone, RefreshCcw } from "lucide-react";

import { Container } from "@/components/ui/container";
import { CMS_PUBLIC_REVALIDATE_SECONDS } from "@/lib/cms/revalidation";
import { getCompanyInfo } from "@/lib/site-data";

export const revalidate = CMS_PUBLIC_REVALIDATE_SECONDS;

export default async function MaintenancePage() {
  const companyInfo = await getCompanyInfo();
  const logo = companyInfo.logo;
  const logoWidth = logo?.width && logo.width > 0 ? logo.width : 180;
  const logoHeight = logo?.height && logo.height > 0 ? logo.height : 56;
  const hasContactInfo = Boolean(companyInfo.email || companyInfo.phone || companyInfo.whatsapp?.href);

  return (
    <section className="section-shell relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(91,143,185,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,124,81,0.16),transparent_28%)]" />
      <Container>
        <div className="surface-card-strong relative overflow-hidden px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky via-bronze to-sky" />

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="badge-premium">Temporary Maintenance Mode</div>

              <div className="mt-6">
                {logo?.url ? (
                  <Image
                    src={logo.url}
                    alt={logo.alt ?? `${companyInfo.name} logo`}
                    width={logoWidth}
                    height={logoHeight}
                    className="h-14 w-auto object-contain"
                    priority
                  />
                ) : (
                  <div className="inline-flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-soft border border-navy/20 bg-navy text-lg font-bold text-white">
                      1
                    </span>
                    <div>
                      <p className="font-heading text-2xl font-bold text-navy">{companyInfo.name}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
                        Executive Trade
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-tight text-navy sm:text-5xl">
                Website Under Development
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-navy/72 sm:text-lg">
                We are currently updating our products and business information to better reflect our latest
                offerings and company details. Thank you for your patience while we complete these updates.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="meta-chip">Brand Refresh</span>
                <span className="meta-chip">Product Updates</span>
                <span className="meta-chip">Business Information Review</span>
              </div>
            </div>

            <aside className="surface-card bg-navy px-6 py-7 text-white shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10">
                <RefreshCcw className="h-5 w-5 text-sky" />
              </div>

              <h2 className="mt-5 text-2xl font-bold">We&apos;ll be back shortly</h2>
              <p className="mt-3 text-sm leading-7 text-white/72">
                The team is refreshing site content and fine-tuning key business information to keep everything clear,
                accurate, and current.
              </p>

              {hasContactInfo ? (
                <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  {companyInfo.email ? (
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="flex items-center gap-3 rounded-soft border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/82 transition hover:bg-white/10"
                    >
                      <Mail className="h-4 w-4 text-sky" />
                      <span>{companyInfo.email}</span>
                    </a>
                  ) : null}

                  {companyInfo.phone ? (
                    <a
                      href={`tel:${companyInfo.phone}`}
                      className="flex items-center gap-3 rounded-soft border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/82 transition hover:bg-white/10"
                    >
                      <Phone className="h-4 w-4 text-sky" />
                      <span>{companyInfo.phone}</span>
                    </a>
                  ) : null}

                  {companyInfo.whatsapp?.href ? (
                    <a
                      href={companyInfo.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-soft border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/82 transition hover:bg-white/10"
                    >
                      <MessageCircleMore className="h-4 w-4 text-sky" />
                      <span>{companyInfo.whatsapp.label ?? "WhatsApp"}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}

              {companyInfo.whatsapp?.href ? (
                <div className="mt-6 border-t border-white/10 pt-6">
                  <a
                    href={companyInfo.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full border-white/25 bg-white text-navy hover:bg-white/90"
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
