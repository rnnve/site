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

export function PinkNeutral({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-pinkneutral-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function WhiteGreen({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-whitegreen-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function Gray({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-gray ${className || ""}`} {...props}>
      {children}
    </span>
  );
}

export function PurpleYellow({ children, className, ...props }: TextEffectProps) {
  return (
    <span className={`text-purpleyellow-gradient ${className || ""}`} {...props}>
      {children}
    </span>
  );
}
