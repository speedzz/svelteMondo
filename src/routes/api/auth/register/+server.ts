import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password, role } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
    return new Response(JSON.stringify({ message: 'User registered successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return new Response(JSON.stringify({ error: 'Username already exists' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({ error: 'User registration failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
