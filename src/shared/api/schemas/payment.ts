import { z } from 'zod';
import {
  diramSchema,
  idSchema,
  isoDateSchema,
  paginationQuerySchema,
  sortDirectionSchema,
} from './common';

export const paymentTypeSchema = z.enum(['tuition', 'other']);
export type PaymentType = z.infer<typeof paymentTypeSchema>;

export const paymentStatusSchema = z.enum(['paid', 'pending']);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const paymentSchema = z.object({
  id: idSchema,
  studentId: idSchema,
  /** Сумма в дирамах (ТЗ §9). */
  amount: diramSchema,
  date: isoDateSchema,
  type: paymentTypeSchema,
  status: paymentStatusSchema,
});
export type Payment = z.infer<typeof paymentSchema>;

export const paymentsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  studentId: idSchema.optional(),
  status: paymentStatusSchema.optional(),
  sortBy: z.enum(['date', 'amount']).optional(),
  sortDir: sortDirectionSchema.optional(),
});
export type PaymentsQuery = z.input<typeof paymentsQuerySchema>;
