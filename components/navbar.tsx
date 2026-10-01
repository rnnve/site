"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/usage", label: "Usage" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-8">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 backdrop-blur-sm shadow-lg shadow-black/25 ring-1 ring-white/5 sm:h-14 sm:px-6 sm:py-2 sm:px-8">
        {/* Brand / Logo - Left */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white"
        >
          <span className="flex size-5 items-center justify-center rounded-md bg-zinc-900 font-mono text-xs text-zinc-200 sm:size-6 sm:text-sm">
            R
          </span>
        </Link>

        {/* Navigation Links - Center */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex items-center gap-1.5 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-sm px-2.5 py-1 text-xs font-medium transition-all sm:px-3 sm:py-1.5 sm:text-sm",
                      isActive
                        ? "bg-zinc-800/80 text-zinc-100 shadow-xs"
                        : "border border-transparent text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}