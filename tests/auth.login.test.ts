import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const LOGIN_EMAIL = 'test_login@example.com';
const PASSWORD = 'securepassword';

// Setup: Create a user explicitly for login testing
beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  await db.insert(users).values({
    email: LOGIN_EMAIL,
    password: hashedPassword,
    role: 'user',
  });
});

// Cleanup
afterAll(async () => {
  await db.delete(users).where(eq(users.email, LOGIN_EMAIL));
});

describe('POST /api/auth/login', () => {
  it('should login successfully with correct credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: LOGIN_EMAIL,
      password: PASSWORD,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail with incorrect password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: LOGIN_EMAIL,
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});