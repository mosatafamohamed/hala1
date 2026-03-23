import Image from "next/image";

import { cn } from "@/lib/utils";

type WatermarkImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  watermarkText?: string;
};

export function WatermarkImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
  imageClassName,
  watermarkText = "1Hala Executive Trade"
}: WatermarkImageProps) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(26,48,80,0.38),rgba(26,48,80,0.08)_44%,rgba(26,48,80,0.2))]"
      />
      <div aria-hidden="true" className="wm-overlay pointer-events-none absolute inset-0" data-wm={watermarkText} />
    </div>
  );
}
