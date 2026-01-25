// src/pages/api/question.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'test';
  const limit = url.searchParams.get('limit') || '10';

  // 转发到后端
  const backendUrl = `http://8.159.156.167:8223/question/get_question?category=${category}&limit=${limit}`;

  try {
    const res = await fetch(backendUrl);
    if (!res.ok) return new Response(JSON.stringify({ error: 'Backend error' }), { 
      status: res.status,
      headers: { 'Content-Type': 'application/json' } 
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};