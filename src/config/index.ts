import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['staging', 'development', 'test']),
  APP_PORT: z.coerce.number().default(8080),
  APP_HOST: z.string().default('localhost'),
  ORIGIN: z.string().url(),
  DB_PORT: z.coerce.number().default(5432),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_DATABASE_TEST: z.string(),
  DB_MAX_CONNECTIONS: z.coerce.number().default(20),
  DB_SSL_CA: z.string().optional(),
});

const configurationSchema = envSchema.extend({
  DB_SSL: z.object({ rejectUnauthorized: z.boolean(), ca: z.string() }).optional(),
});

type Configuration = z.infer<typeof configurationSchema>;

const getConfiguration = (): Configuration => {
  let configuration = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    APP_HOST: process.env.APP_HOST,
    ORIGIN: process.env.ORIGIN,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_DATABASE_TEST: process.env.DB_DATABASE_TEST,
  });

  const isStaging = configuration.NODE_ENV === 'staging';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  configuration.DB_SSL = isStaging ? { rejectUnauthorized: true, ca: configuration.DB_SSL_CA } : undefined;

  configuration = configurationSchema.parse(configuration);
  return configuration;
};

export const configuration = getConfiguration();
