import { PinkNeutral, Pink, WhiteGreen, PurpleYellow } from "@/components/text-effects";
import { DiscordProfile } from "@/components/DiscordProfile";
import { Spotify } from "@/components/Spotify";

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
        <hr className="my-8 border-white" />
        <div className="flex flex-col sm:flex-row gap-4">
          <DiscordProfile userId="1" className="flex-1" />
          <Spotify className="flex-1" />
        </div>
      </main>
    </div>
  );
}