import { create } from 'zustand';
import { authService } from '../Services/auth';

export const useAuthStore = create((set) => ({
  error: null,
  loading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const success = await authService.login(email, password);
      if (success) set({ isAuthenticated: true });
      return success;
    } catch (error) {
      set({ error: error.message, isAuthenticated: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const success = await authService.register(username, email, password);
      if (success) set({ isAuthenticated: true });
      return success;
    } catch (error) {
      set({ error: error.message, isAuthenticated: false });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ isAuthenticated: false });
  },

  checkAuthStatus: () => {
    const isAuth = authService.isAuthenticated();
    set({ isAuthenticated: isAuth });
  },
}));
