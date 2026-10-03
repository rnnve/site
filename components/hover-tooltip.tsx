"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface HoverTooltipProps {
  children?: React.ReactNode;
  content: string;
  href?: string;
  className?: string;
}

function getFaviconUrl(urlStr: string): string {
  try {
    const hasProtocol = /^https?:\/\//i.test(urlStr);
    const isRelative =
      urlStr.startsWith("/") ||
      urlStr.startsWith("./") ||
      urlStr.startsWith("#");
    if (isRelative) return "/favicon.ico";
    const fullUrl = hasProtocol ? urlStr : `https://${urlStr}`;
    const parsed = new URL(fullUrl);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`;
  } catch {
    return "";
  }
}

export function HoverTooltip({
  children,
  content,
  href,
  className = "",
}: HoverTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const faviconUrl = href ? getFaviconUrl(href) : "";

  return (
    <span className="relative inline-block">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(className)}
          style={{ cursor: "default" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {children}
        </a>
      ) : (
        <span
          ref={triggerRef}
          className={cn("relative inline-block cursor-help", className)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {children}
        </span>
      )}
      {isHovered && (
        <span
          className="absolute bottom-full left-1/2 z-50 mb-1.5 inline-flex max-w-xs -translate-x-1/2 items-center rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-zinc-50 shadow-lg whitespace-nowrap pointer-events-none duration-150 animate-in fade-in-0 zoom-in-95"
          style={{ fontSize: "0.7rem" }}
        >
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-300 no-underline transition-colors hover:text-zinc-100 pointer-events-auto"
              style={{ fontSize: "0.7rem" }}
            >
              {faviconUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={faviconUrl}
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 shrink-0 rounded-full object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              )}
              <span>{content.replace(/^https?:\/\//, "")}</span>
            </a>
          ) : (
            <span className="text-zinc-300" style={{ fontSize: "0.7rem" }}>
              {content}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export function Tooltip({
  children,
  content,
  href,
  className = "",
}: HoverTooltipProps) {
  return (
    <HoverTooltip content={content} href={href} className={className}>
      {children}
    </HoverTooltip>
  );
}
