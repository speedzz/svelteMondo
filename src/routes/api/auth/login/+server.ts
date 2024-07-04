import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { createAuthCookie } from '$lib/server/cookies';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (user && await bcrypt.compare(password, user.password)) {
    const cookie = createAuthCookie(user.id, user.username, user.role);
    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie
      }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
