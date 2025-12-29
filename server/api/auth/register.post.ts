import { db } from '../../../utils/database';
import { AuthUtils } from '../../../utils/auth';
import type { UserRegistration, ApiResponse } from '../../../types';

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    // Получаем данные из тела запроса
    const body = await readBody(event) as UserRegistration;
    const { email, password, name, role } = body;

    // Валидация входных данных
    if (!email || !password || !name) {
      return {
        success: false,
        error: 'Все поля обязательны для заполнения'
      };
    }

    // Валидация email
    if (!AuthUtils.isValidEmail(email)) {
      return {
        success: false,
        error: 'Неверный формат email'
      };
    }

    // Валидация пароля
    const passwordValidation = AuthUtils.isValidPassword(password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message
      };
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error: 'Пользователь с таким email уже существует'
      };
    }

    // Хешируем пароль
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Создаем пользователя
    const newUser = await db.createUser({
      email,
      password: hashedPassword,
      name,
      role: role || 'client'
    });

    // Генерируем токен
    const token = AuthUtils.generateToken(newUser);

    // Очищаем пользователя от пароля для ответа
    const sanitizedUser = AuthUtils.sanitizeUser(newUser);

    return {
      success: true,
      data: sanitizedUser,
      token,
      message: 'Регистрация успешно завершена'
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Внутренняя ошибка сервера'
    };
  }
});
