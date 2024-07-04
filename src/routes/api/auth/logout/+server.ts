import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
  return new Response(JSON.stringify({ message: 'Logout successful' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth=; Path=/; Max-Age=0'
    }
  });
};
