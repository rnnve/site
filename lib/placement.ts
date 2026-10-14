export type Placement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Media variant used by the `mobile:` props. Values prefixed with this apply
 * below the `lg` breakpoint — the same breakpoint where the site switches from
 * its mobile layout to the desktop one. Change this one constant to retarget
 * every `mobile:` prop.
 */
export const MOBILE_VARIANT = "max-lg";

/**
 * Each placement pins every axis explicitly (`left-auto`/`right-auto`, etc.) so
 * that a `mobile:` override can fully replace it below the breakpoint.
 */
const PLACEMENT_CLASSES: Record<Placement, string> = {
  "top-left": "fixed top-6 left-6 right-auto bottom-auto z-40 translate-x-0",
  "top-center": "fixed top-6 left-1/2 right-auto bottom-auto z-40 -translate-x-1/2",
  "top-right": "fixed top-6 right-6 left-auto bottom-auto z-40 translate-x-0",
  "bottom-left": "fixed bottom-6 left-6 right-auto top-auto z-40 translate-x-0",
  "bottom-center": "fixed bottom-6 left-1/2 right-auto top-auto z-40 -translate-x-1/2",
  "bottom-right": "fixed bottom-6 right-6 left-auto top-auto z-40 translate-x-0",
};

/**
 * Resolves a `placement` value to the fixed-position utility classes used to
 * pin a widget to a corner (or edge) of the viewport. Returns `undefined` when
 * no placement is given so the widget stays in the normal document flow.
 */
export function placementClass(placement?: Placement): string | undefined {
  if (!placement) return undefined;
  return PLACEMENT_CLASSES[placement];
}

/**
 * Prefixes every class with the mobile media variant so it overrides the
 * unprefixed value below the breakpoint (e.g. `top-6` -> `max-lg:top-6`).
 */
export function mobileVariant(classes?: string): string | undefined {
  if (!classes) return undefined;
  const prefixed = classes
    .split(/\s+/)
    .filter(Boolean)
    .map((className) => `${MOBILE_VARIANT}:${className}`)
    .join(" ");
  return prefixed || undefined;
}
