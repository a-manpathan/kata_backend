import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Cleanup helper: delete the test user after we are done
const TEST_EMAIL = 'test_register@example.com';

afterAll(async () => {
  await db.delete(users).where(eq(users.email, TEST_EMAIL));
});

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: TEST_EMAIL,
      password: 'password123',
      role: 'user',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('userId');
  });

  it('should reject duplicate emails', async () => {
    // Attempt to register the same user again
    const response = await request(app).post('/api/auth/register').send({
      email: TEST_EMAIL,
      password: 'newpassword',
      role: 'user',
    });

    expect(response.status).toBe(409); // Conflict
    expect(response.body).toHaveProperty('error', 'Email already exists');
  });
});