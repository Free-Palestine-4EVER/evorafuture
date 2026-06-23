import type React from "react";

type ModelViewerAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    src?: string;
    "ios-src"?: string;
    alt?: string;
    poster?: string;
    ar?: boolean | "";
    "ar-modes"?: string;
    "ar-scale"?: string;
    "ar-placement"?: "floor" | "wall";
    "camera-controls"?: boolean | "";
    "touch-action"?: string;
    "auto-rotate"?: boolean | "";
    "auto-rotate-delay"?: string | number;
    "rotation-per-second"?: string;
    "interaction-prompt"?: string;
    "shadow-intensity"?: string | number;
    "shadow-softness"?: string | number;
    "environment-image"?: string;
    "skybox-image"?: string;
    exposure?: string | number;
    "camera-orbit"?: string;
    "min-camera-orbit"?: string;
    "max-camera-orbit"?: string;
    "field-of-view"?: string;
    "disable-zoom"?: boolean | "";
    loading?: "auto" | "lazy" | "eager";
    reveal?: "auto" | "manual";
    scale?: string;
  },
  HTMLElement
>;

// React 19 / new JSX transform reads intrinsic elements from React.JSX.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}

// Older global-namespace consumers (belt and braces).
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}

export {};
