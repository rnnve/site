import { PinkNeutral, Pink, WhiteGreen, PurpleYellow } from "@/components/text-effects";
import { DiscordProfile } from "@/components/DiscordProfile";
import { Spotify } from "@/components/Spotify";
import {
  siNextdotjs,
  siAstro,
  siReact,
  siTailwindcss,
  siBun,
  siVercel,
  siTypescript,
  siPython,
} from "simple-icons";

const stacks = [
  { name: "Next.js", icon: siNextdotjs },
  { name: "Astro", icon: siAstro },
  { name: "React", icon: siReact },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "Bun", icon: siBun },
  { name: "Vercel", icon: siVercel },
  { name: "TypeScript", icon: siTypescript },
  { name: "Python", icon: siPython },
] as const;

export default function Page() {
  return (
    <div className="flex flex-1 justify-center pt-10 pb-16 px-6 sm:px-8">
      <main className="w-full max-w-3xl space-y-4 text-zinc-50 leading-7">
        <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          rinne
        </h1>
        <p>
          i&apos;m <PinkNeutral>Rinne (or as Rynne, Rynni)</PinkNeutral> a{" "}
          <Pink>self-taught developer</Pink>, i mostly work on{" "}
          <WhiteGreen>Web and Discord Bots.</WhiteGreen>
        </p>
        <p>
          i&apos;m also a <Pink>Server Manager</Pink> for my friend&apos;s server. Alongside running my own Homelab.
        </p>
        <p>
          my projects are mostly on{" "}
          <PurpleYellow>
            <a href="https://github.com/rnnve" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-50 underline underline-offset-4 transition-colors hover:text-zinc-200">
              Github
            </a>
          </PurpleYellow>{" "}
          or my{" "}
          <PurpleYellow>
            <a href="https://git.maplenan.org/rinne" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-50 underline underline-offset-4 transition-colors hover:text-zinc-200">
              Forgejo Instance
            </a>
          </PurpleYellow>
        </p>
        <p className="text-zinc-50">for stacks i mostly use these</p>
        <div className="flex flex-wrap items-center gap-3 text-zinc-400">
          {stacks.map(({ name, icon }) => (
            <span
              key={name}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-zinc-900/50 rounded-full border border-white/5"
              title={name}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d={icon.path} />
              </svg>
              {name}
            </span>
          ))}
        </div>
        <hr className="my-8 border-white" />
        <div className="flex flex-col sm:flex-row gap-4">
          <DiscordProfile userId="1" className="flex-1" />
          <Spotify className="flex-1" />
        </div>
      </main>
    </div>
  );
}