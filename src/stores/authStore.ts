import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { AuthUser, LoginInput } from '@/types/user';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: LoginInput) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post<{
            token: string;
            user: AuthUser;
          }>('/auth/login', { email, password });
          
          set({ 
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            loading: false
          });
          toast.success('Logged in successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ 
            error: errorMessage,
            loading: false 
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {

          const response = await api.post<{
            token: string;
            user: AuthUser;
          }>('/auth/register', {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
          });
          
          set({ 
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            loading: false
          });
          toast.success('Account created successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set({ 
            error: errorMessage,
            loading: false 
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: () => {
        document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        });

        toast.success('Logged out successfully!');
      },

      initialize: async () => {
        const { token, user } = get();
        
        if (token && user) {
          try {
            // Verify token with backend
            const response = await api.get('/auth/verify');
            
            if (!response.data.valid) {
              throw new Error('Session expired');
            }

            set({
              isAuthenticated: true,
              loading: false
            });
          } catch (error) {
            get().logout();
          }
        } else {
          set({ loading: false });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
);

// Optional: Add a hook for easy access to auth state
export const useAuth = () => {
  const state = useAuthStore();
  
  return {
    ...state,
    isEmployer: state.user?.role === 'employer',
    isJobSeeker: state.user?.role === 'job_seeker'
  };
};