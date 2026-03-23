import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircleMore,
  Send,
  type LucideIcon
} from "lucide-react";
import { type ComponentType } from "react";

type SocialIconProps = {
  platform: string;
  className?: string;
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 3.6c.7 2.2 2.2 3.4 4.4 3.8v2.8a8 8 0 0 1-4.4-1.4v5.8a5.8 5.8 0 1 1-5.8-5.8c.4 0 .8 0 1.2.1v2.9a3 3 0 1 0 1.8 2.8V3.6H14z"
        fill="currentColor"
      />
    </svg>
  );
}

const iconMap: Record<string, LucideIcon | ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: TikTokIcon,
  whatsapp: MessageCircleMore,
  telegram: Send
};

export function SocialIcon({ platform, className }: SocialIconProps) {
  const key = platform.toLowerCase();
  const Icon = iconMap[key] ?? MessageCircleMore;

  return <Icon className={className} />;
}
