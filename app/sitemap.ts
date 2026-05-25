import type { MetadataRoute } from "next";


const SITE_URL   =  (process.env.FRONTEND_URL ?? "https://leads-progect-next-js.vercel.app").replace(/\/$/, "");
 const BACKEND_URL = process.env.BACKEND_URL ?? "https://leads-progect.onrender.com";

interface PageSlug {
  city: string;
  profession: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/register`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/login`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/forgot-password`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.1 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/landing-pages`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const pages: PageSlug[] = await res.json();
      dynamicPages = pages.map(p => ({
        url:             `${SITE_URL}/${p.profession}/${p.city}`,
        lastModified:    new Date(p.updatedAt),
        changeFrequency: "weekly" as const,
        priority:        0.9,
      }));
    }
  } catch {
    // backend unreachable — sitemap returns static pages only
  }

  return [...dynamicPages, ...staticPages];
}
