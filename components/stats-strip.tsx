import { getCompanyInfo, getHomepageContent } from "@/lib/site-data";
import { Container } from "@/components/ui/container";

export async function StatsStrip() {
  const [companyInfo, homepageContent] = await Promise.all([getCompanyInfo(), getHomepageContent()]);

  return (
    <section className="border-y border-navy/10 bg-white py-12">
      <Container>
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy/58">
          {homepageContent.statsSectionTitle}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companyInfo.stats.map((stat, index) => (
            <article
              key={stat.label}
              className="relative overflow-hidden rounded-card border border-border/60 bg-slate/35 p-5"
            >
              {index === 0 ? (
                <span className="absolute -right-8 -top-8 h-20 w-20 rounded-full border border-bronze/30 bg-bronze/10" />
              ) : null}
              <p className="text-3xl font-bold text-navy">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-navy/65">{stat.label}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
