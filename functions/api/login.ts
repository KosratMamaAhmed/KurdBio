import bcrypt from "bcryptjs";
import jwt from "@tsndr/cloudflare-worker-jwt";

const corsHeaders = {
  "Content-Type": "application/json", "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
};

const json = (data: any, status = 200) => new Response(JSON.stringify(data), { status, headers: corsHeaders });

export async function onRequest(context: any) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "ڕێگەپێنەدراوە" }, 405);

  try {
    const { identifier, password } = await request.json();
    if (!identifier || !password) return json({ error: "زانیارییەکان ناتەواون" }, 400);
    
    const adminUsername = env.ADMIN_USERNAME || "admin";
    
    if (identifier === adminUsername) {
      if (password === (env.ADMIN_PASSWORD || "admin123")) {
        const token = await jwt.sign({ id: "admin", role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 }, env.JWT_SECRET);
        return json({ token, user: { id: "admin", username: adminUsername, isAdmin: true, isPro: true } });
      }
      return json({ error: "تێپەڕەوشەی بەڕێوەبەر هەڵەیە" }, 401);
    }

    const normalizedId = identifier.toLowerCase().trim();
    let userStr = await env.KV.get(`user:${normalizedId}`); 
    
    if (!userStr && normalizedId.includes('@')) {
       const idFromEmail = await env.KV.get(`email:${normalizedId}`);
       if (idFromEmail) userStr = await env.KV.get(`user_id:${idFromEmail}`);
    }

    if (!userStr && !normalizedId.includes('@')) {
       const idFromPhone = await env.KV.get(`phone:${normalizedId}`);
       if (idFromPhone) userStr = await env.KV.get(`user_id:${idFromPhone}`);
    }

    if (!userStr) return json({ error: "ناو، ئیمێڵ، مۆبایل یان تێپەڕەوشە هەڵەیە" }, 401);
    const user = JSON.parse(userStr);

    const now = Date.now();
    if (user.lockUntil && user.lockUntil > now) {
        const minutesLeft = Math.ceil((user.lockUntil - now) / 60000);
        return json({ error: `هەژمارەکەت قوفڵ دراوە بۆ پاراستن. دوای ${minutesLeft} خولەک هەوڵبدەرەوە.` }, 429);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        if (user.failedAttempts >= 5) user.lockUntil = now + (15 * 60 * 1000);
        await env.KV.put(`user_id:${user.id}`, JSON.stringify(user));
        await env.KV.put(`user:${user.username}`, JSON.stringify(user));
        return json({ error: "ناو، ئیمێڵ، مۆبایل یان تێپەڕەوشە هەڵەیە" }, 401);
    }

    if (user.failedAttempts > 0 || user.lockUntil) {
        user.failedAttempts = 0; 
        user.lockUntil = null;
        await env.KV.put(`user_id:${user.id}`, JSON.stringify(user));
        await env.KV.put(`user:${user.username}`, JSON.stringify(user));
    }

    if (user.isActive === false) return json({ error: "هەژمارەکەت ڕاگیراوە لەلایەن بەڕێوەبەرەوە" }, 403);

    const token = await jwt.sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + (7 * 86400) }, env.JWT_SECRET);
    return json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin === 1 || user.isAdmin === true, isPro: user.isPro } });
  } catch (err: any) {
    return json({ error: "هەڵەی سێرڤەر" }, 500);
  }
}