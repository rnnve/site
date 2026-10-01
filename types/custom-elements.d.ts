import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      rainbow: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      neutral: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      underline: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      Underline: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      pink: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      Pink: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      line: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      Line: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
    }
  }
}
