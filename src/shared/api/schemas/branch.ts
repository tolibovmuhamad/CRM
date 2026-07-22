import { z } from 'zod';
import { idSchema, paginationQuerySchema } from './common';

/** Филиал (ТЗ §7; в макете — раздел Branches и селект Branch в формах). */
export const branchSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  address: z.string().optional(),
});
export type Branch = z.infer<typeof branchSchema>;

export const branchesQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
});
export type BranchesQuery = z.input<typeof branchesQuerySchema>;
