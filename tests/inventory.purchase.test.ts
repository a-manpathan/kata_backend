import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import { users, sweets } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

let userToken = '';
let sweetId = '';
const TEST_EMAIL = 'buyer@example.com';

beforeAll(async () => {
  // 1. Create User & Login
  const hashed = await bcrypt.hash('pass', 10);
  await db.insert(users).values({ email: TEST_EMAIL, password: hashed, role: 'user' });
  const login = await request(app).post('/api/auth/login').send({ email: TEST_EMAIL, password: 'pass' });
  userToken = login.body.token;

  // 2. Create a Sweet with limited stock (1 item)
  const [sweet] = await db.insert(sweets).values({
    name: 'Limited Edition Truffle',
    category: 'Chocolate',
    price: '5.00',
    quantity: 1
  }).returning();
  sweetId = sweet.id;
});

afterAll(async () => {
  await db.delete(sweets);
  await db.delete(users).where(eq(users.email, TEST_EMAIL));
});

describe('POST /api/sweets/:id/purchase', () => {
  it('should successfully purchase an item', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Purchase successful');
    expect(res.body.remainingQuantity).toBe(0); // 1 - 1 = 0
  });

  it('should fail if stock is zero', async () => {
    // Try to buy the same item again (Stock is now 0)
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400); // Bad Request
    expect(res.body.error).toBe('Out of stock');
  });
});