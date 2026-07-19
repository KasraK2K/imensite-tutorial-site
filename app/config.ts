import path from 'node:path';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile();
} catch (error) {
  const isMissingFile = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
  if (!isMissingFile) throw error;
}

export const appDirectory = path.resolve(process.cwd(), 'app');
export const publicDirectory = path.join(appDirectory, 'public');
export const viewsDirectory = path.join(appDirectory, 'views');

const parsedPort = Number.parseInt(process.env.PORT ?? '3000', 10);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required in production.');
}

const databaseName = process.env.MONGODB_DATABASE ?? 'ImenSiteData';
const mongoUsername = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const authenticatedMongoUri = mongoUsername && mongoPassword
  ? `mongodb://${encodeURIComponent(mongoUsername)}:${encodeURIComponent(mongoPassword)}@127.0.0.1:27017/${encodeURIComponent(databaseName)}?authSource=admin`
  : `mongodb://127.0.0.1:27017/${encodeURIComponent(databaseName)}`;

export const config = {
  mongoUri: process.env.MONGODB_URI ?? authenticatedMongoUri,
  port: parsedPort,
  sessionSecret: process.env.SESSION_SECRET ?? 'development-only-imensite-secret',
} as const;
