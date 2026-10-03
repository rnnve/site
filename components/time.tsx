"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface TimeProps {
  zone?: string;
  format?: "full" | "short" | "time-only";
  showSeconds?: boolean;
  className?: string;
}

const subscribe = () => () => {};
const getClientTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimezone = () => "UTC";

export function Time({ zone, format = "full", showSeconds = false, className = "" }: TimeProps) {
  const [time, setTime] = useState<Date>(new Date());
  const detectedZone = useSyncExternalStore(subscribe, getClientTimezone, getServerTimezone);
  const timezone = zone || detectedZone;

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date, tz: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    if (showSeconds) {
      options.second = "2-digit";
    }

    if (format === "full") {
      options.weekday = "short";
      options.year = "numeric";
      options.month = "short";
      options.day = "numeric";
    } else if (format === "short") {
      options.month = "short";
      options.day = "numeric";
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const displayTime = formatTime(time, timezone || (zone || "UTC"));
  const displayZone = timezone || zone || "Local";

  return (
    <span className={`font-mono text-zinc-200 ${className}`}>
      {displayTime} <span className="text-zinc-500 text-xs ml-1">({displayZone})</span>
    </span>
  );
}

// Shorthand components for common use cases
export function TimeLocal({ format = "full", className = "" }: Omit<TimeProps, "zone">) {
  return <Time format={format} className={className} />;
}

export function TimeUTC({ format = "full", className = "" }: Omit<TimeProps, "zone">) {
  return <Time zone="UTC" format={format} className={className} />;
}