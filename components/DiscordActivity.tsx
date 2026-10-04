"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DiscordActivity {
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
}

interface DiscordActivityProps {
  userId?: string;
  className?: string;
  limit?: number;
}

const ACTIVITY_TYPES = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  4: "Custom Status",
  5: "Competing in",
} as const;

export function DiscordActivity({ userId, className, limit = 5 }: DiscordActivityProps) {
  const [activities, setActivities] = useState<DiscordActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/discord/user/${userId || "@me"}/activities`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data;

        if (!data) {
          throw new Error("No data returned");
        }

        setActivities(Array.isArray(data.activities) ? data.activities.slice(0, limit) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-white/5">
            <div className="h-10 w-10 rounded bg-zinc-800" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-zinc-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4 text-center text-zinc-400", className)}>
        <svg className="mx-auto h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="mt-2 text-sm">Failed to load activities</p>
        <p className="text-xs text-zinc-500">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn("p-4 text-center text-zinc-500", className)}>
        <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="mt-2 text-sm">No activities</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {activities.map((activity, index) => (
        <ActivityCard key={`${activity.application_id}-${index}`} activity={activity} />
      ))}
    </div>
  );
}

function ActivityCard({ activity }: { activity: DiscordActivity }) {
  const typeLabel = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES] || "Activity";
  const largeImageUrl = activity.assets?.large_image
    ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
    : null;

  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-white/5">
      {largeImageUrl && (
        <img
          src={largeImageUrl}
          alt={activity.assets?.large_text || activity.name}
          className="h-10 w-10 rounded bg-zinc-800 object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {typeLabel}
          </span>
          <span className="text-zinc-600">·</span>
          <h4 className="truncate font-medium text-zinc-100">{activity.name}</h4>
        </div>
        {(activity.details || activity.state) && (
          <p className="mt-1 truncate text-sm text-zinc-400">
            {activity.details}{activity.state && ` — ${activity.state}`}
          </p>
        )}
        {activity.timestamps?.start && (
          <p className="mt-1 text-xs text-zinc-500">
            Started {formatRelativeTime(activity.timestamps.start)}
          </p>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}