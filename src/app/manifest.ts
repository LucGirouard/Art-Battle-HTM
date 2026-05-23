import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Art Battle",
    short_name: "ArtBattle",
    description: "Modern 1v1 sketch battles with quick room-based matchmaking.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e8",
    theme_color: "#f7f1e8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
