import { useTranslation } from 'react-i18next';
import type { SmsStatus } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Отправлено — зелёный, в очереди — синий, ошибка — красный. */
const statusTone: Record<SmsStatus, BadgeTone> = {
  sent: 'success',
  queued: 'info',
  failed: 'danger',
};

export interface SmsStatusBadgeProps {
  status: SmsStatus;
}

/** Статус рассылки в истории. */
export function SmsStatusBadge({ status }: SmsStatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <Badge tone={statusTone[status]} dot>
      {t(`sms.status.${status}`)}
    </Badge>
  );
}
