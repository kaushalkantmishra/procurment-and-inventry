// Authentication service for Electron IPC communication

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Mock authentication for development
      const { email, password } = credentials;
      
      // Check mock credentials
      if ((email === 'admin@company.com' && password === 'admin123') ||
          (email === 'employee@company.com' && password === 'employee123')) {
        
        const user = {
          id: '1',
          name: email === 'admin@company.com' ? 'Admin User' : 'Employee User',
          email,
          role: email === 'admin@company.com' ? 'admin' as const : 'employee' as const,
          isActive: true
        };
        
        const token = 'mock-jwt-token';
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          user,
          token
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }
}

export const authService = new AuthService();