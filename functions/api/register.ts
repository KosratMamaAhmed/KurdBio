import bcrypt from "bcryptjs";
import jwt from "@tsndr/cloudflare-worker-jwt";

// 🌟 هەمان هێدەرە ئەمنییە بەهێزەکانی کە بۆ login داماننا
const corsHeaders = {
  "Content-Type": "application/json", 
  "Cache-Control": "no-store", // نابێت داتای هەستیار کاش بکرێت
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "X-Content-Type-Options": "nosniff", // پاراستن لە گۆڕینی جۆری فایل
  "X-Frame-Options": "DENY", // پاراستن لە Clickjacking
  "X-XSS-Protection": "1; mode=block", // پاراستن لە هێرشی XSS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains" // ناچارکردنی HTTPS
};

const json = (data: any, status = 200) => new Response(JSON.stringify(data), { status, headers: corsHeaders });

// پاککردنەوەی ناوەکان لە کۆدی زیانبەخش (Sanitization)
const escapeHTML = (str: string) => str.replace(/[&<>'"]/g, 
  tag => ({ '&': '&', '<': '<', '>': '>', "'": "'", '"': '"' }[tag] || tag)
);

export async function onRequest(context: any) {
  const { request, env } = context;
  
  // ڕێگەدان بە CORS بۆ فۆڕمی ڕیجیستەر
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "ڕێگەپێنەدراوە" }, 405);

  try {
    const body = await request.json();
    const { username, email, phone, password, dob } = body;

    // پشکنینی داتاکان
    if (!username || !email || !phone || !password || !dob) {
      return json({ error: "تکایە هەموو زانیارییەکان پڕبکەرەوە" }, 400);
    }

    const normalizedUsername = username.toLowerCase().trim().replace(/\s+/g, '');
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim().replace(/\s+/g, '');

    // پشکنین کە ئایا ئەم ناوە، ئیمێڵە، یان ژمارەیە پێشتر بەکارهاتووە یان نا
    const [existingUser, existingEmail, existingPhone] = await Promise.all([
      env.KV.get(`user:${normalizedUsername}`),
      env.KV.get(`email:${normalizedEmail}`),
      env.KV.get(`phone:${normalizedPhone}`)
    ]);

    if (existingUser) return json({ error: "ئەم یوزەرنەیمە پێشتر بەکارهاتووە" }, 409);
    if (existingEmail) return json({ error: "ئەم ئیمێڵە پێشتر بەکارهاتووە" }, 409);
    if (existingPhone) return json({ error: "ئەم ژمارە مۆبایلە پێشتر بەکارهاتووە" }, 409);

    // دروستکردنی ئایدی و پاسوۆردی پارێزراو
    const userId = Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    const slug = normalizedUsername.replace(/[^a-z0-9_-]/g, '');

    // دروستکردنی ئۆبجێکتی بەکارهێنەر
    const newUser = {
      id: userId,
      username: normalizedUsername,
      displayName: escapeHTML(username), // بەکارهێنانی ناوی ئاسایی بۆ سەرەتا
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      dob: dob,
      slug: slug,
      theme: 'mockup', // ڕووکاری بنەڕەتی
      bio: 'تۆڕە کۆمەڵایەتییەکانم لێرە ببینە',
      links: [],
      avatarUrl: '',
      bgImage: '',
      isActive: true,
      isAdmin: false,
      isPro: false,
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString()
    };

    // پاشەکەوتکردنی هەموو داتاکان بە یەکجار لەسەر سێرڤەر (KV)
    await Promise.all([
      env.KV.put(`user_id:${userId}`, JSON.stringify(newUser)),
      env.KV.put(`user:${normalizedUsername}`, JSON.stringify(newUser)),
      env.KV.put(`email:${normalizedEmail}`, userId.toString()),
      env.KV.put(`phone:${normalizedPhone}`, userId.toString()),
      env.KV.put(`slug:${slug}`, userId.toString())
    ]);

    // نوێکردنەوەی لیستی هەموو بەکارهێنەران بۆ ئەوەی لە ئەدمین پانێل دەربکەون
    const allUsersStr = await env.KV.get("all_users_list");
    const allUsersList = allUsersStr ? JSON.parse(allUsersStr) : [];
    allUsersList.push(userId);
    await env.KV.put("all_users_list", JSON.stringify(allUsersList));

    // دروستکردنی تۆکن و چوونەژوورەوەی ڕاستەوخۆ
    const token = await jwt.sign({ 
       id: userId, 
       exp: Math.floor(Date.now() / 1000) + (7 * 86400) // ٧ ڕۆژ کار دەکات
    }, env.JWT_SECRET);

    // گەڕاندنەوەی زانیارییەکان بێ پاسوۆرد
    const { password: _, ...userWithoutPassword } = newUser;

    return json({ 
       success: true, 
       token, 
       user: { id: userWithoutPassword.id, username: userWithoutPassword.username, isAdmin: false, isPro: false } 
    });

  } catch (err: any) {
    console.error("هەڵە لە دروستکردنی هەژمار:", err);
    return json({ error: "هەڵەیەک لە سێرڤەر ڕوویدا، تکایە دووبارە هەوڵبدەرەوە" }, 500);
  }
}