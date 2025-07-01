
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true, // Start with loading true to check for persisted user
      error: null,
      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const loggedInUser = await authService.login(username, password);
          if (loggedInUser) {
            set({ user: loggedInUser, loading: false });
            return true;
          }
          throw new Error("Invalid credentials");
        } catch (err) {
          const error = err instanceof Error ? err.message : "An unknown error occurred.";
          set({ error, loading: false, user: null });
          return false;
        }
      },
      logout: () => {
        authService.logout();
        set({ user: null, error: null });
      },
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        if(state) state.setLoading(false);
      }
    }
  )
);

// This will be called once when the app loads to handle the initial loading state.
useAuthStore.getState().setLoading(false);