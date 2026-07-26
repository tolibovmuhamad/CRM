import { useTranslation } from 'react-i18next';
import type { Position } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Цвет чипа должности (макет: chips Admin/Manager/Mentor/Developer). */
const positionTone: Record<Position, BadgeTone> = {
  admin: 'brand',
  manager: 'info',
  mentor: 'success',
  developer: 'warning',
};

export interface PositionBadgeProps {
  position: Position;
}

/** Чип должности. Подписи берём из общего словаря ролей — слова совпадают. */
export function PositionBadge({ position }: PositionBadgeProps) {
  const { t } = useTranslation();
  return <Badge tone={positionTone[position]}>{t(`roles.${position}`)}</Badge>;
}
