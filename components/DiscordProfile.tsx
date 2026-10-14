"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { placementClass, mobileVariant, type Placement } from "@/lib/placement";

interface DiscordUser {
  displayName: string;
  username: string;
  avatarUrl: string;
  status: string;
  accentColor: string | null;
}

interface DiscordProfileProps {
  userId?: string;
  className?: string;
  compact?: boolean;
  placement?: Placement;
  /** Same as `placement`, applied only on mobile (below the `lg` breakpoint). */
  "mobile-placement"?: Placement;
}

export function DiscordProfile({ userId, className, compact, placement, "mobile-placement": mobilePlacement }: DiscordProfileProps) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/discord/user/${userId || "@me"}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data;

        if (!data) {
          throw new Error("No data returned");
        }

        setUser({
          displayName: data.displayName || data.globalName || data.username,
          username: data.username,
          avatarUrl: data.avatar || `https://cdn.discordapp.com/embed/avatars/${(Number(data.discriminator) || 0) % 5}.png`,
          status: data.status || "offline",
          accentColor: data.accentColor,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className={cn("max-lg:mx-auto max-lg:max-w-full flex items-center gap-4 p-4", compact && "gap-2 p-0", placementClass(placement), mobileVariant(placementClass(mobilePlacement)), className)}>
        <div className={cn("animate-pulse h-16 w-16 rounded-full bg-zinc-800", compact && "h-8 w-8")} />
        <div className={cn("space-y-2", compact && "hidden")}>
          <div className="animate-pulse h-6 w-40 bg-zinc-800 rounded" />
          <div className="animate-pulse h-4 w-28 bg-zinc-700 rounded" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={cn("max-lg:mx-auto max-lg:max-w-full flex items-center gap-4 p-4 text-zinc-400", compact && "gap-2 p-0", placementClass(placement), mobileVariant(placementClass(mobilePlacement)), className)}>
        <svg className={cn("h-16 w-16 text-zinc-600", compact && "h-8 w-8")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className={cn("", compact && "hidden")}>
          <p className="font-medium">Failed to load profile</p>
          <p className="text-sm">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-zinc-500",
  };

  return (
    <div className={cn("max-lg:mx-auto max-lg:max-w-full flex items-center gap-4 p-4", compact && "gap-2 p-0", placementClass(placement), mobileVariant(placementClass(mobilePlacement)), className)}>
      <div className="relative">
        <img
          src={user.avatarUrl}
          alt={`${user.displayName}'s avatar`}
          className={cn("h-16 w-16 rounded-full ring-2 ring-white/10", compact && "h-8 w-8")}
        />
        <span
          className={cn(
            "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-black",
            compact && "h-2.5 w-2.5",
            statusColors[user.status] || statusColors.offline
          )}
          title={user.status}
        />
      </div>
      <div className="min-w-0">
        <h3 className={cn("truncate font-semibold text-zinc-100", compact && "hidden")}>{user.displayName}</h3>
        <p className={cn("truncate text-sm text-zinc-400", compact && "text-xs")}>@{user.username}</p>
      </div>
    </div>
  );
}