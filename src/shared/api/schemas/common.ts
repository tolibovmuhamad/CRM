import { z } from 'zod';

/**
 * Общие примитивы схем (ТЗ §6: Zod — единственный источник типов).
 */

export const idSchema = z.string().min(1);
export const phoneSchema = z.string().min(3);
/** ISO-строка даты/времени. */
export const isoDateSchema = z.string();
/** Деньги в дирамах — целое неотрицательное (ТЗ §9). */
export const diramSchema = z.number().int().nonnegative();

/** Дни занятий. В макете подписи короткие: Mn, Tu, Wd… Общие для групп и курсов. */
export const weekdaySchema = z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
export type Weekday = z.infer<typeof weekdaySchema>;

export const sortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof sortDirectionSchema>;

/** База пагинации: входит в query каждого списка (ТЗ §6). */
export const paginationQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});
export type PaginationQuery = z.input<typeof paginationQuerySchema>;

/** Страница результатов. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Схема-обёртка страницы под конкретный элемент — для валидации ответа. */
export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });
