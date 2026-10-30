// Suratlarni D1 bazasidan berish: /_blob/<id>
export async function onRequestGet({ params, env }) {
  const id = String(params.id || "");
  if (!/^[a-f0-9]{32}$/.test(id) || !env.DB) return new Response("Not found", { status: 404 });
  let row = null;
  try { row = await env.DB.prepare("SELECT type, b64 FROM photos WHERE id = ?").bind(id).first(); } catch (e) { row = null; }
  if (!row) return new Response("Not found", { status: 404 });
  const bin = atob(row.b64), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Response(u, { headers: { "content-type": row.type, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
}
