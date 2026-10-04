"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
}

export function DiscordProfile({ userId, className }: DiscordProfileProps) {
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
      <div className={cn("flex items-center gap-4 p-4", className)}>
        <div className="animate-pulse h-16 w-16 rounded-full bg-zinc-800" />
        <div className="space-y-2">
          <div className="animate-pulse h-6 w-40 bg-zinc-800 rounded" />
          <div className="animate-pulse h-4 w-28 bg-zinc-700 rounded" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={cn("flex items-center gap-4 p-4 text-zinc-400", className)}>
        <svg className="h-16 w-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
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
    <div className={cn("flex items-center gap-4 p-4", className)}>
      <div className="relative">
        <img
          src={user.avatarUrl}
          alt={`${user.displayName}'s avatar`}
          className="h-16 w-16 rounded-full ring-2 ring-white/10"
        />
        <span
          className={cn(
            "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-black",
            statusColors[user.status] || statusColors.offline
          )}
          title={user.status}
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-zinc-100">{user.displayName}</h3>
        <p className="truncate text-sm text-zinc-400">@{user.username}</p>
      </div>
    </div>
  );
}