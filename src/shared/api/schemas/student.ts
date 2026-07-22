import { z } from 'zod';
import {
  idSchema,
  isoDateSchema,
  paginationQuerySchema,
  phoneSchema,
  sortDirectionSchema,
} from './common';

/**
 * Статус студента. Active/Inactive ставит менеджер в форме, Finished система
 * ставит сама по окончании обучения (решение заказчика от 21.07.2026) — поэтому
 * в форме доступны только первые два, а в списке встречаются все три.
 */
export const studentStatusSchema = z.enum(['active', 'no_active', 'finished']);
export type StudentStatus = z.infer<typeof studentStatusSchema>;

/** Статусы, которые можно выставить руками в форме. */
export const editableStudentStatuses = ['active', 'no_active'] as const;

/** Статус контракта (из макета: Active / N day left / Finished). */
export const contractStatusSchema = z.enum(['active', 'ending_soon', 'finished']);
export type ContractStatus = z.infer<typeof contractStatusSchema>;

/** Пол (в макете — подпись Male/Famale на карточке; опечатку Figma не тащим). */
export const genderSchema = z.enum(['male', 'female']);
export type Gender = z.infer<typeof genderSchema>;

/**
 * Дополнительный телефон с подписью (в форме — список «Phones»). Из подписей и
 * складывается поповер Student/Father в списке.
 */
export const studentPhoneSchema = z.object({
  value: phoneSchema,
  description: z.string().optional(),
});
export type StudentPhone = z.infer<typeof studentPhoneSchema>;

/**
 * Группа студента в том виде, в каком её показывает список: имя и период.
 * Данные вложены в ответ, чтобы карточка не тянула группы отдельным запросом.
 */
export const studentGroupRefSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});
export type StudentGroupRef = z.infer<typeof studentGroupRefSchema>;

export const studentSchema = z.object({
  id: idSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  /** Собирается бэкендом из фамилии и имени — списки и поиск работают с ним. */
  fullName: z.string().min(1),
  phone: phoneSchema,
  /** Дополнительные телефоны с подписями («Отец», «Мать»). */
  phones: z.array(studentPhoneSchema).default([]),
  email: z.string().email().optional(),
  address: z.string().optional(),
  telegramUsername: z.string().optional(),
  branchId: idSchema.optional(),
  notes: z.string().optional(),
  /** Записи в группы делаются на экране Enroll students, не в форме студента. */
  groups: z.array(studentGroupRefSchema).default([]),
  courseId: idSchema.optional(),
  status: studentStatusSchema,
  hasAccount: z.boolean(),
  contractStatus: contractStatusSchema,
  /** Дней до конца контракта — для статуса ending_soon. */
  contractDaysLeft: z.number().int().nonnegative().optional(),
  enrolledAt: isoDateSchema,
  /** Дата рождения — из неё считается возраст на карточке («23 year»). */
  birthDate: isoDateSchema.optional(),
  gender: genderSchema.optional(),
  avatarUrl: z.string().optional(),
  /** Отметка «премиум» (корона в списке). */
  isPremium: z.boolean().default(false),
});
export type Student = z.infer<typeof studentSchema>;

/** ФИО в том порядке, в каком его показывает макет: сначала фамилия. */
export const buildFullName = (firstName: string, lastName: string) =>
  `${lastName} ${firstName}`.trim();

export const studentsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  courseId: idSchema.optional(),
  groupId: idSchema.optional(),
  contractStatus: contractStatusSchema.optional(),
  sortBy: z.enum(['fullName', 'enrolledAt']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type StudentsQuery = z.input<typeof studentsQuerySchema>;

/**
 * DTO формы «Add new student» / «Edit profile». Поля — ровно те, что нарисованы;
 * курса и группы здесь нет намеренно, запись в группу идёт через Enroll students.
 *
 * Сообщения — ключи i18n (как в схемах авторизации): форма прогоняет их через `t`.
 */
export const createStudentDtoSchema = z.object({
  firstName: z.string().trim().min(1, 'students.form.errors.firstNameRequired'),
  lastName: z.string().trim().min(1, 'students.form.errors.lastNameRequired'),
  birthDate: isoDateSchema.optional(),
  gender: genderSchema.optional(),
  address: z.string().optional(),
  email: z.string().trim().email('students.form.errors.emailInvalid').optional().or(z.literal('')),
  status: z.enum(editableStudentStatuses),
  phone: z
    .string()
    .trim()
    .min(1, 'students.form.errors.phoneRequired')
    .refine((v) => v.replace(/\D/g, '').length >= 9, 'students.form.errors.phoneFormat'),
  phones: z
    .array(
      z.object({
        value: z
          .string()
          .trim()
          .min(1, 'students.form.errors.phoneRequired')
          .refine((v) => v.replace(/\D/g, '').length >= 9, 'students.form.errors.phoneFormat'),
        description: z.string().optional(),
      }),
    )
    .default([]),
  branchId: idSchema.optional().or(z.literal('')),
  telegramUsername: z.string().optional(),
  notes: z.string().optional(),
  avatarUrl: z.string().optional(),
});
export type CreateStudentDto = z.input<typeof createStudentDtoSchema>;

/** Правка — те же поля; отправляем всегда целиком, поэтому схема та же. */
export const updateStudentDtoSchema = createStudentDtoSchema.partial();
export type UpdateStudentDto = z.input<typeof updateStudentDtoSchema>;
