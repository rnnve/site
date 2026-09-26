import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-10 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <Image
            className="dark:invert h-5 w-[100px]"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <p className="text-2xl font-medium tracking-tight text-black dark:text-zinc-50">
            This site is undergoing reworked
          </p>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Please{" "}
            <a
              href="https://haunt.gg/rnn"
              target="_blank"
              rel="noopener noreferrer"
              className="rainbow-text font-semibold bg-linear-to-r from-purple-500 via-fuchsia-400 to-yellow-300 bg-clip-text text-transparent hover:opacity-70"
            >
              visit
            </a>{" "}
            this in this time.
          </p>
        </div>
      </main>
    </div>
  );
}
