import { z } from 'zod';
import { roleSchema } from './auth';
import { idSchema, isoDateSchema, paginationQuerySchema } from './common';

/** Пользователи системы (макет Administration/User). Модель совпадает с AuthUser. */
export const usersQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  role: roleSchema.optional(),
});
export type UsersQuery = z.input<typeof usersQuerySchema>;

/** Тип действия в журнале (макет Administration/Logs). */
export const logActionSchema = z.enum(['create', 'update', 'delete', 'login', 'send']);
export type LogAction = z.infer<typeof logActionSchema>;

/** Запись журнала действий: кто, что сделал, над чем и когда. */
export const logEntrySchema = z.object({
  id: idSchema,
  userName: z.string().min(1),
  action: logActionSchema,
  target: z.string().min(1),
  createdAt: isoDateSchema,
});
export type LogEntry = z.infer<typeof logEntrySchema>;

export const logsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  action: logActionSchema.optional(),
});
export type LogsQuery = z.input<typeof logsQuerySchema>;
