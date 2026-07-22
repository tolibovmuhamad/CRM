import { useTranslation } from 'react-i18next';
import type { GroupStatus } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

const tones: Record<GroupStatus, BadgeTone> = {
  planned: 'info',
  active: 'success',
  finished: 'neutral',
};

/** Состояние группы: запланирована / идёт / завершена. */
export function GroupStatusBadge({ status }: { status: GroupStatus }) {
  const { t } = useTranslation();
  return <Badge tone={tones[status]}>{t(`groups.status.${status}`)}</Badge>;
}
