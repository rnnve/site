"use client";

import { STACK_CATEGORIES, StackIcon } from "./stack-icons";

export function Stack() {
  const navigate = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-zinc-300">
      {STACK_CATEGORIES.flatMap((cat) =>
        cat.items.map((item) => (
          <span
            key={item.name}
            onClick={() => navigate(item.url)}
            className="group inline-flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100 cursor-pointer"
            style={{ border: "1px solid transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = item.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <StackIcon path={item.path} color={item.color} size={14} />
            <span>{item.name}</span>
          </span>
        ))
      )}
    </span>
  );
}