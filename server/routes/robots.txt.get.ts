import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain; charset=utf-8");
  const siteUrl = useRuntimeConfig().public.siteUrl;
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", siteUrl).href}\n`;
});
