import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import { users, sweets } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

let userToken = '';
const TEST_EMAIL = 'search_tester@example.com';

beforeAll(async () => {
  // 1. Create User & Login
  const hashed = await bcrypt.hash('pass', 10);
  await db.insert(users).values({ email: TEST_EMAIL, password: hashed, role: 'user' });
  const res = await request(app).post('/api/auth/login').send({ email: TEST_EMAIL, password: 'pass' });
  userToken = res.body.token;

  // 2. Seed Data (3 different sweets)
  await db.insert(sweets).values([
    { name: 'Chocolate Bar', category: 'Chocolate', price: '2.00', quantity: 10 },
    { name: 'Dark Chocolate', category: 'Chocolate', price: '3.50', quantity: 5 },
    { name: 'Gummy Bears', category: 'Candy', price: '1.50', quantity: 20 },
  ]);
});

afterAll(async () => {
  await db.delete(sweets);
  await db.delete(users).where(eq(users.email, TEST_EMAIL));
});

describe('GET /api/sweets/search', () => {
  it('should search by category', async () => {
    const res = await request(app)
      .get('/api/sweets/search?category=Chocolate')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2); // Should find 2 chocolates
    expect(res.body[0].category).toBe('Chocolate');
  });

  it('should search by price range (min)', async () => {
    const res = await request(app)
      .get('/api/sweets/search?minPrice=3.00')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Dark Chocolate');
  });
});