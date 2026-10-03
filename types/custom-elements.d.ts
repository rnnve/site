import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      rainbow: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      neutral: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      pinkneutral: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      PinkNeutral: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      whitegreen: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      WhiteGreen: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      gray: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      Gray: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      purpleyellow: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      PurpleYellow: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      underline: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      Underline: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      pink: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      Pink: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      line: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      Line: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
    }
  }
}
