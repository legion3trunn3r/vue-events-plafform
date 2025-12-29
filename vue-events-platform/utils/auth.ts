import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User, JWTPayload } from '../types/index';

export class AuthUtils {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_EXPIRES_IN = '7d';

  /**
   * Хеширование пароля
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Проверка пароля
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Генерация JWT токена
   */
  static generateToken(user: User): string {
    const config = useRuntimeConfig();
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  /**
   * Проверка и декодирование JWT токена
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const config = useRuntimeConfig();
      return jwt.verify(token, config.jwtSecret) as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Извлечение токена из заголовка Authorization
   */
  static extractTokenFromHeader(authorization?: string): string | null {
    if (!authorization) return null;
    
    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1] || null;
  }

  /**
   * Проверка, является ли пользователь администратором
   */
  static isAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  /**
   * Проверка роли пользователя
   */
  static hasRole(user: User, requiredRole: string): boolean {
    if (requiredRole === 'client') {
      return user.role === 'client' || user.role === 'admin';
    }
    return user.role === requiredRole;
  }

  /**
   * Валидация email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Валидация пароля
   */
  static isValidPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    
    if (password.length > 50) {
      return { valid: false, message: 'Пароль не должен превышать 50 символов' };
    }
    
    return { valid: true };
  }

  /**
   * Генерация случайного QR кода
   */
  static generateQRCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Очистка пользовательских данных (удаление пароля)
   */
  static sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
