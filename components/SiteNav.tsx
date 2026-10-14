"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "home", Icon: Home },
  { href: "/usage", label: "usage", Icon: BookOpen },
] as const;

// Geometry shared with the classes below: `size-9` items laid out with `gap-0.5`
// and `p-0.5`. Used to slide the active indicator between items. Keep in sync
// with those classes if they change.
const ITEM_PX = 36; // size-9
const GAP_PX = 2; // gap-0.5
const STRIDE_PX = ITEM_PX + GAP_PX;

/**
 * Floating primary navigation styled like a (restrained) "dynamic island":
 * a compact translucent capsule pinned to the top of the viewport. It sits in
 * the document flow (sticky) so it never overlaps page content, and it
 * deliberately uses a moderate corner radius rather than a full pill.
 *
 * Icon-only, so each link carries an `aria-label` (and `title` for a tooltip).
 * The active state is shown by a single pill that slides between icons when the
 * route changes.
 */
export function SiteNav() {
  const pathname = usePathname();
  const activeIndex = links.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href),
  );

  return (
    <header className="pointer-events-none sticky top-0 z-50 flex justify-center px-4 pt-3">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative flex items-center gap-0.5 rounded-xl border border-white/10 bg-black/70 p-0.5 shadow-lg shadow-black/50 backdrop-blur-xl"
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 size-9 rounded-lg bg-white/10",
            "transition duration-300 ease-out motion-reduce:transition-none",
            activeIndex < 0 && "opacity-0",
          )}
          style={{
            transform: `translateX(${Math.max(activeIndex, 0) * STRIDE_PX}px)`,
          }}
        />
        {links.map(({ href, label, Icon }, index) => {
          const active = index === activeIndex;

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative z-10 inline-flex size-9 items-center justify-center rounded-lg transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink",
                active
                  ? "text-zinc-50"
                  : "text-zinc-400 hover:bg-white/5 hover:text-pink-hover",
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-transform duration-300 ease-out motion-reduce:transition-none",
                  active && "scale-110",
                )}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
