import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )
`);