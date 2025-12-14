import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import { users, sweets } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Test Credentials
const USER_EMAIL = 'user_sweets@example.com';
const ADMIN_EMAIL = 'admin_sweets@example.com';
const PASSWORD = 'password123';

let userToken = '';
let adminToken = '';
let createdSweetId = '';

beforeAll(async () => {
  const hashed = await bcrypt.hash(PASSWORD, 10);
  
  // Create User
  const [user] = await db.insert(users).values({ 
    email: USER_EMAIL, password: hashed, role: 'user' 
  }).returning();
  
  // Create Admin
  await db.insert(users).values({ 
    email: ADMIN_EMAIL, password: hashed, role: 'admin' 
  });

  // Login User
  const resUser = await request(app).post('/api/auth/login').send({ email: USER_EMAIL, password: PASSWORD });
  userToken = resUser.body.token;

  // Login Admin
  const resAdmin = await request(app).post('/api/auth/login').send({ email: ADMIN_EMAIL, password: PASSWORD });
  adminToken = resAdmin.body.token;
});

afterAll(async () => {
  await db.delete(sweets);
  await db.delete(users).where(eq(users.email, USER_EMAIL));
  await db.delete(users).where(eq(users.email, ADMIN_EMAIL));
});

describe('Sweets CRUD API', () => {
  // 1. Create (Failure)
  it('should fail to create sweet without token', async () => {
    const res = await request(app).post('/api/sweets').send({});
    expect(res.status).toBe(401);
  });

  // 2. Create (Success)
  it('should create a sweet (Protected)', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Gulab Jamun',
        category: 'Syrup',
        price: 10.50,
        quantity: 50
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Gulab Jamun');
    expect(res.body.category).toBe('Syrup');
    createdSweetId = res.body.id;
  });

  // 3. Read
  it('should fetch all sweets (Protected)', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // --- NEW TESTS BELOW ---

  // 4. Update
  it('should update a sweet (Protected)', async () => {
    const res = await request(app)
      .put(`/api/sweets/${createdSweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Gulab Jamun (Hot)',
        price: 12.00
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Gulab Jamun (Hot)');
    expect(res.body.price).toBe('12.00');
  });

  // 5. Delete (Failure - User)
  it('should prevent non-admin from deleting', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdSweetId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403); 
  });

  // 6. Delete (Success - Admin)
  it('should allow admin to delete', async () => {
    const res = await request(app)
      .delete(`/api/sweets/${createdSweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sweet deleted');
  });
});