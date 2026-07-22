import { z } from 'zod';
import {
  diramSchema,
  idSchema,
  isoDateSchema,
  paginationQuerySchema,
  sortDirectionSchema,
  weekdaySchema,
} from './common';

/** Состояние группы (фильтр «Status» в макете). */
export const groupStatusSchema = z.enum(['planned', 'active', 'finished']);
export type GroupStatus = z.infer<typeof groupStatusSchema>;

export const groupSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  courseId: idSchema,
  mentorId: idSchema.optional(),
  mentorName: z.string().optional(),
  branchId: idSchema.optional(),
  status: groupStatusSchema,
  studentCount: z.number().int().nonnegative(),
  /** Мест в группе — в макете счётчик вида «7/15». */
  capacity: z.number().int().positive(),
  /** Успевающие («Passing students» в макете). */
  passingCount: z.number().int().nonnegative(),
  /** Доход группы в дирамах (ТЗ §9). */
  income: diramSchema,
  absentCount: z.number().int().nonnegative(),
  lateCount: z.number().int().nonnegative(),
  scheduleDays: z.array(weekdaySchema).default([]),
  /** Время занятия, «16:00 - 18:00». */
  lessonTime: z.string().optional(),
  /** Длительность курса для этой группы, «1 month». */
  duration: z.string().optional(),
  /** Период обучения — в макете под названием группы («Apr 9, 2023 - Aug 10, 2023»). */
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});
export type Group = z.infer<typeof groupSchema>;

export const groupsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  courseId: idSchema.optional(),
  mentorId: idSchema.optional(),
  branchId: idSchema.optional(),
  status: groupStatusSchema.optional(),
  sortBy: z.enum(['name', 'studentCount', 'income']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type GroupsQuery = z.input<typeof groupsQuerySchema>;
