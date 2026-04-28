export async function onRequest({ request, env, params }: any) {
  const apkName = params.apkName as string; 
  
  // ئەگەر فایلەکە بە .apk کۆتایی نەهات، با بڕوات بۆ سیستەمی ئاسایی (React)
  if (!apkName || !apkName.endsWith('.apk')) {
     return env.ASSETS.fetch(request);
  }

  // دەرهێنانی ناوی ئەپەکە بێ پاشگرەکە
  const slug = apkName.replace('.apk', '').toLowerCase().trim();
  const apkBuffer = await env.KV.get(`apk_file:${slug}`, 'arrayBuffer');

  if (!apkBuffer) {
    return new Response("ئەم ئەپڵیکەیشنە نەدۆزرایەوە یان سڕاوەتەوە. دڵنیابە لە ناوی لینکەکە.", { status: 404 });
  }

  // پێدانی فایلەکە بە شێوەی دابەزاندنی ڕاستەوخۆ
  return new Response(apkBuffer, {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename="${apkName}"`,
      "Cache-Control": "public, max-age=86400"
    }
  });
}