import { AuthUtils } from '../utils/auth';
import type { User } from '../types/index';

export default defineNuxtRouteMiddleware((to, from) => {
  // Разрешаем доступ к страницам логина и регистрации без аутентификации
  if (to.path === '/login' || to.path === '/register') {
    return;
  }

  const token = useCookie('auth-token');
  
  if (!token.value) {
    return navigateTo('/login');
  }

  // Проверяем валидность токена
  const payload = AuthUtils.verifyToken(token.value);
  
  if (!payload) {
    // Токен недействителен, удаляем его и перенаправляем на логин
    token.value = null;
    return navigateTo('/login');
  }

  // Сохраняем информацию о пользователе в сторе
  const userStore = useUserStore();
  userStore.setUser({
    id: payload.userId,
    email: payload.email,
    role: payload.role as 'client' | 'admin',
    name: '',
    created_at: new Date(),
    updated_at: new Date()
  });
});
