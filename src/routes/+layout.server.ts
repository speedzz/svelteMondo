import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({locals, url}) => {
    const path = url.pathname;
    if (!locals.user && !path.startsWith('/api/') && path !== '/auth/login' && path !== '/auth/register') {
        throw redirect(302, '/auth/login');
    }
    return {};
}) satisfies LayoutServerLoad;