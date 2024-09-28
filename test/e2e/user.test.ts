import { beforeAllTests } from '@test/lib';
import { LightMyRequestResponse } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { app } from '@/app';

const USERS_API_PATH = '/api/users';

describe('GET /api/users', () => {
  beforeAllTests();

  let response: LightMyRequestResponse;

  beforeEach(async () => {
    response = await app.inject({
      method: 'GET',
      url: USERS_API_PATH,
    });
  });

  test('should return 200 OK status', () => {
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test('should return an array of users', async () => {
    const data = response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(0);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('email');
    }
  });
});

describe('POST /api/users', () => {
  beforeAllTests();

  let postResponse: LightMyRequestResponse;

  const newUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    postResponse = await app.inject({
      method: 'POST',
      url: USERS_API_PATH,
      payload: newUser,
    });
  });

  test('should create a new user and return 200 OK status', () => {
    expect(postResponse.statusCode).toBe(StatusCodes.CREATED);
    const createdUser = postResponse.json();
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
  });

  test('should not create user with existing email', async () => {
    const duplicateUserResponse = await app.inject({
      method: 'POST',
      url: USERS_API_PATH,
      payload: {
        name: 'Duplicate User',
        email: newUser.email,
        password: 'anotherpassword',
      },
    });

    expect(duplicateUserResponse.statusCode).toBe(StatusCodes.CONFLICT);
  });
});

describe('GET /api/users/{id}', () => {
  beforeAllTests();

  let userId: string;
  let response: LightMyRequestResponse;

  beforeEach(async () => {
    const newUserResponse = await app.inject({
      method: 'POST',
      url: USERS_API_PATH,
      payload: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      },
    });
    userId = newUserResponse.json().id;

    response = await app.inject({
      method: 'GET',
      url: `${USERS_API_PATH}/${userId}`,
    });
  });

  test('should return 200 OK status', () => {
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  test('should return the user with the given ID', async () => {
    const user = response.json();
    expect(user).toHaveProperty('id', userId);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
  });

  afterEach(async () => {
    await app.inject({
      method: 'DELETE',
      url: `${USERS_API_PATH}/${userId}`,
    });
  });
});

describe('PUT /api/users/{id}', () => {
  let userId: string;
  let anotherUserId: string;

  beforeEach(async () => {
    const newUserResponse = await app.inject({
      method: 'POST',
      url: USERS_API_PATH,
      payload: {
        name: 'Update User',
        email: 'update@example.com',
        password: 'password',
      },
    });
    const anotherUserResponse = await app.inject({
      method: 'POST',
      url: USERS_API_PATH,
      payload: {
        name: 'Another User',
        email: 'another@example.com',
        password: 'anotherpassword',
      },
    });

    userId = newUserResponse.json().id;
    anotherUserId = anotherUserResponse.json().id;
  });

  afterEach(async () => {
    await app.inject({
      method: 'DELETE',
      url: `${USERS_API_PATH}/${userId}`,
    });
    await app.inject({
      method: 'DELETE',
      url: `${USERS_API_PATH}/${anotherUserId}`,
    });
  });

  test('should update user and return 200 OK status', async () => {
    const putResponse = await app.inject({
      method: 'PUT',
      url: `${USERS_API_PATH}/${userId}`,
      payload: {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword',
      },
    });

    expect(putResponse.statusCode).toBe(StatusCodes.OK);
  });

  test('should return updated user with correct data', async () => {
    const putResponse = await app.inject({
      method: 'PUT',
      url: `${USERS_API_PATH}/${userId}`,
      payload: {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword',
      },
    });

    const updatedUser = putResponse.json();
    expect(updatedUser).toHaveProperty('id', userId);
    expect(updatedUser.name).toBe('Updated Name');
    expect(updatedUser.email).toBe('updated@example.com');
  });

  test('should not allow updating email to an existing email', async () => {
    const duplicateUpdateResponse = await app.inject({
      method: 'PUT',
      url: `${USERS_API_PATH}/${userId}`,
      payload: {
        name: 'Duplicate Update',
        email: 'another@example.com',
        password: 'yetanotherpassword',
      },
    });

    expect(duplicateUpdateResponse.statusCode).toBe(StatusCodes.CONFLICT);
  });
});

describe('DELETE /api/users/{id}', () => {
  beforeAllTests();

  let userId: string;
  let deleteResponse: LightMyRequestResponse;

  beforeEach(async () => {
    const newUserResponse = await app.inject({
      method: 'POST',
      url: USERS_API_PATH,
      payload: {
        name: 'Delete User',
        email: 'delete@example.com',
        password: 'password',
      },
    });
    userId = newUserResponse.json().id;

    deleteResponse = await app.inject({
      method: 'DELETE',
      url: `${USERS_API_PATH}/${userId}`,
    });
  });

  test('should delete the user and return 200 OK status', () => {
    expect(deleteResponse.statusCode).toBe(StatusCodes.OK);
  });

  test('should return the deleted user', async () => {
    const deletedUser = deleteResponse.json();
    expect(deletedUser).toHaveProperty('id', userId);
    expect(deletedUser).toHaveProperty('name');
    expect(deletedUser).toHaveProperty('email');
  });
});
