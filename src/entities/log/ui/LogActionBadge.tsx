import { useTranslation } from 'react-i18next';
import type { LogAction } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Цвет по типу действия: создание — зелёный, удаление — красный и т. д. */
const actionTone: Record<LogAction, BadgeTone> = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  login: 'neutral',
  send: 'brand',
};

export interface LogActionBadgeProps {
  action: LogAction;
}

/** Чип типа действия в журнале. */
export function LogActionBadge({ action }: LogActionBadgeProps) {
  const { t } = useTranslation();
  return <Badge tone={actionTone[action]}>{t(`admin.action.${action}`)}</Badge>;
}
