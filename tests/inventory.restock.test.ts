import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import { users, sweets } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

let userToken = '';
let adminToken = '';
let sweetId = '';

beforeAll(async () => {
  const hashed = await bcrypt.hash('pass', 10);
  
  // User
  await db.insert(users).values({ email: 'u_restock@ex.com', password: hashed, role: 'user' });
  const uRes = await request(app).post('/api/auth/login').send({ email: 'u_restock@ex.com', password: 'pass' });
  userToken = uRes.body.token;

  // Admin
  await db.insert(users).values({ email: 'a_restock@ex.com', password: hashed, role: 'admin' });
  const aRes = await request(app).post('/api/auth/login').send({ email: 'a_restock@ex.com', password: 'pass' });
  adminToken = aRes.body.token;

  // Sweet (Start with 0)
  const [sweet] = await db.insert(sweets).values({
    name: 'Empty Jar', category: 'Glass', price: '0.00', quantity: 0
  }).returning();
  sweetId = sweet.id;
});

afterAll(async () => {
  await db.delete(sweets);
  await db.delete(users).where(eq(users.email, 'u_restock@ex.com'));
  await db.delete(users).where(eq(users.email, 'a_restock@ex.com'));
});

describe('POST /api/sweets/:id/restock', () => {
  it('should prevent non-admin from restocking', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 10 });

    expect(res.status).toBe(403);
  });

  it('should allow admin to restock', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 10 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(10); // 0 + 10
  });
});