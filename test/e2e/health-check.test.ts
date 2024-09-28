import { StatusCodes } from 'http-status-codes';
import { expect, test } from 'vitest';
import { app } from '@/app';

test('GET / should return status OK', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  expect(response.statusCode).toBe(StatusCodes.OK);
  expect(response.json()).toEqual({ ok: true });
});
