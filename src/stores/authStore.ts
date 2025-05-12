import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser, verifyUser } from '@/lib/api';
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
          const response = await loginUser(email, password);
          
          set({ 
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false
          });
          toast.success('Logged in successfully!');
          //@ts-ignore
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
          const response = await registerUser(data.name, data.email, data.password ?? '', data.role);
          set({ 
            user: response.user,
            token: response.token,
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
        console.log('into initialize');
        if (token && user) {
          try {
            const response = await verifyUser(token as string);
            
            if (!response) {
              throw new Error('Session expired');
            }

            set({
              isAuthenticated: true,
              loading: false
            });
          } catch (error) {
            console.error('Error verifying user:', error);
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

export const useAuth = () => {
  const state = useAuthStore();
  
  return {
    ...state,
    isEmployer: state.user?.role === 'employer',
    isJobSeeker: state.user?.role === 'job_seeker'
  };
};