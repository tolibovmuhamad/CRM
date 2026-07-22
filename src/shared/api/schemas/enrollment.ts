import { z } from 'zod';
import { idSchema, isoDateSchema, paginationQuerySchema, phoneSchema } from './common';

/**
 * Запись студента в группу (макет Enroll students). Экран показывает, кто и когда
 * записался: график по месяцам плюс таблица.
 */
export const enrollmentSchema = z.object({
  id: idSchema,
  studentId: idSchema,
  fullName: z.string().min(1),
  groupId: idSchema,
  groupName: z.string().min(1),
  mentorName: z.string().optional(),
  phone: phoneSchema,
  enrolledAt: isoDateSchema,
});
export type Enrollment = z.infer<typeof enrollmentSchema>;

export const enrollmentsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  groupId: idSchema.optional(),
  /** Месяц в виде `YYYY-MM` — селект «Month» в макете. */
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
});
export type EnrollmentsQuery = z.input<typeof enrollmentsQuerySchema>;

/** Точка графика: месяц года и число записавшихся. */
export const enrollmentPointSchema = z.object({
  /** 1–12. */
  month: z.number().int().min(1).max(12),
  count: z.number().int().nonnegative(),
});

export const enrollmentStatsSchema = z.object({
  year: z.number().int(),
  total: z.number().int().nonnegative(),
  points: z.array(enrollmentPointSchema),
});
export type EnrollmentStats = z.infer<typeof enrollmentStatsSchema>;
