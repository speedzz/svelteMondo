import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { parseAuthCookie } from '$lib/server/cookies';

export const handle: Handle = async ({ event, resolve }) => {
  const user = parseAuthCookie(event.request);

  if (user) {
    event.locals.user = await db.get('SELECT id, username, role FROM users WHERE username = ?', [user.username]);
  } else {
    event.locals.user = null;
  }

  const response = await resolve(event);

  return response;
};
