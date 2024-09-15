import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const withZod = (fastify: FastifyInstance) => {
  return fastify.withTypeProvider<ZodTypeProvider>();
};

export const IdSchema = z.object({ id: z.string() });
