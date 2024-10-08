import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import fastify from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { errorHandler } from '@/plugins/error-handler';
import { routes } from '@/routes';
import { configuration } from './config';
import { db } from './db';

export const app = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        colorizeObjects: true,
      },
    },
  },
});

app.addHook('onReady', async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
});

app.register(swagger, { transform: jsonSchemaTransform });
app.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    deepLinking: false,
  },
  uiHooks: {
    onRequest(request, reply, next) {
      next();
    },
    preHandler(request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});
app.register(helmet);
app.register(cookie);

app.register(cors, {
  origin: configuration.ORIGIN,
  credentials: true,
});

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

app.register(routes, {
  prefix: '/api',
});

app.setErrorHandler(errorHandler);

app.ready().then(() => {
  app.swagger();
});

app.get('/', () => {
  return { ok: true };
});
