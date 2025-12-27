import { db } from '../src/db';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';

export class AuthService {
  private currentUser: any = null;

  async login(credentials: any) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;

    return { user: userWithoutPassword, token };
  }

  async register(userData: any) {
    const { name, email, password, role, profile } = userData;

    if (!email || !password || !name || !role) {
      throw new Error('All fields are required');
    }

    const validRoles = ['admin', 'employee'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Allowed: admin, employee');
    }

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role,
      profile,
    }).returning();

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async logout() {
    this.currentUser = null;
    return { success: true, message: 'Logout successful' };
  }

  async getCurrentUser() {
    return this.currentUser;
  }
}
