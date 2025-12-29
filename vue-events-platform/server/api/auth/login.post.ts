import { db } from '../../../utils/database';
import { AuthUtils } from '../../../utils/auth';
import type { UserLogin, ApiResponse } from '../../../types';

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    // Получаем данные из тела запроса
    const body = await readBody(event) as UserLogin;
    const { email, password } = body;

    // Валидация входных данных
    if (!email || !password) {
      return {
        success: false,
        error: 'Email и пароль обязательны для заполнения'
      };
    }

    // Ищем пользователя по email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return {
        success: false,
        error: 'Неверные учетные данные'
      };
    }

    // Проверяем пароль (предполагаем, что в базе есть поле password)
    const isPasswordValid = await AuthUtils.comparePassword(password, (user as any).password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Неверные учетные данные'
      };
    }

    // Генерируем токен
    const token = AuthUtils.generateToken(user);

    // Очищаем пользователя от пароля для ответа
    const sanitizedUser = AuthUtils.sanitizeUser(user);

    return {
      success: true,
      data: sanitizedUser,
      token,
      message: 'Вход выполнен успешно'
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Внутренняя ошибка сервера'
    };
  }
});
