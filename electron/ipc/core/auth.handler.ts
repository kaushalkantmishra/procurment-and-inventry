import { ipcMain } from 'electron';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../../backend/src/db';
import { users } from '../../../backend/src/db/schema';
import { eq } from 'drizzle-orm';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'employee';
    isActive: boolean;
  };
  token?: string;
  message?: string;
}

const authHandler = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Auth handler - Login attempt for:', credentials.email);
      const { email, password } = credentials;

      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      console.log('Auth handler - User found:', !!user);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      if (!user.isActive) {
        console.log('Auth handler - User inactive');
        return {
          success: false,
          message: 'Account is inactive'
        };
      }

      // Verify password
      console.log('Auth handler - Verifying password');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Auth handler - Password valid:', isValidPassword);
      
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      console.log('Auth handler - Login successful');
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as 'admin' | 'employee',
          isActive: user.isActive
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  },

  async logout(): Promise<void> {
    return Promise.resolve();
  },

  async verifyToken(token: string): Promise<{ valid: boolean; user?: any }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return { valid: true, user: decoded };
    } catch (error) {
      return { valid: false };
    }
  }
};

// Register auth IPC handlers
ipcMain.handle('auth:login', async (_, credentials) => {
  return await authHandler.login(credentials);
});

ipcMain.handle('auth:logout', async () => {
  return await authHandler.logout();
});

ipcMain.handle('auth:verify-token', async (_, token) => {
  return await authHandler.verifyToken(token);
});