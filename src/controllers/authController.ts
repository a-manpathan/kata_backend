import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Check existing user
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: role || 'user',
    }).returning({ id: users.id, email: users.email });

    return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userResult = await db.select().from(users).where(eq(users.email, email));
    const user = userResult[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
};