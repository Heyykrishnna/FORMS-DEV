/// <reference types="vite/client" />

declare module '@paper-design/shaders-react' {
  export const Dithering: React.FC<{
    colorBack?: string;
    colorFront?: string;
    shape?: string;
    type?: string;
    speed?: number;
    className?: string;
    minPixelRatio?: number;
  }>;
}
