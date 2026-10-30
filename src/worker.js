// Kirish nuqtasi: /api/* va /_blob/* — server, qolgani — public/ papkadagi statik fayllar.
import { onRequest as api } from "./api.js";
import { onRequestGet as blob } from "./blob.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      const path = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
      return api({ request, env, params: { path }, waitUntil: ctx.waitUntil.bind(ctx) });
    }
    if (url.pathname.startsWith("/_blob/")) {
      if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
      return blob({ request, env, params: { id: url.pathname.slice(7) } });
    }
    return env.ASSETS.fetch(request);
  }
};
