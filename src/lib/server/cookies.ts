import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { sign, verify } = jwt;
const SECRET_KEY = process.env.SECRET_KEY as string;

export function createAuthCookie(id: number, username: string, role: string): string {
  const token = sign({ id, username, role }, SECRET_KEY, { expiresIn: '1h' });
  return cookie.serialize('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    path: '/'
  });
}

export function parseAuthCookie(req: Request): { id: number; username: string; role: string } | null {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.auth;

  if (token) {
    try {
      return verify(token, SECRET_KEY) as { id: number; username: string; role: string };
    } catch (err) {
      return null;
    }
  }
  return null;
}
