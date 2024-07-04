import { redirect } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');
const filesDir = path.join(rootDir, 'static/files');

export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  if (locals.user.role !== 'admin') {
    throw redirect(302, '/forbidden');
  }

  try {
    const files = await fs.readdir(filesDir);
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(filesDir, file));
        return {
          name: file,
          size: stats.size,
          lastModified: stats.mtime
        };
      })
    );

    return {
      user: locals.user,
      files: fileDetails
    };
  } catch (error) {
    console.error('Error reading directory:', error);
    return {
      user: locals.user,
      files: [],
      error: 'Failed to read directory'
    };
  }
}