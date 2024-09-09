import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['staging', 'development']),
  APP_PORT: z.coerce.number().default(8080),
  ORIGIN: z.string().url(),
  DB_PORT: z.coerce.number().default(5432),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  SHIKIMORI_APP_NAME: z.string(),
  SHIKIMORI_CLIENT_ID: z.string(),
  SHIKIMORI_CLIENT_SECRET: z.string(),
  DB_MAX_CONNECTIONS: z.coerce.number().default(20),
  DB_SSL_CA: z.string().optional(),
});

const configurationSchema = envSchema.extend({
  DB_SSL: z.object({ rejectUnauthorized: z.boolean(), ca: z.string() }).optional(),
});

type Configuration = z.infer<typeof configurationSchema>;

const getConfiguration = () => {
  let configuration = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    ORIGIN: process.env.ORIGIN,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    SHIKIMORI_APP_NAME: process.env.SHIKIMORI_APP_NAME,
    SHIKIMORI_CLIENT_ID: process.env.SHIKIMORI_CLIENT_ID,
    SHIKIMORI_CLIENT_SECRET: process.env.SHIKIMORI_CLIENT_SECRET,
  }) as unknown as Configuration;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  configuration.DB_SSL = configuration.NODE_ENV !== 'development' ? { rejectUnauthorized: true, ca: configuration.DB_SSL_CA } : undefined;

  configuration = configurationSchema.parse(configuration);
  return configuration;
};

export const configuration = getConfiguration();
