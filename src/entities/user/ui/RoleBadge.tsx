import { useTranslation } from 'react-i18next';
import type { Role } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Цвет чипа роли. Подписи — из общего словаря `roles.*`. */
const roleTone: Record<Role, BadgeTone> = {
  admin: 'brand',
  manager: 'info',
  mentor: 'success',
  developer: 'warning',
  student: 'neutral',
};

export interface RoleBadgeProps {
  role: Role;
}

/** Чип роли пользователя. */
export function RoleBadge({ role }: RoleBadgeProps) {
  const { t } = useTranslation();
  return <Badge tone={roleTone[role]}>{t(`roles.${role}`)}</Badge>;
}
