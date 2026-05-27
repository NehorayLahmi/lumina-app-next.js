import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumina Leads",
    short_name: "Lumina",
    description: "מערכת ניהול לידים — בעל מקצוע",
    start_url: "/pro/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#15171c",
    theme_color: "#d7baff",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
