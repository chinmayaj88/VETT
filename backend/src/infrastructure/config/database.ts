import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Generated Prisma client is outside rootDir
import { PrismaClient } from '../../../generated/prisma/client';

const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

