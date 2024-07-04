import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const filesDir = path.join(process.cwd(), 'static', 'files');

export async function POST({ request }) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return json({ error: 'No file uploaded' }, { status: 400 });
  }

  const fileName = file.name;
  const filePath = path.join(filesDir, fileName);

  try {
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
    const stats = await fs.stat(filePath);

    return json({
      name: fileName,
      size: stats.size,
      lastModified: stats.mtime.toISOString()
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return json({ error: 'Failed to save file' }, { status: 500 });
  }
}