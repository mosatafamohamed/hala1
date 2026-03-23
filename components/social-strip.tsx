import { ArrowUpRight } from "lucide-react";

import { getCompanyInfo, getHomepageContent } from "@/lib/site-data";
import { Container } from "@/components/ui/container";
import { SocialIcon } from "@/components/social-icon";

export async function SocialStrip() {
  const [companyInfo, homepageContent] = await Promise.all([getCompanyInfo(), getHomepageContent()]);

  return (
    <section className="bg-navy py-10 text-white">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky">Social Connect</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{homepageContent.socialSectionTitle}</h3>
          <p className="mt-2 text-sm text-white/75">Market notes, sourcing intelligence, and portfolio releases.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {companyInfo.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-soft border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-bronze/45 hover:bg-bronze/20"
            >
              <SocialIcon platform={link.label} className="mr-2 h-4 w-4" />
              {link.label}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
