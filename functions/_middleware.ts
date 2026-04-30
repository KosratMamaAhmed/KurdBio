export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // دەرکردنی ئەو فایل و لینکانەی کە پرۆفایل نین بۆ ئەوەی خێرایی سایتەکە کەم نەبێتەوە
  const excludePaths = ['/api', '/assets', '/dashboard', '/auth', '/payment', '/favicon.ico', '/icon'];
  
  // ئەگەر پەڕەی سەرەکی بوو یان فایلێکی ئاسایی بوو (وەک .apk یان .css)، وازی لێ بهێنە
  if (excludePaths.some(p => path.startsWith(p)) || path === '/' || path.includes('.')) {
    return next();
  }

  // وەرگرتنی ناوی لینکەکە (slug) بۆ نموونە: darmanzany
  const slug = path.split('/')[1];

  if (slug) {
    try {
      // بەدواداگەڕان لەناو داتابەیس (KV) بۆ دۆزینەوەی خاوەنی لینکەکە
      const targetUserId = await env.KV.get(`slug:${slug}`);
      
      if (targetUserId) {
        const userStr = await env.KV.get(`user_id:${targetUserId}`);
        
        if (userStr) {
          const user = JSON.parse(userStr);
          
          // ئامادەکردنی زانیارییەکان بۆ سۆشیاڵ میدیا
          const title = user.displayName || user.username || 'BioKurd';
          const description = user.bio || 'هەموو بەستەرەکانت لە یەک شوێندا';
          const image = user.avatarUrl || 'https://biokurd.com/icon-512.png';

          // وەرگرتنی پەڕەی ئاسایی وێبсайтەکەت (index.html)
          const response = await next();

          // جێگیرکردنی زانیارییەکان لەناو HTML پێش ئەوەی بگاتە فەیسبووک و تێلێگرام
          return new HTMLRewriter()
            .on('title', {
              element(element) {
                element.setInnerContent(`${title} - BioKurd`);
              }
            })
            .on('head', {
              element(element) {
                // زیادکردنی مێتا تاگەکانی Open Graph بۆ فەیسبووک، واتسئاپ، تێلێگرام
                element.append(`<meta property="og:title" content="${title}" />`, { html: true });
                element.append(`<meta property="og:description" content="${description}" />`, { html: true });
                element.append(`<meta name="description" content="${description}" />`, { html: true });
                element.append(`<meta property="og:image" content="${image}" />`, { html: true });
                
                // زیادکردنی مێتا تاگەکانی تویتەر (X)
                element.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
                element.append(`<meta name="twitter:title" content="${title}" />`, { html: true });
                element.append(`<meta name="twitter:description" content="${description}" />`, { html: true });
                element.append(`<meta name="twitter:image" content="${image}" />`, { html: true });
              }
            })
            .transform(response);
        }
      }
    } catch (error) {
      // ئەگەر کێشەیەک هەبوو، پەڕەکە وەک خۆی بنێرە بەبێ تێکچوون
      return next();
    }
  }

  // ئەگەر هیچ مەرجێک جێبەجێ نەبوو، پەڕەکە وەک خۆی لۆد بکە
  return next();
}