import { z } from 'zod';
import { idSchema, isoDateSchema, paginationQuerySchema } from './common';

/** Аудитория рассылки (макет SMS mailings: Group, Students, Leads, Graduates, Mentors). */
export const smsAudienceSchema = z.enum(['group', 'students', 'leads', 'graduates', 'mentors']);
export type SmsAudience = z.infer<typeof smsAudienceSchema>;

/** Статус отправленной рассылки. */
export const smsStatusSchema = z.enum(['sent', 'queued', 'failed']);
export type SmsStatus = z.infer<typeof smsStatusSchema>;

/** Шаблон сообщения (макет Templates). */
export const smsTemplateSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  text: z.string().min(1),
});
export type SmsTemplate = z.infer<typeof smsTemplateSchema>;
export const smsTemplatesSchema = z.array(smsTemplateSchema);

/** Отправленная рассылка (строка истории). */
export const smsMailingSchema = z.object({
  id: idSchema,
  audience: smsAudienceSchema,
  groupId: idSchema.optional(),
  groupName: z.string().optional(),
  recipientCount: z.number().int().nonnegative(),
  text: z.string().min(1),
  status: smsStatusSchema,
  createdAt: isoDateSchema,
});
export type SmsMailing = z.infer<typeof smsMailingSchema>;

export const smsMailingsQuerySchema = paginationQuerySchema.extend({
  audience: smsAudienceSchema.optional(),
});
export type SmsMailingsQuery = z.input<typeof smsMailingsQuerySchema>;

/** Запрос числа получателей выбранной аудитории. */
export const smsAudienceInputSchema = z.object({
  audience: smsAudienceSchema,
  groupId: idSchema.optional(),
});
export type SmsAudienceInput = z.input<typeof smsAudienceInputSchema>;

export const smsAudienceCountSchema = z.object({
  count: z.number().int().nonnegative(),
});
export type SmsAudienceCount = z.infer<typeof smsAudienceCountSchema>;

/** Отправка рассылки. Сообщения валидации — ключи i18n (ТЗ §10). */
export const sendSmsDtoSchema = z.object({
  audience: smsAudienceSchema,
  groupId: idSchema.optional(),
  text: z.string().trim().min(1, 'sms.errors.textRequired').max(500, 'sms.errors.textTooLong'),
});
export type SendSmsDto = z.infer<typeof sendSmsDtoSchema>;
