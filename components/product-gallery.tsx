"use client";

import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { WatermarkImage } from "@/components/watermark-image";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id?: string;
  url: string;
  alt?: string;
  isHero?: boolean;
};

type ProductGalleryProps = {
  title: string;
  images: GalleryImage[];
};

export function ProductGallery({ title, images }: ProductGalleryProps) {
  const preparedImages = useMemo(
    () => (images.length > 0 ? images : [{ url: "/images/products/building-materials.svg", alt: title }]),
    [images, title]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % preparedImages.length);
    setZoomLevel(1);
  }, [preparedImages.length]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + preparedImages.length) % preparedImages.length);
    setZoomLevel(1);
  }, [preparedImages.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        setZoomLevel(1);
      }
      if (event.key === "ArrowRight") {
        next();
      }
      if (event.key === "ArrowLeft") {
        prev();
      }
    };

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [isLightboxOpen, next, prev]);

  const active = preparedImages[activeIndex];

  return (
    <>
      <section className="surface-card overflow-hidden">
        <button
          type="button"
          className="group relative block aspect-[5/3] w-full overflow-hidden"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Open product image gallery"
        >
          <WatermarkImage
            src={active.url}
            alt={active.alt ?? title}
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            imageClassName="transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/30 bg-navy/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            <Search className="h-3.5 w-3.5" />
            Expand
          </span>
        </button>

        <div className="grid grid-cols-4 gap-2 p-3 md:grid-cols-6">
          {preparedImages.map((image, index) => (
            <button
              key={image.id ?? `${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-soft border border-border/70 transition",
                index === activeIndex ? "ring-2 ring-bronze/60" : "hover:border-navy/35"
              )}
            >
              <WatermarkImage
                src={image.url}
                alt={image.alt ?? title}
                sizes="180px"
                imageClassName="transition duration-300 hover:scale-105"
                watermarkText="1Hala"
              />
            </button>
          ))}
        </div>
      </section>

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4">
          <button
            type="button"
            onClick={() => {
              setIsLightboxOpen(false);
              setZoomLevel(1);
            }}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="w-full max-w-6xl space-y-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/20">
              <div
                className="h-full w-full origin-center transition duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={() => setZoomLevel((prevZoom) => (prevZoom >= 2.25 ? 1 : prevZoom + 0.25))}
              >
                <WatermarkImage
                  src={active.url}
                  alt={active.alt ?? title}
                  sizes="100vw"
                  priority
                  watermarkText="1Hala Executive Trade"
                />
              </div>
              <p className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                Click image to zoom ({zoomLevel.toFixed(2)}x)
              </p>
            </div>
            <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 overflow-x-auto pb-1">
              {preparedImages.map((image, index) => (
                <button
                  key={`lightbox-${image.id ?? index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-soft border border-white/25",
                    index === activeIndex && "ring-2 ring-bronze/70"
                  )}
                >
                  <WatermarkImage
                    src={image.url}
                    alt={image.alt ?? title}
                    sizes="160px"
                    watermarkText="1Hala"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
