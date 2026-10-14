import type { CSSProperties } from "react";
import { siDiscord, siInstagram, siLastdotfm } from "simple-icons";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { mobileVariant, placementClass, type Placement } from "@/lib/placement";

export type SocialLinkSize = "sm" | "md" | "lg" | "xl";
export type SocialLinkSpacing = "none" | "sm" | "md" | "lg" | "xl";

const DEFAULT_ICON_CLASS = "size-5";
const DEFAULT_LINK_CLASS = "h-11 w-11 lg:h-10 lg:w-10";
const DEFAULT_GAP_CLASS = "gap-1.5";

const SIZE_PRESETS: Record<SocialLinkSize, { link: string; icon: string }> = {
  sm: { link: "h-9 w-9", icon: "size-4" },
  md: { link: "h-11 w-11", icon: "size-5" },
  lg: { link: "h-12 w-12", icon: "size-6" },
  xl: { link: "h-14 w-14", icon: "size-7" },
};

const SPACING_PRESETS: Record<SocialLinkSpacing, string> = {
  none: "gap-0",
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-3",
  xl: "gap-4",
};

const brandStyle = (color: string) =>
  ({ "--brand-color": color } as CSSProperties);

const SOCIALS = [
  { name: "Discord", href: "https://discord.com/users/969088519161139270", path: siDiscord.path, color: "#5865F2" },
  { name: "Instagram", href: "https://instagram.com/rynnesann", path: siInstagram.path, color: "#E4405F" },
  { name: "Last.fm", href: "https://www.last.fm/user/iqrfumi", path: siLastdotfm.path, color: "#E4141A" },
];

interface SocialLinksProps {
  className?: string;
  placement?: Placement;
  /** Icon/button size preset. Defaults to the responsive 44px (40px on `lg`). */
  size?: SocialLinkSize;
  /** Gap between icons preset. Defaults to `gap-1.5`. */
  spacing?: SocialLinkSpacing;
  /** Same as `placement`, applied only on mobile (below the `lg` breakpoint). */
  "mobile-placement"?: Placement;
  /** Same as `size`, applied only on mobile (below the `lg` breakpoint). */
  "mobile-size"?: SocialLinkSize;
  /** Same as `spacing`, applied only on mobile (below the `lg` breakpoint). */
  "mobile-spacing"?: SocialLinkSpacing;
}

export function SocialLinks({
  className,
  placement,
  size,
  spacing,
  "mobile-placement": mobilePlacement,
  "mobile-size": mobileSize,
  "mobile-spacing": mobileSpacing,
}: SocialLinksProps) {
  const sizePreset = size ? SIZE_PRESETS[size] : undefined;
  const mobileSizePreset = mobileSize ? SIZE_PRESETS[mobileSize] : undefined;

  const iconClass = cn(
    sizePreset ? sizePreset.icon : DEFAULT_ICON_CLASS,
    mobileVariant(mobileSizePreset?.icon),
  );
  const linkClass = cn(
    "social-link flex shrink-0 items-center justify-center rounded-full",
    sizePreset ? sizePreset.link : DEFAULT_LINK_CLASS,
    mobileVariant(mobileSizePreset?.link),
  );
  const gapClass = cn(
    spacing ? SPACING_PRESETS[spacing] : DEFAULT_GAP_CLASS,
    mobileVariant(mobileSpacing ? SPACING_PRESETS[mobileSpacing] : undefined),
  );

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center max-lg:justify-center",
        gapClass,
        placement
          ? placementClass(placement)
          : "lg:fixed lg:top-6 lg:right-6 lg:z-40 lg:flex-col lg:flex-nowrap lg:items-end",
        mobileVariant(placementClass(mobilePlacement)),
        className,
      )}
    >
        <a
          href="https://haunt.gg/rnn"
          target="_blank"
          rel="noreferrer"
          aria-label="Haunt"
          title="Haunt"
          className={linkClass}
        >
          <img
            src="/haunt.png"
            alt=""
            className={cn(iconClass, "rounded-md")}
          />
        </a>

        {SOCIALS.map(({ name, href, path, color }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={name}
            title={name}
            className={linkClass}
            style={brandStyle(color)}
          >
            <svg
              className={iconClass}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={path} />
            </svg>
          </a>
        ))}

        <a
          href="mailto:helo@rynni.cc"
          aria-label="Email"
          title="Email"
          className={linkClass}
          style={brandStyle("#ffffff")}
        >
          <Mail className={iconClass} aria-hidden="true" />
        </a>
      </div>
  );
}
