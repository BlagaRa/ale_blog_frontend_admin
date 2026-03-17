import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout:()=>Promise<boolean>
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password,
      });
      
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentification error!';
      set({ isLoading: false, error: message });
      return false;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await axios.post(`${baseUrl}/api/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      localStorage.removeItem('token');
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      localStorage.removeItem('token');
      set({ isLoading: false, error: 'Sesiunea a fost inchisa local.' });
      return true; 
    }
  }
}));