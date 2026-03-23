import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TopBar } from "@/components/top-bar";
import { getCompanyInfo } from "@/lib/site-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const companyInfo = await getCompanyInfo();

  return {
    metadataBase: new URL("https://www.1hala.com"),
    title: {
      default: `${companyInfo.name} | Premium Global Trade Partner`,
      template: `%s | ${companyInfo.name}`
    },
    description:
      "1Hala delivers premium B2B global trade partnerships across construction, industrial, and agricultural sectors.",
    keywords: [
      "global trade",
      "B2B sourcing",
      "construction materials",
      "industrial commodities",
      "premium procurement"
    ],
    openGraph: {
      title: `${companyInfo.name} | Premium Global Trade Partner`,
      description:
        "Structured sourcing, compliance-led execution, and high-value supply chain partnerships for global B2B operations.",
      type: "website",
      locale: "en_US",
      siteName: companyInfo.name
    },
    twitter: {
      card: "summary_large_image",
      title: `${companyInfo.name} | Premium Global Trade Partner`,
      description:
        "Premium B2B global trade solutions for construction, industrial, and agricultural sectors."
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyInfo = await getCompanyInfo();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-slate text-navy antialiased`}>
        <TopBar />
        <Header companyInfo={companyInfo} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
