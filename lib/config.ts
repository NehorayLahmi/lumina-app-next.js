
export const BACKEND_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : process.env.BACKEND_URL!;

export const SITE_URL = (
  process.env.FRONTEND_URL ?? "https://leads-project-next-js.vercel.app"
).replace(/\/$/, "");
