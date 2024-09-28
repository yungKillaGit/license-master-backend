import { FastifyPluginCallback } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { IdSchema, withZod } from '@/library/zod';
import { CreateUserSchema, SelectUserSchema, UpdateUserSchema } from './schema';
import { UserService } from './service';

export const userController: FastifyPluginCallback = (fastify, options, done) => {
  const api = withZod(fastify);
  const userService = new UserService();

  api.get('/users', { schema: { response: { [StatusCodes.OK]: z.array(SelectUserSchema) } } }, async (request, reply) => {
    const users = await userService.getAllUsers();
    reply.send(users);
  });

  api.get('/users/:id', { schema: { params: IdSchema, response: { [StatusCodes.OK]: SelectUserSchema } } }, async (request, reply) => {
    const user = await userService.getUserById(request.params.id);
    reply.send(user);
  });

  api.post(
    '/users',
    { schema: { body: CreateUserSchema, response: { [StatusCodes.CREATED]: SelectUserSchema } } },
    async (request, reply) => {
      const createdUser = await userService.createUser(request.body);
      reply.status(201).send(createdUser);
    }
  );

  api.put(
    '/users/:id',
    { schema: { body: UpdateUserSchema, params: IdSchema, response: { [StatusCodes.OK]: SelectUserSchema } } },
    async (request, reply) => {
      const user = request.body;
      const updatedUser = await userService.updateUser(request.params.id, { ...user });
      reply.send(updatedUser);
    }
  );

  api.delete('/users/:id', { schema: { params: IdSchema, response: { [StatusCodes.OK]: SelectUserSchema } } }, async (request, reply) => {
    const deletedUser = await userService.deleteUser(request.params.id);
    reply.send(deletedUser);
  });

  done();
};
