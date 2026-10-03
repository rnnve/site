"use client";

import { siTypescript } from "simple-icons";
import { siReact } from "simple-icons";
import { siNextdotjs } from "simple-icons";
import { siNodedotjs } from "simple-icons";
import { siGo } from "simple-icons";
import { siRust } from "simple-icons";
import { siAstro } from "simple-icons";
import { siTailwindcss } from "simple-icons";

export interface StackItem {
  name: string;
  url: string;
  path: string;
  color: string;
}

const ELYSIA_PATH = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5";

export const STACK_CATEGORIES: { category: string; items: StackItem[] }[] = [
  {
    category: "Frontend",
    items: [
      {
        name: "TypeScript",
        url: "https://www.typescriptlang.org/",
        path: siTypescript.path,
        color: "#3178C6",
      },
      {
        name: "React",
        url: "https://react.dev/",
        path: siReact.path,
        color: "#61DAFB",
      },
      {
        name: "Next.js",
        url: "https://nextjs.org/",
        path: siNextdotjs.path,
        color: "#000000",
      },
      {
        name: "Astro",
        url: "https://astro.build/",
        path: siAstro.path,
        color: "#FF5D01",
      },
      {
        name: "Tailwind CSS",
        url: "https://tailwindcss.com/",
        path: siTailwindcss.path,
        color: "#06B6D4",
      },
    ],
  },
  {
    category: "Backend",
    items: [
      {
        name: "ElysiaJS",
        url: "https://elysiajs.com/",
        path: ELYSIA_PATH,
        color: "#D042FF",
      },
    ],
  },
];

export const STACK_ITEMS: StackItem[] = STACK_CATEGORIES.flatMap((c) => c.items);

interface StackIconProps {
  path: string;
  color: string;
  size?: number;
}

export function StackIcon({ path, color, size = 16 }: StackIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle" }}
      aria-hidden="true"
    >
      <path d={path} fill={color} />
    </svg>
  );
}