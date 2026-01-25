// src/pages/api/question.ts
import { type APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // 获取原始查询参数
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'test';
  const limit = url.searchParams.get('limit') || '10';

  // 转发到你的 HTTP 后端（国内服务器）
  const backendUrl = `http://8.159.156.167:8223/question/get_question?category= $ {category}&limit= $ {limit}`;

  try {
    const response = await fetch(backendUrl, {
      headers: {
        'User-Agent': 'Vercel-Proxy',
      },
    });

    if (!response.ok) {
      return new Response(`Backend error:  $ {response.status}`, { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Proxy failed', { status: 500 });
  }
};