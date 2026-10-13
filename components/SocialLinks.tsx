import { siDiscord, siInstagram, siLastdotfm } from "simple-icons";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_CLASS = "size-4 sm:size-5";

const linkClass =
  "flex shrink-0 items-center justify-center rounded-md p-1 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

const SOCIALS = [
  { name: "Discord", href: "https://discord.com/users/969088519161139270", path: siDiscord.path, color: "#5865F2" },
  { name: "Instagram", href: "https://instagram.com/rynnesann", path: siInstagram.path, color: "#E4405F" },
  { name: "Last.fm", href: "https://www.last.fm/user/iqrfumi", path: siLastdotfm.path, color: "#E4141A" },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-end gap-1.5 -mt-10 sm:mt-0 sm:gap-2",
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
            alt="Haunt"
            className={cn(ICON_CLASS, "rounded-md")}
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
            style={{ color }}
          >
            <svg
              className={ICON_CLASS}
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
          style={{ color: "#ffffff" }}
        >
          <Mail className={ICON_CLASS} />
        </a>
      </div>
  );
}
