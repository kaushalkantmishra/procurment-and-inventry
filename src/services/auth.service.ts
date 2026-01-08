// Authentication service for HTTP API communication
import { apiService } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  user_type: 'admin' | 'employee';
  is_active: boolean;
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
      const result = await apiService.login(credentials);
      
      if (result?.data?.user && result?.data?.token) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        return {
          success: true,
          user: result.data.user,
          token: result.data.token
        };
      } else {
        return {
          success: false,
          message: result?.message || 'Login failed'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please check your connection.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const result = await apiService.getCurrentUser();
      return result?.data || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return this.getCurrentUserFromStorage();
    }
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUserFromStorage();
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();