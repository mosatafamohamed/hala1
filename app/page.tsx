import { ArrowRight } from "lucide-react";

import { CategoryPreview } from "@/components/category-preview";
import { HomeHero } from "@/components/home-hero";
import { HubCard } from "@/components/hub-card";
import { SectionHeading } from "@/components/section-heading";
import { SocialStrip } from "@/components/social-strip";
import { StatsStrip } from "@/components/stats-strip";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getCategoriesByHub, getHubs, getHomepageContent } from "@/lib/site-data";

export default async function HomePage() {
  const [allHubs, homepageContent] = await Promise.all([getHubs(), getHomepageContent()]);
  const featuredHub = allHubs[0];
  const featuredCategories = featuredHub ? await getCategoriesByHub(featuredHub.id) : [];

  return (
    <>
      <HomeHero />

      <section className="section-shell bg-white">
        <Container>
          <SectionHeading
            eyebrow={homepageContent.hubsEyebrow}
            title={homepageContent.hubsTitle}
            description={homepageContent.hubsSubtitle}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {allHubs.map((hub) => (
              <HubCard key={hub.id} hub={hub} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href="/contact" variant="secondary">
              Discuss a Strategic Trade Program
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      <CategoryPreview
        hubName={featuredHub?.name ?? "Trade"}
        categories={featuredCategories}
        eyebrow={homepageContent.categoryPreviewEyebrow}
        title={homepageContent.categoryPreviewTitle}
        description={homepageContent.categoryPreviewSubtitle}
      />
      <StatsStrip />
      <SocialStrip />
    </>
  );
}
