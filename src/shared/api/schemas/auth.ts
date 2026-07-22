import { z } from 'zod';
import { idSchema, isoDateSchema, phoneSchema } from './common';

/**
 * Роль в системе. Четыре первых — должности сотрудников из макета (chips
 * Admin/Manager/Mentor/Developer), пятая — студент (в макете есть Profile/Student
 * и форма Sign up с телефоном родителя).
 */
export const roleSchema = z.enum(['admin', 'manager', 'mentor', 'developer', 'student']);
export type Role = z.infer<typeof roleSchema>;

/** Пользователь текущей сессии. */
export const authUserSchema = z.object({
  id: idSchema,
  fullName: z.string().min(1),
  phone: phoneSchema,
  role: roleSchema,
  avatarUrl: z.string().url().optional(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

/** Сессия: токен + пользователь. Именно это лежит в хранилище между перезагрузками. */
export const sessionSchema = z.object({
  token: z.string().min(1),
  user: authUserSchema,
});
export type Session = z.infer<typeof sessionSchema>;

/**
 * Сообщения валидации — это ключи i18n, а не готовый текст: форма прогоняет
 * `message` через `t`, иначе ошибку не перевести на три языка (ТЗ §10).
 */
const requiredPhone = z
  .string()
  .trim()
  .min(1, 'auth.errors.phoneRequired')
  .refine((value) => value.replace(/\D/g, '').length >= 9, 'auth.errors.phoneFormat');

const requiredText = (key: string) => z.string().trim().min(1, key);

/** Вход по телефону и паролю (макет Log in). */
export const loginDtoSchema = z.object({
  phone: requiredPhone,
  password: z.string().min(1, 'auth.errors.passwordRequired'),
});
export type LoginDto = z.infer<typeof loginDtoSchema>;

/**
 * Заявка на обучение (макет Sign up). Поля ровно те, что нарисованы; аккаунт
 * не создаётся — заявку разбирает менеджер (решение заказчика от 21.07.2026).
 */
export const signupDtoSchema = z.object({
  firstName: requiredText('auth.errors.firstNameRequired'),
  lastName: requiredText('auth.errors.lastNameRequired'),
  birthDate: requiredText('auth.errors.birthDateRequired').refine(
    (value) => new Date(value) <= new Date(),
    'auth.errors.birthDateFuture',
  ),
  address: requiredText('auth.errors.addressRequired'),
  phone: requiredPhone,
  parentPhone: requiredPhone,
  password: z.string().min(6, 'auth.errors.passwordShort'),
});
export type SignupDto = z.infer<typeof signupDtoSchema>;

/** Принятая заявка — то, что показываем на экране успеха. */
export const signupRequestSchema = z.object({
  id: idSchema,
  fullName: z.string().min(1),
  phone: phoneSchema,
  parentPhone: phoneSchema,
  birthDate: isoDateSchema,
  address: z.string().min(1),
  createdAt: isoDateSchema,
});
export type SignupRequest = z.infer<typeof signupRequestSchema>;
