import { PinkNeutral, Pink, WhiteGreen, PurpleYellow, OrangeYellow } from "@/components/text-effects";
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
  { name: "Next.js", icon: siNextdotjs, url: "https://nextjs.org" },
  { name: "Astro", icon: siAstro, url: "https://astro.build" },
  { name: "React", icon: siReact, url: "https://react.dev" },
  { name: "Tailwind CSS", icon: siTailwindcss, url: "https://tailwindcss.com" },
  { name: "Bun", icon: siBun, url: "https://bun.sh" },
  { name: "Vercel", icon: siVercel, url: "https://vercel.com" },
  { name: "TypeScript", icon: siTypescript, url: "https://typescriptlang.org" },
  { name: "Python", icon: siPython, url: "https://python.org" },
] as const;

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col px-6 sm:px-8">
      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col justify-center py-8 space-y-3 text-zinc-50 leading-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          rinne
        </h1>
        <p className="text-sm sm:text-base">
          i&apos;m <PinkNeutral>Rinne (or as Rynne, Rynni)</PinkNeutral> a{" "}
          <Pink>self-taught developer</Pink>, i mostly work on{" "}
          <WhiteGreen>Web and Discord Bots.</WhiteGreen>
        </p>
        <p className="text-sm sm:text-base">
          i&apos;m also a <Pink>Server Manager</Pink> for my friend&apos;s server. Alongside running my own Homelab.
        </p>
        <p className="text-sm sm:text-base">
          my projects are mostly on{" "}
          <PurpleYellow>
            <a href="https://github.com/rnnve" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-50 underline underline-offset-2 transition-colors hover:text-zinc-200">
              Github
            </a>
          </PurpleYellow>{" "}
          or my{" "}
          <OrangeYellow>
            <a href="https://git.maplenan.org/rinne" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-50 underline underline-offset-2 transition-colors hover:text-zinc-200">
              Forgejo Instance
            </a>
          </OrangeYellow>
        </p>
        <p className="text-sm text-zinc-400">for stacks i mostly use these</p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-zinc-400">
          {stacks.map(({ name, icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-zinc-900/50 rounded-full border border-white/5 hover:bg-zinc-800/50 transition-colors"
              title={name}
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d={icon.path} />
              </svg>
              {name}
            </a>
          ))}
        </div>
        <hr className="my-4 border-white/10" />
        <div className="flex flex-col sm:flex-row gap-3">
          <DiscordProfile userId="1" className="flex-1" />
          <Spotify className="flex-1" />
        </div>
      </main>
      <footer className="py-4 border-t border-white/10">
        <p className="text-center text-xs text-zinc-500">
          built with <span className="text-zinc-400">Next.js</span> · deployed on{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-1">
            Vercel
          </a>
        </p>
      </footer>
    </div>
  );
}