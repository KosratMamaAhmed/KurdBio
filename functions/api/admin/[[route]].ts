import bcrypt from "bcryptjs";
import jwt from "@tsndr/cloudflare-worker-jwt";

const escapeHTML = (str: string) => str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));

const corsHeaders = {
  "Content-Type": "application/json", "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
const json = (data: any, status = 200) => new Response(JSON.stringify(data), { status, headers: corsHeaders });

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return json({ error: "ڕێگەپێنەدراوە" }, 401);
    const token = authHeader.split(" ")[1];
    
    const isValidToken = await jwt.verify(token, env.JWT_SECRET);
    if (!isValidToken) return json({ error: "تۆکنەکەت بەسەرچووە" }, 401);
    
    const { payload } = jwt.decode(token);
    if (payload.id !== "admin" && payload.role !== "admin") return json({ error: "ڕێگەپێنەدراوە بۆ ئەم بەشە" }, 403);

    // Fetching users efficiently by only looking at the master list to save KV reads
    if (method === "GET" && path === "/api/admin/users") {
        const allUsersStr = await env.KV.get("all_users_list");
        let userIds = [];
        if (allUsersStr) {
            userIds = JSON.parse(allUsersStr);
        } else {
            const list = await env.KV.list({prefix: "user_id:"});
            userIds = list.keys.map((k: any) => k.name.replace('user_id:', ''));
        }

        // Limit the parallel reads to avoid subrequest limits (Batched promises)
        const users = [];
        const chunkSize = 20;
        
        for (let i = 0; i < userIds.length; i += chunkSize) {
            const chunk = userIds.slice(i, i + chunkSize);
            const chunkPromises = chunk.map(async (id: string) => {
                const uStr = await env.KV.get(`user_id:${id}`);
                if (!uStr) return null;
                const { password, links, ...safeUser } = JSON.parse(uStr); 
                return safeUser;
            });
            const results = await Promise.all(chunkPromises);
            users.push(...results.filter(u => u !== null));
        }

        return json(users);
    }

    if (method === "PUT" && path === "/api/admin/settings") {
        const newSettings = await request.json();
        const currentSettingsStr = await env.KV.get("site_settings");
        const currentSettings = currentSettingsStr ? JSON.parse(currentSettingsStr) : {};
        await env.KV.put("site_settings", JSON.stringify({ ...currentSettings, ...newSettings }));
        return json({success: true});
    }

    if (method === "POST" && path === "/api/admin/toggle-user") {
        const body = await request.json();
        const userStr = await env.KV.get(`user_id:${body.userId}`);
        if(userStr) {
            const user = JSON.parse(userStr); user.isActive = body.isActive;
            await Promise.all([ env.KV.put(`user:${user.username}`, JSON.stringify(user)), env.KV.put(`user_id:${body.userId}`, JSON.stringify(user)) ]);
        }
        return json({success: true});
    }

    if (method === "POST" && path === "/api/admin/toggle-pro") {
        const body = await request.json();
        const userStr = await env.KV.get(`user_id:${body.userId}`);
        if(userStr) {
            const user = JSON.parse(userStr); user.isPro = body.isPro;
            await Promise.all([ env.KV.put(`user:${user.username}`, JSON.stringify(user)), env.KV.put(`user_id:${body.userId}`, JSON.stringify(user)) ]);
        }
        return json({success: true});
    }

    if (method === "POST" && path === "/api/admin/force-password") {
        const { targetId, newPassword } = await request.json();
        const userStr = await env.KV.get(`user_id:${targetId}`);
        if(userStr) {
            const user = JSON.parse(userStr);
            user.password = await bcrypt.hash(newPassword, 10);
            await Promise.all([ env.KV.put(`user:${user.username}`, JSON.stringify(user)), env.KV.put(`user_id:${targetId}`, JSON.stringify(user)) ]);
        }
        return json({success: true});
    }

    if (method === "PUT" && path === "/api/admin/edit-user") {
        const updates = await request.json();
        const userStr = await env.KV.get(`user_id:${updates.id}`);
        if(userStr) {
            const user = JSON.parse(userStr);
            const safeUpdates = { displayName: escapeHTML(updates.displayName || user.displayName), bio: escapeHTML(updates.bio || user.bio), slug: escapeHTML(updates.slug || user.slug) };
            const updatedUser = { ...user, ...safeUpdates };
            
            if (safeUpdates.slug !== user.slug) {
                await env.KV.delete(`slug:${user.slug}`);
                await env.KV.put(`slug:${safeUpdates.slug}`, updates.id.toString());
            }

            await Promise.all([ env.KV.put(`user:${updatedUser.username}`, JSON.stringify(updatedUser)), env.KV.put(`user_id:${updates.id}`, JSON.stringify(updatedUser)) ]);
        }
        return json({success: true});
    }

    if (method === "DELETE" && path.match(/^\/api\/admin\/users\/\d+$/)) {
         const idToDelete = path.split("/").pop();
         const userStr = await env.KV.get(`user_id:${idToDelete}`);
         if(userStr) {
             const user = JSON.parse(userStr);
             await Promise.all([
                 env.KV.delete(`user:${user.username}`),
                 env.KV.delete(`user_id:${idToDelete}`),
                 env.KV.delete(`slug:${user.slug || user.username}`),
                 env.KV.delete(`email:${user.email}`)
             ]);

             const allUsersStr = await env.KV.get("all_users_list");
             if (allUsersStr) {
                 let allUsers = JSON.parse(allUsersStr);
                 allUsers = allUsers.filter((id: any) => id.toString() !== idToDelete?.toString());
                 await env.KV.put("all_users_list", JSON.stringify(allUsers));
             }
         }
         return json({success: true});
    }

    return json({ error: "Admin route not found" }, 404);
  } catch (err: any) { 
      return json({ error: "هەڵەی سێرڤەر: " + err.message }, 500); 
  }
}