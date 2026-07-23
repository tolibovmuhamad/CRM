import { useTranslation } from 'react-i18next';
import type { AttendanceStatus } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Цвет отметки: был — зелёный, опоздал — «late», отсутствовал — красный. */
const statusTone: Record<AttendanceStatus, BadgeTone> = {
  present: 'success',
  late: 'late',
  absent: 'danger',
};

export interface AttendanceBadgeProps {
  status: AttendanceStatus;
}

/**
 * Ячейка журнала: короткий код отметки (Б/О/Н) цветом статуса. Полное название —
 * в `title`/`aria-label`, чтобы смысл не держался на одном цвете (доступность).
 */
export function AttendanceBadge({ status }: AttendanceBadgeProps) {
  const { t } = useTranslation();
  const label = t(`journal.status.${status}`);

  return (
    <Badge tone={statusTone[status]} title={label} aria-label={label} className="justify-center">
      {t(`journal.statusShort.${status}`)}
    </Badge>
  );
}
