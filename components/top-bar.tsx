import { Mail, MapPin, MessageCircleMore, Phone } from "lucide-react";

import { getCompanyInfo } from "@/lib/site-data";
import { Container } from "@/components/ui/container";

export async function TopBar() {
  const companyInfo = await getCompanyInfo();

  return (
    <div className="border-b border-white/10 bg-navy py-2 text-[11px] text-white/80">
      <Container className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-3">
          <MapPin className="h-3.5 w-3.5 text-sky" />
          <span>{companyInfo.address}</span>
          <span className="hidden rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/85 lg:inline-flex">
            International Trade Desk
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href={`mailto:${companyInfo.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Mail className="h-3.5 w-3.5 text-sky" />
            {companyInfo.email}
          </a>
          <a href={`tel:${companyInfo.phone}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Phone className="h-3.5 w-3.5 text-sky" />
            {companyInfo.phone}
          </a>
          <a
            href={companyInfo.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <MessageCircleMore className="h-3.5 w-3.5 text-sky" />
            WhatsApp
          </a>
        </div>
      </Container>
    </div>
  );
}
