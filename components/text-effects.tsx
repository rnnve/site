import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TextEffectProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
}

export function Rainbow({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-rainbow ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function Neutral({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-neutral-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function Pink({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-[#F37CB3] ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function PinkNeutral({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-pinkneutral-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function WhiteGreen({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-whitegreen-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function Gray({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-gray ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function PurpleYellow({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-purpleyellow-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function OrangeYellow({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-orangy-yellow-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export interface TextColorProps extends ComponentPropsWithoutRef<"span"> {
  /** CSS color name (e.g. "Aqua", "Purple", "Green") or hex code (with or without "#"). */
  color?: string;
  /** When set, the colored text is rendered as a link. */
  href?: string;
  /** Anchor target. Only used when `href` is set. Defaults to `_blank` for external URLs. */
  target?: string;
  /** Anchor rel. Only used when `href` is set. Defaults to `noopener noreferrer` for external URLs. */
  rel?: string;
}

/**
 * Normalizes a color value. Accepts CSS color names as-is and adds a leading
 * "#" to hex codes written without one (3, 4, 6 or 8 digits).
 */
export function normalizeColor(value: string): string {
  const color = value.trim();
  if (color.startsWith("#")) return color;
  if (/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(color)) {
    return `#${color}`;
  }
  return color;
}

export function Color({ color, href, target, rel, children, className, style, ...props }: TextColorProps) {
  const colorStyle = color ? { color: normalizeColor(color), ...style } : style;

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        {...(props as ComponentPropsWithoutRef<"a">)}
        href={href}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
        className={cn("transition-colors hover:opacity-80", className)}
        style={colorStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      className={className || undefined}
      style={colorStyle}
      {...props}
    >
      {children}
    </span>
  );
}
