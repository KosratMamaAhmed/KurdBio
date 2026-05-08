import jwt from "@tsndr/cloudflare-worker-jwt";
import bcrypt from "bcryptjs"; 

const escapeHTML = (str: string) => str.replace(/[&<>'"]/g, 
  tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
);

const corsHeaders = {
  "Content-Type": "application/json", "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const json = (data: any, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, ...extra } });

const DEFAULT_SETTINGS = { 
  pages: { about: { text: '', links: [] }, terms: { text: '', links: [] }, works: { text: '', links: [] } },
  siteTheme: 'orange', mockup: { name: 'BioKurd', bio: '', avatar: '' }, globalButtons: [], ads: [], adminBackgrounds: [],
  socialPlatforms: [
    { id: 'facebook', name: 'فەیسبووک', iconName: 'Facebook', imageUrl: '/social/facebook.png', baseUrl: 'https://www.facebook.com/', color: '#1877F2' },
    { id: 'instagram', name: 'ئینستاگرام', iconName: 'Instagram', imageUrl: '/social/instagram.png', baseUrl: 'https://www.instagram.com/', color: '#E4405F' },
    { id: 'tiktok', name: 'تیکتۆک', iconName: 'Music', imageUrl: '/social/tiktok.png', baseUrl: 'https://www.tiktok.com/@', color: '#000000' },
    { id: 'snapchat', name: 'سناپچات', iconName: 'Ghost', imageUrl: '/social/snapchat.png', baseUrl: 'https://www.snapchat.com/add/', color: '#FFFC00' }
  ]
};

export async function onRequest(context: any) {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    
    if (method === "GET") {
      let response = await cache.match(cacheKey);
      if (response) return response; 
    }

    if (method === "GET" && path === "/api/public/settings") {
       const settingsStr = await env.KV.get("site_settings");
       const data = settingsStr ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsStr) } : DEFAULT_SETTINGS;
       const res = json(data, 200, { "Cache-Control": "public, max-age=300, s-maxage=300" });
       waitUntil(cache.put(cacheKey, res.clone()));
       return res;
    }

    // 🌟 چارەسەری کۆتایی: وەرگرتنی ئامارە کۆکراوەکان (Micro-Batching) و ناردنی بۆ D1 🌟
    if (method === "POST" && path.startsWith("/api/public/sync-stats/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           const body = await request.json();
           const visitsToAdd = parseInt(body.visits) || 0;
           const clicksToAdd = parseInt(body.clicks) || 0;
           
           if (visitsToAdd > 0 || clicksToAdd > 0) {
               let targetUserId = await env.KV.get(`slug:${slug}`);
               if (!targetUserId) targetUserId = await env.KV.get(`user:${slug}`);
               
               if (targetUserId) {
                   await env.DB.prepare(`
                       INSERT INTO stats (user_id, visits, clicks) VALUES (?, ?, ?)
                       ON CONFLICT(user_id) DO UPDATE SET 
                       visits = visits + ?, 
                       clicks = clicks + ?
                   `).bind(targetUserId, visitsToAdd, clicksToAdd, visitsToAdd, clicksToAdd).run();
               }
           }
       }
       return json({ success: true });
    }

    // ڕێگای پێشوو بۆ دڵنیایی زیاتر (ئەگەر کۆدەکەی پێشووت بەکارهێنا)
    if (method === "POST" && path.startsWith("/api/public/visit/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           let targetUserId = await env.KV.get(`slug:${slug}`);
           if (!targetUserId) targetUserId = await env.KV.get(`user:${slug}`);
           
           if (targetUserId) {
               await env.DB.prepare(`
                   INSERT INTO stats (user_id, visits, clicks) VALUES (?, 1, 0)
                   ON CONFLICT(user_id) DO UPDATE SET visits = visits + 1
               `).bind(targetUserId).run();
           }
       }
       return json({ success: true });
    }

    if (method === "POST" && path.startsWith("/api/public/click/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           let targetUserId = await env.KV.get(`slug:${slug}`);
           if (!targetUserId) targetUserId = await env.KV.get(`user:${slug}`);
           
           if (targetUserId) {
               await env.DB.prepare(`
                   INSERT INTO stats (user_id, visits, clicks) VALUES (?, 0, 1)
                   ON CONFLICT(user_id) DO UPDATE SET clicks = clicks + 1
               `).bind(targetUserId).run();
           }
       }
       return json({ success: true });
    }

    // هێنانی زانیاری پرۆفایل بۆ یوزەر یان میوان
    if (method === "GET" && path.startsWith("/api/public/profile/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       let targetUserId = await env.KV.get(`slug:${slug}`);
       let userStr = targetUserId ? await env.KV.get(`user_id:${targetUserId}`) : null;
       
       if(!userStr) return json({error: "ئەم پرۆفایلە نەدۆزرایەوە"}, 404);
       const user = JSON.parse(userStr);
       if (user.isActive === false) return json({error: "ئەم پرۆفایلە ڕاگیراوە"}, 403);

       const profileData = { 
         id: user.id, 
         displayName: escapeHTML(user.displayName || user.username), 
         bio: escapeHTML(user.bio || ""), 
         avatarUrl: user.avatarUrl, 
         links: user.links || [], 
         theme: user.theme, 
         bgImage: user.bgImage, 
         isPro: user.isPro, 
         slug: user.slug,
         nameColor: user.nameColor,        
         bioColor: user.bioColor,          
         btnTextColor: user.btnTextColor  
       };
       const res = json(profileData, 200, { "Cache-Control": "public, max-age=180, s-maxage=180" });
       waitUntil(cache.put(cacheKey, res.clone()));
       return res;
    }

    // ---------------------------------------------------------
    // پاراستنی API ـەکان بە Token بۆ داشبۆرد و ئەدمین
    // ---------------------------------------------------------
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return json({ error: "ڕێگەپێنەدراوە" }, 401);
    const token = authHeader.split(" ")[1];
    const isValidToken = await jwt.verify(token, env.JWT_SECRET);
    if (!isValidToken) return json({ error: "تۆکنەکەت هەڵەیە" }, 401);
    const { payload } = jwt.decode(token);
    const userId = payload.id;

    if (method === "GET" && path === "/api/profile") {
       if (userId === "admin") return json({ id: "admin", username: "admin", displayName: "بەڕێوەبەر", isAdmin: true, isPro: true, links: [] });
       let userStr = await env.KV.get(`user_id:${userId}`);
       if (!userStr) return json({ error: "بەکارهێنەر نەدۆزرایەوە" });
       
       const user = JSON.parse(userStr);
       
       // هێنانی ئامارەکانی تایبەت بەم یوزەرە ڕاستەوخۆ لە D1
       try {
           const stat: any = await env.DB.prepare("SELECT visits, clicks FROM stats WHERE user_id = ?").bind(userId).first();
           user.visits = stat?.visits || 0;
           user.clicks = stat?.clicks || 0;
       } catch(e) {
           user.visits = 0; user.clicks = 0;
       }

       return json(user);
    }

    if (method === "PUT" && path === "/api/profile") {
       const updates = await request.json();
       const userStr = await env.KV.get(`user_id:${userId}`);
       const user = JSON.parse(userStr);
       
       const oldUsername = user.username;
       const oldSlug = user.slug || user.username;
       
       let newUsername = updates.username ? updates.username.toLowerCase().replace(/[^a-z0-9_-]/g, '') : oldUsername;
       let newSlug = updates.slug ? updates.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '') : oldSlug;
       
       if (newUsername !== oldUsername) {
           const checkTaken = await env.KV.get(`user:${newUsername}`);
           if(checkTaken) return json({error: "ئەم یوزەرنەیمە گیراوە"}, 400);
           await env.KV.delete(`user:${oldUsername}`);
       }

       if (newSlug !== oldSlug) {
           const checkTakenSlug = await env.KV.get(`slug:${newSlug}`);
           if(checkTakenSlug && checkTakenSlug !== userId.toString()) return json({error: "ئەم ناوە گیراوە"}, 400);
           await env.KV.delete(`slug:${oldSlug}`);
           await env.KV.put(`slug:${newSlug}`, userId.toString());
       }
       
       const updatedUser = { 
           ...user, 
           username: newUsername,
           displayName: escapeHTML(updates.displayName || user.displayName), 
           bio: escapeHTML(updates.bio !== undefined ? updates.bio : user.bio), 
           slug: newSlug, 
           theme: updates.theme !== undefined ? updates.theme : user.theme, 
           bgImage: updates.bgImage !== undefined ? updates.bgImage : user.bgImage, 
           bgPos: updates.bgPos !== undefined ? updates.bgPos : user.bgPos, 
           avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : user.avatarUrl,
           avatarPos: updates.avatarPos !== undefined ? updates.avatarPos : user.avatarPos, 
           nameColor: updates.nameColor !== undefined ? updates.nameColor : user.nameColor,
           bioColor: updates.bioColor !== undefined ? updates.bioColor : user.bioColor,
           btnTextColor: updates.btnTextColor !== undefined ? updates.btnTextColor : user.btnTextColor
       };
       await env.KV.put(`user:${newUsername}`, JSON.stringify(updatedUser));
       await env.KV.put(`user_id:${userId}`, JSON.stringify(updatedUser));
       return json(updatedUser);
    }

    if (method === "POST" && path === "/api/links") {
        const newLinkInfo = await request.json();
        const userStr = await env.KV.get(`user_id:${userId}`);
        const user = JSON.parse(userStr);
        if(!user.links) user.links = [];
        user.links.push({ id: Date.now(), title: escapeHTML(newLinkInfo.title), url: newLinkInfo.url, icon: escapeHTML(newLinkInfo.icon), color: newLinkInfo.color, platformId: escapeHTML(newLinkInfo.platformId || ''), imageUrl: newLinkInfo.imageUrl || '' });
        await env.KV.put(`user:${user.username}`, JSON.stringify(user));
        await env.KV.put(`user_id:${userId}`, JSON.stringify(user));
        return json({success: true, linkId: user.links[user.links.length-1].id});
    }

    if (method === "PUT" && path.match(/^\/api\/links\/\d+$/)) {
        const linkId = parseInt(path.split("/").pop());
        const updates = await request.json();
        const userStr = await env.KV.get(`user_id:${userId}`);
        const user = JSON.parse(userStr);
        const linkIndex = user.links?.findIndex((l:any) => l.id === linkId);
        if(linkIndex > -1) {
            user.links[linkIndex] = { ...user.links[linkIndex], title: escapeHTML(updates.title), url: updates.url, icon: escapeHTML(updates.icon), color: updates.color, platformId: escapeHTML(updates.platformId || ''), imageUrl: updates.imageUrl || '' };
            await env.KV.put(`user:${user.username}`, JSON.stringify(user));
            await env.KV.put(`user_id:${userId}`, JSON.stringify(user));
        }
        return json({success: true});
    }

    if (method === "DELETE" && path.match(/^\/api\/links\/\d+$/)) {
        const linkId = parseInt(path.split("/").pop());
        const userStr = await env.KV.get(`user_id:${userId}`);
        const user = JSON.parse(userStr);
        user.links = user.links.filter((l: any) => l.id !== linkId);
        await env.KV.put(`user:${user.username}`, JSON.stringify(user));
        await env.KV.put(`user_id:${userId}`, JSON.stringify(user));
        return json({success: true});
    }

    return json({ error: "Route not found" }, 404);

  } catch (err: any) {
    return json({ error: "هەڵەی سێرڤەر: " + err.message }, 500);
  }
}