// فایل: functions/[slug].ts
export async function onRequest(context: any) {
  const { request, env, params } = context;
  const slug = params.slug;

  // پشکنین دەکات بزانێت ئایا لینکەکە فایلی ئەپڵیکەیشنە یان نا
  if (typeof slug === 'string' && slug.endsWith('.apk')) {
    const apkSlug = slug.replace('.apk', '').toLowerCase().trim();
    const apkBuffer = await env.KV.get(`apk_file:${apkSlug}`, 'arrayBuffer');

    if (apkBuffer) {
      // ئەگەر فایلەکە هەبوو، ڕاستەوخۆ دایدەگرێت بۆ مۆبایلی بەکارهێنەرەکە
      return new Response(apkBuffer, {
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": `attachment; filename="${slug}"`,
          "Cache-Control": "public, max-age=86400"
        }
      });
    } else {
      return new Response("ئەم فایلە نەدۆزرایەوە یان سڕاوەتەوە.", { status: 404 });
    }
  }

  // ئەگەر فایلەکە .apk نەبوو، ڕێگە دەدات وێبسایتە ئاساییەکە (React) بکرێتەوە
  return env.ASSETS.fetch(request);
}