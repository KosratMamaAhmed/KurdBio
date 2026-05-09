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

// 🌟 سیستەمی زیرەک بۆ تۆمارکردنی ئامار (ئەگەر D1 کار نەکات، دەچێتە ناو KV) 🌟
async function incrementStat(env: any, userId: string, type: 'visit' | 'click') {
  let isD1Success = false;
  
  try {
      if (env.DB) {
          await env.DB.prepare(`CREATE TABLE IF NOT EXISTS stats (user_id TEXT PRIMARY KEY, visits INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0)`).run();
          if (type === 'visit') {
              await env.DB.prepare(`INSERT INTO stats (user_id, visits, clicks) VALUES (?, 1, 0) ON CONFLICT(user_id) DO UPDATE SET visits = visits + 1`).bind(userId).run();
          } else {
              await env.DB.prepare(`INSERT INTO stats (user_id, visits, clicks) VALUES (?, 0, 1) ON CONFLICT(user_id) DO UPDATE SET clicks = clicks + 1`).bind(userId).run();
          }
          isD1Success = true;
      }
  } catch (e) { console.error("D1 Error:", e); }

  // ئەگەر D1 شکستی هێنا، ئەوا ئامارەکە لەناو KV پاشەکەوت دەکات! بەمەش هەرگیز ئامار نابێتە سفڕ!
  if (!isD1Success) {
      try {
          let kvStats = await env.KV.get(`stats_fallback:${userId}`, "json");
          if (!kvStats) kvStats = { visits: 0, clicks: 0 };
          if (type === 'visit') (kvStats as any).visits += 1;
          else (kvStats as any).clicks += 1;
          await env.KV.put(`stats_fallback:${userId}`, JSON.stringify(kvStats));
      } catch (e) { console.error("KV Stat Error:", e); }
  }
}

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
      if (response && !path.includes('/api/admin') && !path.includes('/api/profile')) return response; 
    }

    if (method === "GET" && path === "/api/public/settings") {
       const settingsStr = await env.KV.get("site_settings");
       const data = settingsStr ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsStr) } : DEFAULT_SETTINGS;
       return json(data, 200, { "Cache-Control": "public, max-age=60, s-maxage=60" });
    }

    // 🌟 وەرگرتنی ڕیکوێستی سەردان 🌟
    if (method === "POST" && path.startsWith("/api/public/v/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           let targetUserId = await env.KV.get(`slug:${slug}`);
           if (!targetUserId) {
               const userStr = await env.KV.get(`user:${slug}`);
               if (userStr) targetUserId = JSON.parse(userStr).id;
           }
           if (targetUserId) await incrementStat(env, targetUserId.toString(), 'visit');
       }
       return json({ success: true });
    }

    // 🌟 وەرگرتنی ڕیکوێستی کلیک 🌟
    if (method === "POST" && path.startsWith("/api/public/c/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           let targetUserId = await env.KV.get(`slug:${slug}`);
           if (!targetUserId) {
               const userStr = await env.KV.get(`user:${slug}`);
               if (userStr) targetUserId = JSON.parse(userStr).id;
           }
           if (targetUserId) await incrementStat(env, targetUserId.toString(), 'click');
       }
       return json({ success: true });
    }

    if (method === "POST" && (path === "/api/auth/login" || path === "/api/login")) {
       const { identifier, password } = await request.json();
       if (!identifier || !password) return json({ error: "زانیارییەکان ناتەواون" }, 400);

       const adminUsername = env.ADMIN_USERNAME || "admin";
       if (identifier === adminUsername || identifier.toLowerCase() === adminUsername.toLowerCase()) {
           if (password === (env.ADMIN_PASSWORD || "admin123")) {
               const token = await jwt.sign({ id: "admin", role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 }, env.JWT_SECRET);
               return json({ success: true, token, user: { id: "admin", username: adminUsername, isAdmin: true, isPro: true } });
           }
           return json({ error: "تێپەڕەوشەی بەڕێوەبەر هەڵەیە" }, 401);
       }

       const normalizedId = identifier.toLowerCase().trim();
       let userStr = await env.KV.get(`user:${normalizedId}`); 
       if (!userStr && normalizedId.includes('@')) {
          const idFromEmail = await env.KV.get(`email:${normalizedId}`);
          if (idFromEmail) userStr = await env.KV.get(`user_id:${idFromEmail}`);
       }
       if (!userStr && /^\d+$/.test(normalizedId)) {
          const idFromPhone = await env.KV.get(`phone:${normalizedId}`);
          if (idFromPhone) userStr = await env.KV.get(`user_id:${idFromPhone}`);
       }

       if (!userStr) return json({ error: "ناو، ئیمێڵ، مۆبایل یان تێپەڕەوشە هەڵەیە" }, 401);
       let user = JSON.parse(userStr);
       if (user.isActive === false) return json({ error: "هەژمارەکەت ڕاگیراوە" }, 403);
       const isValid = await bcrypt.compare(password, user.password);
       if (!isValid) return json({ error: "ناو، ئیمێڵ، مۆبایل یان تێپەڕەوشە هەڵەیە" }, 401);

       const token = await jwt.sign({ id: user.id, username: user.username, role: user.isAdmin ? "admin" : "user" }, env.JWT_SECRET);
       delete user.password;
       return json({ success: true, token, user });
    }

    if (method === "POST" && (path === "/api/auth/register" || path === "/api/register")) {
        const { name, username, email, phone, password, dob } = await request.json();
        if (!name || !username || !email || !phone || !password || !dob) return json({ error: "تکایە هەموو خانەکان پڕبکەرەوە" }, 400);
        if (password.length < 8) return json({ error: "پاسوۆرد دەبێت لانی کەم ٨ پیت یان ژمارە بێت" }, 400);

        const normalizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone.trim().replace(/\s+/g, '');

        const [existingUser, existingEmail, existingPhone] = await Promise.all([
          env.KV.get(`user:${normalizedUsername}`), env.KV.get(`email:${normalizedEmail}`), env.KV.get(`phone:${normalizedPhone}`)
        ]);

        if (existingUser) return json({ error: "ئەم یوزەرنەیمە پێشتر بەکارهاتووە" }, 409);
        if (existingEmail) return json({ error: "ئەم ئیمێڵە پێشتر بەکارهاتووە" }, 409);
        if (existingPhone) return json({ error: "ئەم ژمارە مۆبایلە پێشتر بەکارهاتووە" }, 409);

        const userId = Date.now().toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          id: userId, username: normalizedUsername, displayName: escapeHTML(name), 
          email: normalizedEmail, phone: normalizedPhone, password: hashedPassword, dob: dob, slug: normalizedUsername,
          theme: 'gold', bio: 'شارەزا لە تەکنەلۆژیا', links: [], avatarUrl: '', avatarPos: { x: 50, y: 50 },
          bgImage: '', bgPos: { x: 50, y: 50 }, isActive: true, isAdmin: false, isPro: false, createdAt: new Date().toISOString()
        };

        await Promise.all([
          env.KV.put(`user_id:${userId}`, JSON.stringify(newUser)),
          env.KV.put(`user:${normalizedUsername}`, JSON.stringify(newUser)),
          env.KV.put(`email:${normalizedEmail}`, userId),
          env.KV.put(`phone:${normalizedPhone}`, userId),
          env.KV.put(`slug:${normalizedUsername}`, userId)
        ]);

        const allUsersStr = await env.KV.get("all_users_list");
        const allUsersList = allUsersStr ? JSON.parse(allUsersStr) : [];
        allUsersList.push(userId);
        await env.KV.put("all_users_list", JSON.stringify(allUsersList));

        const token = await jwt.sign({ id: userId, exp: Math.floor(Date.now() / 1000) + (7 * 86400) }, env.JWT_SECRET);
        return json({ success: true, token, user: { id: newUser.id, username: newUser.username, isAdmin: false, isPro: false } });
    }

    if (method === "POST" && path === "/api/public/reset-password") {
       const { identifier, dob, newPassword } = await request.json();
       if (!identifier || !dob || !newPassword) return json({ error: "زانیارییەکان ناتەواون" }, 400);

       const normalizedId = identifier.toLowerCase().trim();
       let targetUserId = await env.KV.get(`user:${normalizedId}`); 
       if (!targetUserId && normalizedId.includes('@')) {
          const idFromEmail = await env.KV.get(`email:${normalizedId}`);
          if (idFromEmail) targetUserId = await env.KV.get(`user_id:${idFromEmail}`);
       }
       if (!targetUserId && /^\d+$/.test(normalizedId)) {
          const idFromPhone = await env.KV.get(`phone:${normalizedId}`);
          if (idFromPhone) targetUserId = await env.KV.get(`user_id:${idFromPhone}`);
       }

       if (!targetUserId) return json({ error: "هیچ هەژمارێک بوونی نییە" }, 404);
       
       let user = JSON.parse(targetUserId);
       if (user.dob !== dob) return json({ error: "ڕۆژی لەدایکبوونەکە هەڵەیە!" }, 403);

       user.password = await bcrypt.hash(newPassword, 10);
       await env.KV.put(`user_id:${user.id}`, JSON.stringify(user));
       await env.KV.put(`user:${user.username}`, JSON.stringify(user));
       return json({ success: true });
    }

    if (method === "GET" && path.startsWith("/api/public/profile/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       let targetUserId = await env.KV.get(`slug:${slug}`);
       let userStr = targetUserId ? await env.KV.get(`user_id:${targetUserId}`) : null;
       
       if(!userStr) return json({error: "ئەم پرۆفایلە نەدۆزرایەوە"}, 404);
       const user = JSON.parse(userStr);
       if (user.isActive === false) return json({error: "ئەم پرۆفایلە ڕاگیراوە"}, 403);

       const profileData = { 
         id: user.id, displayName: escapeHTML(user.displayName || user.username), bio: escapeHTML(user.bio || ""), 
         avatarUrl: user.avatarUrl, links: user.links || [], theme: user.theme, bgImage: user.bgImage, 
         isPro: user.isPro, slug: user.slug, nameColor: user.nameColor, bioColor: user.bioColor, btnTextColor: user.btnTextColor  
       };
       return json(profileData, 200, { "Cache-Control": "public, max-age=60, s-maxage=60" });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return json({ error: "ڕێگەپێنەدراوە" }, 401);
    const token = authHeader.split(" ")[1];
    const isValidToken = await jwt.verify(token, env.JWT_SECRET);
    if (!isValidToken) return json({ error: "تۆکنەکەت هەڵەیە" }, 401);
    const { payload } = jwt.decode(token);
    const userId = payload.id;

    // 🌟 بەشی ئەدمین: هێنانی سەرجەم یوزەرەکان لەگەڵ ئامارەکانیان 🌟
    if (method === "GET" && path === "/api/admin/users") {
        if (userId !== "admin") return json({ error: "بۆ ئەدمینە" }, 403);
        const allUsersStr = await env.KV.get("all_users_list");
        const allUsersList = allUsersStr ? JSON.parse(allUsersStr) : [];
        let finalUsers = [];
        
        for (const uid of allUsersList) {
            const uStr = await env.KV.get(`user_id:${uid}`);
            if (uStr) {
               let u = JSON.parse(uStr);
               let visits = 0, clicks = 0;
               try {
                   if(env.DB) {
                       const st = await env.DB.prepare("SELECT visits, clicks FROM stats WHERE user_id = ?").bind(uid.toString()).first();
                       if(st) { visits = (st as any).visits; clicks = (st as any).clicks; }
                   } else throw new Error();
               } catch(e) {
                   const kvSt = await env.KV.get(`stats_fallback:${uid}`, "json");
                   if(kvSt) { visits = (kvSt as any).visits; clicks = (kvSt as any).clicks; }
               }
               u.visits = visits; u.clicks = clicks;
               delete u.password;
               finalUsers.push(u);
            }
        }
        return json(finalUsers);
    }

    // 🌟 داشبۆردی بەکارهێنەر: هێنانی ئاماری ڕاستەقینە (Hybrid) 🌟
    if (method === "GET" && path === "/api/profile") {
       if (userId === "admin") return json({ id: "admin", username: "admin", displayName: "بەڕێوەبەر", isAdmin: true, isPro: true, links: [] });
       let userStr = await env.KV.get(`user_id:${userId}`);
       if (!userStr) return json({ error: "بەکارهێنەر نەدۆزرایەوە" });
       
       const user = JSON.parse(userStr);
       let visits = 0, clicks = 0;
       
       try {
           if(env.DB) {
               const st = await env.DB.prepare("SELECT visits, clicks FROM stats WHERE user_id = ?").bind(userId.toString()).first();
               if(st) { visits = (st as any).visits; clicks = (st as any).clicks; }
           } else throw new Error();
       } catch(e) {
           const kvSt = await env.KV.get(`stats_fallback:${userId}`, "json");
           if(kvSt) { visits = (kvSt as any).visits; clicks = (kvSt as any).clicks; }
       }

       user.visits = visits; user.clicks = clicks;
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