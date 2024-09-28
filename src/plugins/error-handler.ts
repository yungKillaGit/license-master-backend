import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '@/library/errors';

interface ErrorResponse {
  status: number;
  error: {
    message: string;
    detail?: string;
    fields?: {
      name: string;
      message: string;
    }[];
  };
}

export const errorHandler = (error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
  req.log.error(error);

  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let detail;
  let fields;

  if (error instanceof AppError) {
    status = error.status;
    message = error.message;
    detail = error.detail;
    if (error.field) {
      fields = [{ name: error.field, message: error.message }];
    }
  } else if (error instanceof ZodError) {
    status = StatusCodes.UNPROCESSABLE_ENTITY;
    message = 'One or more fields are incorrectly formatted';
    fields = error.issues.map((issue) => ({
      name: String(issue.path[0]),
      message: issue.message,
    }));
  } else if (error.statusCode === StatusCodes.UNPROCESSABLE_ENTITY) {
    status = StatusCodes.TOO_MANY_REQUESTS;
    message = "You've sent too many requests, please try again later";
  } else {
    detail = error.message;
  }

  const response: ErrorResponse = {
    status,
    error: {
      message,
      detail,
      fields,
    },
  };

  reply.status(status).send(response);
};
