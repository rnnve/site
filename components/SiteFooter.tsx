"use client";

import { useEffect, useState } from "react";
import { PinkNeutral } from "@/components/text-effects";

export default function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();
  const [commits, setCommits] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCommits() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/rnnve/site/commits?per_page=1",
          {
            headers: { Accept: "application/vnd.github+json" },
            signal:
              typeof AbortSignal !== "undefined" &&
              typeof AbortSignal.timeout === "function"
                ? AbortSignal.timeout(4000)
                : undefined,
          },
        );
        if (!response.ok) return;
        const last = response.headers
          .get("link")
          ?.match(/page=(\d+)>; rel="last"/)?.[1];
        if (last) setCommits(Number(last));
      } catch {
        // ignore
      }
    }
    fetchCommits();
  }, []);

  return (
    <footer
      className={`flex min-w-0 flex-row flex-wrap items-center justify-center gap-1 pt-3 pb-2 text-xs text-outline ${className || "mt-auto"}`}
    >
      <div className="flex min-w-0 shrink-0 flex-col items-center">
        <p className="py-1">
          <PinkNeutral>© {year} Rinne</PinkNeutral>
        </p>
        <a
          href="https://github.com/rnnve/site"
          target="_blank"
          rel="noreferrer"
          className="text-blush py-1"
        >
          @rnnve/site{commits !== null && ` # ${commits} commits`}
        </a>
      </div>
    </footer>
  );
}
