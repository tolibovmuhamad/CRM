/** Публичный API сущности «SMS-рассылка». */
export { useSmsTemplates, useSmsMailings, useSmsAudienceCount, useSendSms } from './api/useSms';
export { SmsStatusBadge, type SmsStatusBadgeProps } from './ui/SmsStatusBadge';
export type {
  SmsAudience,
  SmsMailing,
  SmsMailingsQuery,
  SmsStatus,
  SmsTemplate,
} from '@/shared/api';
