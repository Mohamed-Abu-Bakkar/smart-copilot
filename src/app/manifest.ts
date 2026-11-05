import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Smart Copilot",
    short_name: "Smart Copilot",
    description: "Your AI business copilot for everyday business decisions, schemes and documents.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/images/business-assistant-illustration.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
