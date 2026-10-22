import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Ajit Dev Projects",
    short_name: "AjitDev",
    description:
      "Explore Ajit Dev projects, Next.js applications and developer tools.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0b0f",
    theme_color: "#111827",
    icons: [
      {
        src: "/icons/pwa-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/pwa-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
