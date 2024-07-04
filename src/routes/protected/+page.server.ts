import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  if (locals.user.role !== 'admin') {
    throw redirect(302, '/forbidden');
  }

  return {
      user: locals.user
  };
}
