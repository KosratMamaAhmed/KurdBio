import jwt from "@tsndr/cloudflare-worker-jwt";
import bcrypt from "bcryptjs"; 

const escapeHTML = (str: string) => str.replace(/[&<>'"]/g, 
  tag => ({ '&': '&', '<': '<', '>': '>', "'": "'", '"': '"' }[tag] || tag)
);

export async function onRequest(context: any) {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  const json = (data: any, status = 200, cacheType = "none") => {
    let cacheHeader = "no-store, no-cache, must-revalidate, max-age=0";
    
    if (cacheType === "public") {
        cacheHeader = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";
    }
    
    return new Response(JSON.stringify(data), { 
      status, 
      headers: { 
        "Content-Type": "application/json", 
        "Cache-Control": cacheHeader,
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff", 
        "X-Frame-Options": "DENY", 
        "X-XSS-Protection": "1; mode=block", 
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains" 
      } 
    });
  };

  const DEFAULT_SETTINGS = { 
    siteTheme: 'orange',
    socialPlatforms: [
      { id: 'facebook', name: 'فەیسبووک', iconName: 'Facebook', imageUrl: '/social/facebook.png', baseUrl: 'https://www.facebook.com/', color: '#1877F2' },
      { id: 'instagram', name: 'ئینستاگرام', iconName: 'Instagram', imageUrl: '/social/instagram.png', baseUrl: 'https://www.instagram.com/', color: '#E4405F' },
      { id: 'tiktok', name: 'تیکتۆک', iconName: 'Music', imageUrl: '/social/tiktok.png', baseUrl: 'https://www.tiktok.com/@', color: '#000000' },
      { id: 'snapchat', name: 'سناپچات', iconName: 'Ghost', imageUrl: '/social/snapchat.png', baseUrl: 'https://www.snapchat.com/add/', color: '#FFFC00' },
      { id: 'youtube', name: 'یوتیوب', iconName: 'Youtube', imageUrl: '/social/youtube.png', baseUrl: 'https://www.youtube.com/@', color: '#FF0000' }
    ]
  };

  try {
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);

    if (method === "GET") {
      let cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) return cachedResponse; 
    }

    if (method === "GET" && path === "/api/public/settings") {
       const settingsStr = await env.KV.get("site_settings");
       const res = json(settingsStr ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsStr) } : DEFAULT_SETTINGS, 200, "public");
       waitUntil(cache.put(cacheKey, res.clone()));
       return res;
    }

    if (method === "POST" && path.startsWith("/api/public/visit/")) {
       return json({success: true}); 
    }

    if (method === "POST" && path.startsWith("/api/public/click/")) {
       return json({success: true}); 
    }

    // 🌟 چارەسەری Login (یەک خانە و Case Insensitive) 🌟
    if (method === "POST" && (path === "/api/auth/login" || path === "/api/login")) {
       const { identifier, password } = await request.json();
       if (!identifier || !password) return json({ error: "زانیارییەکان ناتەواون" }, 400);

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

       if (!userStr) {
           // پشکنین بۆ ئەدمین
           if (normalizedId === "admin" && password === (env.ADMIN_PASSWORD || "admin123")) {
               const token = await jwt.sign({ id: "admin", role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 }, env.JWT_SECRET);
               return json({ token, user: { id: "admin", username: "admin", isAdmin: true, isPro: true } });
           }
           return json({ error: "ناو، ئیمێڵ، مۆبایل یان تێپەڕەوشە هەڵەیە" }, 401);
       }

       let user = JSON.parse(userStr);
       
       if (user.isActive === false) return json({ error: "هەژمارەکەت ڕاگیراوە لەلایەن بەڕێوەبەرەوە" }, 403);

       const isValid = await bcrypt.compare(password, user.password);
       if (!isValid) return json({ error: "ناو، ئیمێڵ، مۆبایل یان تێپەڕەوشە هەڵەیە" }, 401);

       const token = await jwt.sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + (7 * 86400) }, env.JWT_SECRET);
       return json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin === 1 || user.isAdmin === true, isPro: user.isPro } });
    }

    // 🌟 چارەسەری Register (پاسوۆردی ٨ پیتی، بچووککردنەوەی یوزەر، Auto-login) 🌟
    if (method === "POST" && (path === "/api/auth/register" || path === "/api/register")) {
        const { name, username, email, phone, password, dob } = await request.json();
        
        if (!name || !username || !email || !phone || !password || !dob) return json({ error: "تکایە هەموو خانەکان پڕبکەرەوە" }, 400);
        if (password.length < 8) return json({ error: "پاسوۆرد دەبێت لانی کەم ٨ پیت یان ژمارە بێت" }, 400);

        const normalizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedPhone = phone.trim().replace(/\s+/g, '');

        const [existingUser, existingEmail, existingPhone] = await Promise.all([
          env.KV.get(`user:${normalizedUsername}`),
          env.KV.get(`email:${normalizedEmail}`),
          env.KV.get(`phone:${normalizedPhone}`)
        ]);

        if (existingUser) return json({ error: "ئەم یوزەرنەیمە پێشتر بەکارهاتووە" }, 409);
        if (existingEmail) return json({ error: "ئەم ئیمێڵە پێشتر بەکارهاتووە" }, 409);
        if (existingPhone) return json({ error: "ئەم ژمارە مۆبایلە پێشتر بەکارهاتووە" }, 409);

        const userId = Date.now().toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const slug = normalizedUsername;

        const newUser = {
          id: userId, username: normalizedUsername, displayName: escapeHTML(name), 
          email: normalizedEmail, phone: normalizedPhone, password: hashedPassword, dob: dob, slug: slug,
          theme: 'mockup', bio: 'شارەزا لە تەکنەلۆژیا', links: [], avatarUrl: '', bgImage: '',
          isActive: true, isAdmin: false, isPro: false, createdAt: new Date().toISOString()
        };

        await Promise.all([
          env.KV.put(`user_id:${userId}`, JSON.stringify(newUser)),
          env.KV.put(`user:${normalizedUsername}`, JSON.stringify(newUser)),
          env.KV.put(`email:${normalizedEmail}`, userId),
          env.KV.put(`phone:${normalizedPhone}`, userId),
          env.KV.put(`slug:${slug}`, userId)
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
       if (newPassword.length < 8) return json({ error: "پاسوۆرد دەبێت لانی کەم ٨ پیت یان ژمارە بێت" }, 400);

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
       let userStr = targetUserId ? await env.KV.get(`user_id:${targetUserId}`) : await env.KV.get(`user:${slug}`);
       if(!userStr) return json({error: "پرۆفایل نەدۆزرایەوە"}, 404, "public"); 
       
       const user = JSON.parse(userStr);
       if (user.isActive === false) return json({error: "ئەم پرۆفایلە ڕاگیراوە"}, 403, "public");

       const res = json({ 
         id: user.id, displayName: escapeHTML(user.displayName || user.username), bio: escapeHTML(user.bio || ""), 
         avatarUrl: user.avatarUrl, links: user.links || [], theme: user.theme, bgImage: user.bgImage, isPro: user.isPro,
         nameColor: user.nameColor, bioColor: user.bioColor, btnTextColor: user.btnTextColor
       }, 200, "public");

       waitUntil(cache.put(cacheKey, res.clone()));
       return res;
    }

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
       return json(userStr ? JSON.parse(userStr) : { error: "بەکارهێنەر نەدۆزرایەوە" });
    }

    // 🌟 سڕینەوەی یوزەرنەیمی کۆن کاتێک دەگۆڕدرێت 🌟
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
           avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : user.avatarUrl,
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

    if (method === "POST" && path === "/api/upload-apk") {
        if (userId !== "admin" && payload.role !== "admin") {
            const checkUser = await env.KV.get(`user_id:${userId}`);
            if (!checkUser || !JSON.parse(checkUser).isPro) return json({ error: "تەنها بۆ هەژماری VIP ڕێگەپێدراوە" }, 403);
        }
        const formData = await request.formData();
        const apkFile = formData.get('apkFile'); const logoBase64 = formData.get('logoBase64');
        const appName = formData.get('appName'); let apkSlug = formData.get('apkSlug');

        if (!apkFile || !appName || !apkSlug) return json({error: "زانیارییەکان ناتەواون"}, 400);
        apkSlug = apkSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        if (apkFile.size > 25 * 1024 * 1024) return json({error: "قەبارەی بەرنامە نابێت لە ٢٥ مێگابایت زیاتر بێت"}, 400);

        const arrayBuffer = await apkFile.arrayBuffer();
        await env.KV.put(`apk_file:${apkSlug}`, arrayBuffer);

        const userStr = await env.KV.get(`user_id:${userId}`); const user = JSON.parse(userStr);
        if(!user.links) user.links = [];
        user.links.push({ id: Date.now(), title: escapeHTML(appName), url: `/${apkSlug}.apk`, icon: 'Smartphone', color: '#10B981', platformId: 'apk', imageUrl: logoBase64 || '' });
        await env.KV.put(`user:${user.username}`, JSON.stringify(user)); await env.KV.put(`user_id:${userId}`, JSON.stringify(user));

        return json({success: true});
    }

    if (method === "POST" && path === "/api/admin/upload-global-apk") {
        if (userId !== "admin" && payload.role !== "admin") {
            const checkUser = await env.KV.get(`user_id:${userId}`);
            if (!checkUser || !JSON.parse(checkUser).isAdmin) return json({ error: "تەنها بەڕێوەبەر دەسەڵاتی هەیە" }, 403);
        }
        const formData = await request.formData();
        const apkFile = formData.get('apkFile'); const logoBase64 = formData.get('logoBase64');
        const appName = formData.get('appName'); let apkSlug = formData.get('apkSlug');

        if (!apkFile || !appName || !apkSlug) return json({error: "زانیارییەکان ناتەواون"}, 400);
        apkSlug = apkSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        if (apkFile.size > 25 * 1024 * 1024) return json({error: "قەبارە نابێت لە ٢٥ مێگابایت زیاتر بێت"}, 400);

        const arrayBuffer = await apkFile.arrayBuffer();
        await env.KV.put(`apk_file:${apkSlug}`, arrayBuffer);

        const settingsStr = await env.KV.get("site_settings"); const siteSettings = settingsStr ? JSON.parse(settingsStr) : {};
        if (!siteSettings.globalButtons) siteSettings.globalButtons = [];
        siteSettings.globalButtons.push({ id: Date.now(), title: escapeHTML(appName), url: `/${apkSlug}.apk`, icon: 'Smartphone', imageUrl: logoBase64 || '' });
        await env.KV.put("site_settings", JSON.stringify(siteSettings));
        return json({success: true, globalButtons: siteSettings.globalButtons});
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

    if (userId !== "admin" && payload.role !== "admin") {
         const checkUser = await env.KV.get(`user_id:${userId}`);
         if (!checkUser || !JSON.parse(checkUser).isAdmin) return json({ error: "تەنها بەڕێوەبەر دەسەڵاتی هەیە" }, 403);
    }

    if (method === "GET" && path === "/api/admin/users") {
        const allUsersStr = await env.KV.get("all_users_list");
        if (!allUsersStr) return json([]);
        const allUserIds = JSON.parse(allUsersStr);
        const usersList = [];
        for (const id of allUserIds) {
            const uStr = await env.KV.get(`user_id:${id}`);
            if (uStr) { const u = JSON.parse(uStr); delete u.password; usersList.push(u); }
        }
        return json(usersList.reverse());
    }

    if (method === "PUT" && path === "/api/admin/settings") {
        const newSettings = await request.json();
        await env.KV.put("site_settings", JSON.stringify(newSettings));
        return json({ success: true });
    }
    
    if (method === "POST" && path === "/api/admin/toggle-user") {
        const { userId: targetId, isActive } = await request.json();
        const uStr = await env.KV.get(`user_id:${targetId}`);
        if(uStr) {
            const u = JSON.parse(uStr); u.isActive = isActive;
            await env.KV.put(`user_id:${targetId}`, JSON.stringify(u));
            await env.KV.put(`user:${u.username}`, JSON.stringify(u));
        }
        return json({ success: true });
    }

    if (method === "POST" && path === "/api/admin/toggle-pro") {
        const { userId: targetId, isPro } = await request.json();
        const uStr = await env.KV.get(`user_id:${targetId}`);
        if(uStr) {
            const u = JSON.parse(uStr); u.isPro = isPro;
            await env.KV.put(`user_id:${targetId}`, JSON.stringify(u));
            await env.KV.put(`user:${u.username}`, JSON.stringify(u));
        }
        return json({ success: true });
    }

    if (method === "DELETE" && path.match(/^\/api\/admin\/users\/\d+$/)) {
        const targetId = path.split("/").pop();
        const uStr = await env.KV.get(`user_id:${targetId}`);
        if (uStr) {
            const u = JSON.parse(uStr);
            await env.KV.delete(`user_id:${targetId}`);
            await env.KV.delete(`user:${u.username}`);
            await env.KV.delete(`slug:${u.slug}`);
            const allUsersStr = await env.KV.get("all_users_list");
            if (allUsersStr) {
                let allUsers = JSON.parse(allUsersStr);
                allUsers = allUsers.filter((id:any) => id.toString() !== targetId);
                await env.KV.put("all_users_list", JSON.stringify(allUsers));
            }
        }
        return json({ success: true });
    }

    if (method === "PUT" && path === "/api/admin/edit-user") {
        const updates = await request.json();
        const uStr = await env.KV.get(`user_id:${updates.id}`);
        if (uStr) {
            const u = JSON.parse(uStr);
            u.displayName = escapeHTML(updates.displayName || u.displayName);
            u.bio = escapeHTML(updates.bio || u.bio);
            const oldSlug = u.slug;
            const newSlug = escapeHTML(updates.slug || u.slug).toLowerCase().replace(/[^a-z0-9_-]/g, '');
            u.slug = newSlug;
            
            if (newSlug !== oldSlug) {
                await env.KV.delete(`slug:${oldSlug}`);
                await env.KV.put(`slug:${newSlug}`, u.id.toString());
            }
            
            await env.KV.put(`user_id:${u.id}`, JSON.stringify(u));
            await env.KV.put(`user:${u.username}`, JSON.stringify(u));
        }
        return json({ success: true });
    }

  } catch (err: any) {
    return json({ error: "هەڵەی سێرڤەر: " + err.message }, 500);
  }
}