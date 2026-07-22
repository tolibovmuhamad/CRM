import { z } from 'zod';
import { idSchema, isoDateSchema, paginationQuerySchema, sortDirectionSchema } from './common';

/** Трудоустройство выпускника (в макете — теги #Work, #OpenToWork, #Freelancer, #FurtherEducation). */
export const employmentStatusSchema = z.enum([
  'employed',
  'open_to_work',
  'freelancer',
  'further_edu',
]);
export type EmploymentStatus = z.infer<typeof employmentStatusSchema>;

export const graduateSchema = z.object({
  id: idSchema,
  studentId: idSchema,
  fullName: z.string().min(1),
  age: z.number().int().positive().optional(),
  /** «Date of Issue» — дата выдачи сертификата. */
  issuedAt: isoDateSchema,
  employmentStatus: employmentStatusSchema,
  /** Место работы: заполнено у employed и freelancer. */
  workPlace: z.string().optional(),
  /** Серия сертификата — по ней тоже ищут («Search by name, serial»). */
  serial: z.string().min(1),
  certificateUrl: z.string().optional(),
  courseId: idSchema.optional(),
  groupId: idSchema.optional(),
  groupName: z.string().optional(),
});
export type Graduate = z.infer<typeof graduateSchema>;

export const graduatesQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  employmentStatus: employmentStatusSchema.optional(),
  courseId: idSchema.optional(),
  groupId: idSchema.optional(),
  /** Выпущенные не раньше этой даты (фильтр «Date» в макете). */
  issuedFrom: isoDateSchema.optional(),
  sortBy: z.enum(['fullName', 'issuedAt']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type GraduatesQuery = z.input<typeof graduatesQuerySchema>;

/** Счётчики над таблицей: всего и по видам трудоустройства. */
export const graduateStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  employed: z.number().int().nonnegative(),
  openToWork: z.number().int().nonnegative(),
  freelancer: z.number().int().nonnegative(),
  furtherEdu: z.number().int().nonnegative(),
});
export type GraduateStats = z.infer<typeof graduateStatsSchema>;
