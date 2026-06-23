import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Firebase authentication
      console.log('Login:', email);
      set({ isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },
  logout: async () => {
    // TODO: Implement Firebase logout
    set({ user: null });
  },
  setUser: (user) => set({ user }),
}));
