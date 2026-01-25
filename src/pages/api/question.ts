// src/pages/api/question.ts
// src/pages/api/question.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || '统一测试';
  const limit = url.searchParams.get('limit') || '10';

  const backendUrl = `http://8.159.156.167:8223/question/get_question?category=${category}&limit=${limit}&t=${Date.now()}`;

  try {
    const res = await fetch(backendUrl, {
      headers: {
        'User-Agent': 'Vercel-Proxy',
      },
    });

    // 👇 关键：不管状态码，都透传 body 和 status
    const body = await res.text(); // 用 text() 避免 JSON 解析失败
    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy network error:', error);
    return new Response(JSON.stringify({ error: 'Proxy failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};