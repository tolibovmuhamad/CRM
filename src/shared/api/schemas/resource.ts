import { z } from 'zod';
import { idSchema, isoDateSchema, paginationQuerySchema, sortDirectionSchema } from './common';

/**
 * Тип файла ресурса. Набор — ровно тот, что нарисован в макете рядом с
 * Courses/Resources: pdf · image · ppt · doc · video · word.
 */
export const resourceTypeSchema = z.enum(['pdf', 'image', 'ppt', 'doc', 'video', 'word']);
export type ResourceType = z.infer<typeof resourceTypeSchema>;

/** Файл-ресурс курса (макет Courses/Resources). */
export const courseResourceSchema = z.object({
  id: idSchema,
  courseId: idSchema,
  name: z.string().min(1),
  type: resourceTypeSchema,
  /** Размер в байтах — выводится через `shared/lib/fileSize`. */
  sizeBytes: z.number().int().nonnegative(),
  uploadedAt: isoDateSchema,
});
export type CourseResource = z.infer<typeof courseResourceSchema>;

export const courseResourcesQuerySchema = paginationQuerySchema.extend({
  courseId: idSchema.optional(),
  search: z.string().optional(),
  type: resourceTypeSchema.optional(),
  sortBy: z.enum(['name', 'uploadedAt', 'sizeBytes']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type CourseResourcesQuery = z.input<typeof courseResourcesQuerySchema>;
