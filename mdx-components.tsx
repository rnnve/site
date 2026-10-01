import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Time } from "@/components/time";
import { HoverTooltip } from "@/components/hover-tooltip";

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: (props: ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="mt-8 mb-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl"
        {...props}
      />
    ),
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-6 mb-3 text-2xl font-semibold tracking-tight text-zinc-50 border-b border-zinc-800 pb-2"
        {...props}
      />
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className="mt-5 mb-2 text-xl font-semibold text-zinc-100"
        {...props}
      />
    ),
    h4: (props: ComponentPropsWithoutRef<"h4">) => (
      <h4
        className="mt-4 mb-2 text-lg font-medium text-zinc-200"
        {...props}
      />
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
      <p className="my-4 leading-7 text-zinc-300" {...props} />
    ),
    a: (props: ComponentPropsWithoutRef<"a">) => (
      <a
        className="font-medium text-zinc-50 underline underline-offset-4 transition-colors hover:text-zinc-200"
        {...props}
      />
    ),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
      <ul className="my-4 ml-6 list-disc space-y-2 text-zinc-300" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<"ol">) => (
      <ol className="my-4 ml-6 list-decimal space-y-2 text-zinc-300" {...props} />
    ),
    li: (props: ComponentPropsWithoutRef<"li">) => (
      <li className="leading-7" {...props} />
    ),
    blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="my-6 border-l-2 border-zinc-700 pl-6 italic text-zinc-400"
        {...props}
      />
    ),
    code: (props: ComponentPropsWithoutRef<"code">) => (
      <code
        className="relative rounded bg-white/[.08] px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200"
        {...props}
      />
    ),
    pre: (props: ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="my-6 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 font-mono text-sm text-zinc-200"
        {...props}
      />
    ),
    hr: (props: ComponentPropsWithoutRef<"hr">) => (
      <hr className="my-8 border-white" {...props} />
    ),
    table: (props: ComponentPropsWithoutRef<"table">) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full text-left text-sm text-zinc-300" {...props} />
      </div>
    ),
    th: (props: ComponentPropsWithoutRef<"th">) => (
      <th
        className="border-b border-zinc-700 p-2 font-semibold text-zinc-100"
        {...props}
      />
    ),
    td: (props: ComponentPropsWithoutRef<"td">) => (
      <td className="border-b border-zinc-800 p-2" {...props} />
    ),
    rainbow: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`text-rainbow font-semibold ${className || ""}`}
        {...props}
      />
    ),
    Rainbow: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`text-rainbow font-semibold ${className || ""}`}
        {...props}
      />
    ),
    neutral: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`text-neutral-gradient font-semibold ${className || ""}`}
        {...props}
      />
    ),
    Neutral: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`text-neutral-gradient font-semibold ${className || ""}`}
        {...props}
      />
    ),
    underline: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`underline underline-offset-4 decoration-2 decoration-zinc-50 ${className || ""}`}
        {...props}
      />
    ),
    Underline: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`underline underline-offset-4 decoration-2 decoration-zinc-50 ${className || ""}`}
        {...props}
      />
    ),
    pink: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`text-[#F37CB3] font-semibold ${className || ""}`}
        {...props}
      />
    ),
    Pink: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
      <span
        className={`text-[#F37CB3] font-semibold ${className || ""}`}
        {...props}
      />
    ),
    line: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
      <hr
        className={`my-8 border-white ${className || ""}`}
        {...props}
      />
    ),
    Line: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
      <hr
        className={`my-8 border-white ${className || ""}`}
        {...props}
      />
    ),
    Time: ({ zone, format = "full", showSeconds = false, className = "", ...props }: ComponentPropsWithoutRef<"span"> & { zone?: string; format?: "full" | "short" | "time-only"; showSeconds?: boolean }) => (
      <Time zone={zone} format={format} showSeconds={showSeconds} className={className} {...props} />
    ),
    HoverTooltip: ({ content, href, className = "", children, ...props }: ComponentPropsWithoutRef<"span"> & { content: string; href?: string; children?: React.ReactNode }) => (
      <HoverTooltip content={content} href={href} className={className} {...props}>{children}</HoverTooltip>
    ),
    wrapper: ({ children }: ComponentPropsWithoutRef<"div">) => (
      <div className="flex flex-1 justify-start pt-10 pb-16 px-6 sm:px-8">
        <main className="w-full max-w-3xl">{children}</main>
      </div>
    ),
    ...components,
  };
}
