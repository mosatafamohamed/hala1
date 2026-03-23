import type { Metadata } from "next";
import { Building2, Clock3, Mail, MapPin, MessageCircleMore, Phone } from "lucide-react";

import { InquiryForm } from "@/components/inquiry-form";
import { HeroSection } from "@/components/hero-section";
import { SocialIcon } from "@/components/social-icon";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { getCategories, getCompanyInfo, getContactContent } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with 1Hala for premium B2B sourcing, trade partnerships, and strategic inquiry support."
};

export default async function ContactPage() {
  const [categories, companyInfo, contactContent] = await Promise.all([
    getCategories(),
    getCompanyInfo(),
    getContactContent()
  ]);
  const interestOptions = categories.map((category) => category.name);

  return (
    <>
      <HeroSection
        badge="Contact 1Hala"
        title={contactContent.pageTitle}
        description={contactContent.subtitle}
        statsLine="Commercial Inquiries  |  Contract Support  |  International Coordination"
        backgroundImage="/images/hero/contact-hero.svg"
        trustPills={["Direct Desk Access", "Confidential Handling", "Fast Response"]}
      />

      <section className="section-shell bg-slate/70" id="inquiry">
        <Container>
          <SectionHeading
            eyebrow={contactContent.primaryCtaLabel}
            title="Direct Access to the Right Team"
            description="Choose your preferred channel or submit a complete inquiry brief through our corporate desk form."
          />

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <article className="surface-card-strong p-6">
                <h3 className="text-xl font-bold text-navy">Contact Information</h3>
                <div className="mt-5 space-y-4 text-sm text-navy/75">
                  <p className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-bronze" />
                    {contactContent.registeredAddress}
                  </p>
                  <a href={`mailto:${contactContent.email}`} className="flex items-center gap-3 hover:text-navy">
                    <Mail className="h-4 w-4 text-bronze" />
                    {contactContent.email}
                  </a>
                  <a href={`tel:${contactContent.phone}`} className="flex items-center gap-3 hover:text-navy">
                    <Phone className="h-4 w-4 text-bronze" />
                    {contactContent.phone}
                  </a>
                  <a
                    href={companyInfo.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-navy"
                  >
                    <MessageCircleMore className="h-4 w-4 text-bronze" />
                    WhatsApp: {contactContent.phone}
                  </a>
                </div>
              </article>

              <article className="surface-card-strong p-6">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-bronze" />
                  <h3 className="text-xl font-bold text-navy">Business Hours</h3>
                </div>
                <ul className="mt-5 space-y-3 text-sm text-navy/75">
                  {contactContent.businessHours.map((item) => (
                    <li key={item.day} className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-sky" />
                        {item.day}
                      </span>
                      <span>{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="surface-card-strong p-6">
                <h3 className="text-base font-bold uppercase tracking-[0.12em] text-navy/70">Official Channels</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {companyInfo.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-soft border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy/75 transition hover:border-bronze/45 hover:text-bronze"
                    >
                      <SocialIcon platform={link.label} className="mr-1.5 h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            </div>

            <article className="surface-card-strong p-6 md:p-8">
              <h3 className="text-2xl font-bold text-navy">Corporate Inquiry Form</h3>
              <p className="mt-3 text-sm text-navy/70">{contactContent.inquiryHelperText}</p>
              <InquiryForm interestOptions={interestOptions} className="mt-6" sourcePage="/contact" />
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
