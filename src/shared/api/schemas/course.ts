import { z } from 'zod';
import {
  diramSchema,
  idSchema,
  paginationQuerySchema,
  sortDirectionSchema,
  weekdaySchema,
} from './common';

/**
 * Иконка курса — набор `Logo course` в макете (C#, C++, Frontend, Python,
 * HTML & CSS, UX/UI). В карточке рисуется кружком 56×56 с логотипом внутри.
 */
export const courseIconSchema = z.enum([
  'csharp',
  'cpp',
  'frontend',
  'python',
  'htmlcss',
  'uxui',
  'javascript',
  'react',
]);
export type CourseIcon = z.infer<typeof courseIconSchema>;

/**
 * Курс. Поля сняты с компонента `Course` (UI-Kit, 343×152): название,
 * «Groups: 12», иконка, дни занятий, длительность «3 month», «Fee: 1000 somoni».
 */
export const courseSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  icon: courseIconSchema,
  /** «Groups: 12» — сколько групп идёт по курсу. */
  groupCount: z.number().int().nonnegative(),
  studentCount: z.number().int().nonnegative(),
  scheduleDays: z.array(weekdaySchema).default([]),
  /** Длительность курса строкой, как в макете: «3 month». */
  duration: z.string().optional(),
  /** Стоимость курса в дирамах (ТЗ §9): «Fee: 1000 somoni». */
  fee: diramSchema,
  resourceCount: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
});
export type Course = z.infer<typeof courseSchema>;

export const coursesQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'studentCount', 'groupCount', 'fee']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type CoursesQuery = z.input<typeof coursesQuerySchema>;
