import { create } from 'zustand';
import { authService, type User } from '../services/auth.service';
import { moduleService, type Module } from '../services/module.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  modules: Module[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  loadUserModules: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  modules: [],

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        const modules = await moduleService.getUserModules(response.user.user_type);
        
        set({
          user: response.user,
          isAuthenticated: true,
          modules,
          isLoading: false
        });
        
        return { success: true };
      } else {
        set({ isLoading: false });
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        message: 'An error occurred during login' 
      };
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      modules: []
    });
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token');
    set({
      user: null,
      isAuthenticated: false,
      modules: []
    });
  },

  loadUserModules: async () => {
    const { user } = get();
    if (user) {
      const modules = await moduleService.getUserModules(user.user_type);
      set({ modules });
    }
  },

  initializeAuth: () => {
    const user = authService.getCurrentUserFromStorage();
    const isAuthenticated = authService.isAuthenticated();
    
    if (user && isAuthenticated) {
      set({ user, isAuthenticated });
      // Load modules for authenticated user
      moduleService.getUserModules(user.user_type).then(modules => {
        set({ modules });
      });
    }
  }
}));