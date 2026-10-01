import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface TextEffectProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
}

export function Rainbow({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-rainbow ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function Neutral({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-neutral-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function Pink({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-[#F37CB3] ${className || ""}`} {...props}>
      {children}
    </span>
  );
}
