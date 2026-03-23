import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Globe2, FileCheck2, MapPin, Mail, Phone } from "lucide-react";

import { getCompanyInfo, getHomepageContent, getHubs } from "@/lib/site-data";
import { Container } from "@/components/ui/container";
import { SocialIcon } from "@/components/social-icon";

export async function Footer() {
  const [companyInfo, hubs, homepageContent] = await Promise.all([
    getCompanyInfo(),
    getHubs(),
    getHomepageContent()
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy pb-6 pt-16 text-white">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.25fr_0.9fr_1fr]">
          <div>
            {companyInfo.logo?.url ? (
              <Image
                src={companyInfo.logo.url}
                alt={companyInfo.logo.alt ?? `${companyInfo.name} logo`}
                width={companyInfo.logo.width && companyInfo.logo.width > 0 ? companyInfo.logo.width : 160}
                height={companyInfo.logo.height && companyInfo.logo.height > 0 ? companyInfo.logo.height : 50}
                className="h-11 w-auto object-contain"
              />
            ) : (
              <p className="inline-flex rounded-full border border-bronze/50 bg-bronze/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                {companyInfo.name}
              </p>
            )}
            <h3 className="mt-4 max-w-md text-2xl font-bold leading-tight">
              Executive-grade trade partnerships built for certainty.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/76">{companyInfo.tagline}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/64">{companyInfo.executiveStatement}</p>

            <div className="mt-6 grid gap-2 text-xs text-white/75">
              <p className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-bronze" />
                Counterparty and compliance-screened execution
              </p>
              <p className="inline-flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 text-bronze" />
                Multi-market sourcing and logistics coordination
              </p>
              <p className="inline-flex items-center gap-2">
                <FileCheck2 className="h-3.5 w-3.5 text-bronze" />
                Documentation-led trade control and visibility
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">Trade Hubs</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {hubs.map((hub) => (
                <li key={hub.id}>
                  <Link href={hub.href} className="transition hover:text-white">
                    {hub.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-soft border border-white/12 bg-white/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky">Execution Standard</p>
              <p className="mt-2 text-sm text-white/75">
                Contract-led sourcing with controlled documentation and milestone visibility.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">Contact</h4>
            <div className="mt-4 space-y-3 text-sm text-white/78">
              <p className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
                <span>{companyInfo.address}</span>
              </p>
              <a href={`mailto:${companyInfo.email}`} className="inline-flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4 text-bronze" />
                {companyInfo.email}
              </a>
              <a href={`tel:${companyInfo.phone}`} className="inline-flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4 text-bronze" />
                {companyInfo.phone}
              </a>
              <a
                href={companyInfo.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-bronze" />
                WhatsApp: {companyInfo.phone}
              </a>
            </div>
            <div className="mt-6 space-y-2">
              {companyInfo.trustCues.slice(0, 2).map((cue) => (
                <p key={cue} className="text-xs leading-relaxed text-white/62">
                  {cue}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          {companyInfo.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-soft border border-white/18 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-bronze/45 hover:bg-bronze/15 hover:text-white"
            >
              <SocialIcon platform={link.label} className="mr-1.5 h-3.5 w-3.5" />
              {link.label}
            </a>
          ))}
        </div>

        <div className="premium-divider my-8" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.12em] text-white/60">
          <p>{year} 1Hala. All rights reserved.</p>
          <p>{homepageContent.footerText}</p>
        </div>

        <div className="mt-3 flex justify-end border-t border-white/10 pt-3">
          <p className="text-[11px] tracking-[0.1em] text-white/40">
            Engineered by{" "}
            <a
              href="https://www.linkedin.com/company/codefluxai/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:underline hover:underline-offset-2"
            >
              CodeFlux
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
