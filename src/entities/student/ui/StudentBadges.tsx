import { useTranslation } from 'react-i18next';
import type { ContractStatus, Student, StudentStatus } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

/** Статус студента: Active / No Active / Finished. */
export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const { t } = useTranslation();
  return (
    <Badge tone={status === 'active' ? 'success' : 'neutral'}>
      {t(`students.status.${status}`)}
    </Badge>
  );
}

/**
 * Контракт: Active / N day left / Finished. Число дней — из `contractDaysLeft`,
 * поэтому бейдж берёт студента целиком, а не один статус.
 */
export function ContractBadge({ student }: { student: Student }) {
  const { t } = useTranslation();
  const { contractStatus, contractDaysLeft } = student;

  const label =
    contractStatus === 'ending_soon' && contractDaysLeft != null
      ? t('students.contract.daysLeft', { count: contractDaysLeft })
      : t(`students.contract.${contractStatus}`);

  return <Badge tone={contractTone(contractStatus)}>{label}</Badge>;
}

function contractTone(status: ContractStatus): BadgeTone {
  if (status === 'active') return 'success';
  if (status === 'ending_soon') return 'late';
  return 'danger';
}
