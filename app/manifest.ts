import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CariBuddy",
    short_name: "CariBuddy",
    description: "Cari rakan aktiviti kamu",
    start_url: "/discover",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7F77DD",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["lifestyle", "social", "sports"],
  };
}
