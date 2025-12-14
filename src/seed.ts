import { db } from './db';
import { users } from './db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    const hashedPassword = await bcrypt.hash('password', 10);

    await db.insert(users).values({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: password');
  } catch (error) {
    console.error('❌ Error seeding data (User likely already exists):', error);
  }

  process.exit(0);
}

seed();