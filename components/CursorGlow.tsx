"use client";

import { useEffect } from "react";

/**
 * Tracks the pointer and exposes its position as CSS custom properties on the
 * document root (`--cursor-x`, `--cursor-y`, `--cursor-active`) so the
 * decorative glow in `globals.css` can follow it without React re-renders.
 *
 * Only runs for fine pointers and when reduced motion is not requested, and
 * throttles writes to one per animation frame.
 */
export function CursorGlow() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let x = 0;
    let y = 0;
    let listening = false;

    const root = document.documentElement;

    const apply = () => {
      frame = 0;
      root.style.setProperty("--cursor-x", `${x}px`);
      root.style.setProperty("--cursor-y", `${y}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (root.style.getPropertyValue("--cursor-active") !== "1") {
        root.style.setProperty("--cursor-active", "1");
      }
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const onPointerOut = (event: PointerEvent) => {
      // Ignore transitions between elements; only react when the pointer
      // actually leaves the window.
      if (event.relatedTarget) return;
      root.style.setProperty("--cursor-active", "0");
    };

    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      root.style.setProperty("--cursor-active", "0");
    };

    const start = () => {
      if (listening || !finePointer.matches || reducedMotion.matches) return;
      listening = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerOut);
    };

    start();

    const sync = () => {
      if (finePointer.matches && !reducedMotion.matches) {
        start();
      } else {
        stop();
      }
    };

    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      stop();
      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
      root.style.removeProperty("--cursor-active");
    };
  }, []);

  return null;
}
