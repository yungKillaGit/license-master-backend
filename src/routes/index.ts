import { FastifyPluginCallback } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { auth } from './auth/controller';

export const routes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(auth);

  done();
};
