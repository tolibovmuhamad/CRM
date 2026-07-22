import { z } from 'zod';
import { diramSchema, idSchema, paginationQuerySchema, sortDirectionSchema } from './common';

/** Должность сотрудника (из макета: chips Admin/Manager/Mentor/Developer). */
export const positionSchema = z.enum(['admin', 'manager', 'mentor', 'developer']);
export type Position = z.infer<typeof positionSchema>;

export const employeeSchema = z.object({
  id: idSchema,
  fullName: z.string().min(1),
  position: positionSchema,
  /** Уровень ментора (Level → ставка). */
  level: z.number().int().positive().optional(),
  groupIds: z.array(idSchema).default([]),
  /** Оклад в дирамах (ТЗ §9). */
  salary: diramSchema.optional(),
  avatarUrl: z.string().url().optional(),
});
export type Employee = z.infer<typeof employeeSchema>;

export const employeesQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  position: positionSchema.optional(),
  sortBy: z.enum(['fullName', 'level']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type EmployeesQuery = z.input<typeof employeesQuerySchema>;
