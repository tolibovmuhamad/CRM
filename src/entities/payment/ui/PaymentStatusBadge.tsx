import { useTranslation } from 'react-i18next';
import type { PaymentStatus } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Оплачено — зелёный, ожидается — жёлтый. */
const statusTone: Record<PaymentStatus, BadgeTone> = {
  paid: 'success',
  pending: 'warning',
};

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

/** Статус платежа (макет: chips Paid / Pending). */
export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <Badge tone={statusTone[status]} dot>
      {t(`accounting.status.${status}`)}
    </Badge>
  );
}
