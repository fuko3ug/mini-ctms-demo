import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';
config();

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});