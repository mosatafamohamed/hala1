import { Hub } from "@/lib/types";

export const hubs: Hub[] = [
  {
    id: "construction-lifestyle",
    name: "Construction & Lifestyle Hub",
    navLabel: "Construction Hub",
    description:
      "Procurement architecture for landmark developments, combining structural materials, premium interiors, and controlled delivery schedules.",
    highlight: "Architecture, interiors, and finishing programs for flagship assets.",
    image: "/images/hubs/construction-hub.svg",
    href: "/category/building-materials",
    categories: [
      "building-materials",
      "decor-art",
      "luxury-furniture",
      "elevators-lifts"
    ]
  },
  {
    id: "industrial-agricultural",
    name: "Industrial & Agricultural Hub",
    navLabel: "Industrial Hub",
    description:
      "Execution-focused sourcing for industrial commodities and agricultural inputs where continuity, documentation, and timing are commercially critical.",
    highlight: "Continuity-first trade programs for critical operating sectors.",
    image: "/images/hubs/industrial-hub.svg",
    href: "/category/petroleum",
    categories: ["petroleum", "grains-feed", "fertilizers", "service-vehicles"]
  }
];
