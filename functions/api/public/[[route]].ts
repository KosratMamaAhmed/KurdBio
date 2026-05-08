const escapeHTML = (str: string) => str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));

const corsHeaders = {
  "Content-Type": "application/json", "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"
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
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    
    if (request.method === "GET") {
      let response = await cache.match(cacheKey);
      if (response) return response; 
    }

    if (request.method === "GET" && path === "/api/public/settings") {
       const settingsStr = await env.KV.get("site_settings");
       const data = settingsStr ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsStr) } : DEFAULT_SETTINGS;
       const res = json(data, 200, { "Cache-Control": "public, max-age=300, s-maxage=300" });
       waitUntil(cache.put(cacheKey, res.clone()));
       return res;
    }

    // 🌟 چارەسەرکرا: تۆمارکردنی سەردان (Visits) 🌟
    if (request.method === "POST" && path.startsWith("/api/public/visit/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           let targetUserId = await env.KV.get(`slug:${slug}`);
           let userStr = targetUserId ? await env.KV.get(`user_id:${targetUserId}`) : await env.KV.get(`user:${slug}`);
           
           if (userStr) {
               const user = JSON.parse(userStr);
               user.visits = (user.visits || 0) + 1;
               await env.KV.put(`user_id:${user.id}`, JSON.stringify(user));
               await env.KV.put(`user:${user.username}`, JSON.stringify(user));
               
               // تۆمارکردنی ئاماری گشتی سایت
               let siteStatsStr = await env.KV.get("site_stats");
               let siteStats = siteStatsStr ? JSON.parse(siteStatsStr) : { totalVisits: 0, totalClicks: 0, dailyUsers: [], monthlyUsers: [] };
               siteStats.totalVisits += 1;
               
               const today = new Date().toISOString().split('T')[0];
               const currentMonth = today.substring(0, 7);
               
               if (!siteStats.dailyUsers) siteStats.dailyUsers = [];
               if (!siteStats.monthlyUsers) siteStats.monthlyUsers = [];

               if (!siteStats.dailyUsers.includes(today)) siteStats.dailyUsers.push(today);
               if (!siteStats.monthlyUsers.includes(currentMonth)) siteStats.monthlyUsers.push(currentMonth);

               await env.KV.put("site_stats", JSON.stringify(siteStats));
           }
       }
       return json({ success: true });
    }

    // 🌟 چارەسەرکرا: تۆمارکردنی کلیک (Clicks) 🌟
    if (request.method === "POST" && path.startsWith("/api/public/click/")) {
       const slug = escapeHTML(path.split("/").pop() || "");
       if (slug) {
           let targetUserId = await env.KV.get(`slug:${slug}`);
           let userStr = targetUserId ? await env.KV.get(`user_id:${targetUserId}`) : await env.KV.get(`user:${slug}`);
           
           if (userStr) {
               const user = JSON.parse(userStr);
               user.clicks = (user.clicks || 0) + 1;
               await env.KV.put(`user_id:${user.id}`, JSON.stringify(user));
               await env.KV.put(`user:${user.username}`, JSON.stringify(user));

               // تۆمارکردنی ئاماری گشتی سایت
               let siteStatsStr = await env.KV.get("site_stats");
               let siteStats = siteStatsStr ? JSON.parse(siteStatsStr) : { totalVisits: 0, totalClicks: 0, dailyUsers: [], monthlyUsers: [] };
               siteStats.totalClicks += 1;
               
               await env.KV.put("site_stats", JSON.stringify(siteStats));
           }
       }
       return json({ success: true });
    }

    if (request.method === "GET" && path.startsWith("/api/public/profile/")) {
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

    return json({ error: "Route not found" }, 404);
  } catch (err: any) {
    return json({ error: "هەڵەی سێرڤەر" }, 500);
  }
}