import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="section-shell">
      <Container className="surface-card max-w-2xl p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-navy">Category Not Found</h1>
        <p className="mt-4 text-sm text-navy/70">
          The requested category could not be located. Return to the homepage and continue browsing our trade hubs.
        </p>
        <Link href="/" className="btn-primary mt-7">
          Back to Homepage
        </Link>
      </Container>
    </section>
  );
}
