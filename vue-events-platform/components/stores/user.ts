import { defineStore } from 'pinia';
import type { User, UserLogin, UserRegistration } from '../../types/index';

interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user && !!state.token,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    userName: (state): string => state.user?.name || '',
    userEmail: (state): string => state.user?.email || ''
  },

  actions: {
    async register(userData: UserRegistration) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ success: boolean; data?: User; token?: string; message?: string }>('/api/auth/register', {
          method: 'POST',
          body: userData
        });

        if (response.success && response.data && response.token) {
          this.user = response.data;
          this.token = response.token;
          
          // Сохраняем токен в cookie
          const tokenCookie = useCookie('auth-token');
          tokenCookie.value = response.token;
          
          return { success: true, message: response.message || 'Регистрация успешна' };
        } else {
          this.error = response.message || 'Ошибка регистрации';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = 'Ошибка сети при регистрации';
        return { success: false, message: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async login(credentials: UserLogin) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await $fetch<{ success: boolean; data?: User; token?: string; message?: string }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        });

        if (response.success && response.data && response.token) {
          this.user = response.data;
          this.token = response.token;
          
          // Сохраняем токен в cookie
          const tokenCookie = useCookie('auth-token');
          tokenCookie.value = response.token;
          
          return { success: true, message: response.message || 'Вход выполнен успешно' };
        } else {
          this.error = response.message || 'Неверные учетные данные';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = 'Ошибка сети при входе';
        return { success: false, message: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      
      // Удаляем токен из cookie
      const tokenCookie = useCookie('auth-token');
      tokenCookie.value = null;
      
      await navigateTo('/login');
    },

    setUser(user: User) {
      this.user = user;
    },

    clearError() {
      this.error = null;
    },

    // Инициализация пользователя из токена при загрузке приложения
    async initializeFromToken() {
      const tokenCookie = useCookie('auth-token');
      
      if (!tokenCookie.value) {
        return;
      }

      try {
        const response = await $fetch<{ success: boolean; data?: User }>('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`
          }
        });

        if (response.success && response.data) {
          this.user = response.data;
          this.token = tokenCookie.value;
        } else {
          // Токен недействителен, удаляем его
          tokenCookie.value = null;
        }
      } catch (error) {
        console.error('Failed to initialize user from token:', error);
        tokenCookie.value = null;
      }
    }
  }
});
