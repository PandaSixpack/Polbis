import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
          // You might want to verify the token with an API call here
          // For now, we just assume it's valid if it exists
          set({ token, isAuthenticated: true });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
