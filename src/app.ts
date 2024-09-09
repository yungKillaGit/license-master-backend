import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastify from 'fastify';
import { errorHandler } from '@/plugins/error-handler';
import { routes } from '@/routes';
import { configuration } from './config';

const app = fastify({
  logger: true,
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

export default app;
