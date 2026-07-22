import { useTranslation } from 'react-i18next';
import type { EmploymentStatus } from '@/shared/api';
import { Badge, type BadgeTone } from '@/shared/ui';

const tones: Record<EmploymentStatus, BadgeTone> = {
  employed: 'success',
  open_to_work: 'info',
  freelancer: 'brand',
  further_edu: 'warning',
};

/** Тег трудоустройства (в макете — #Work, #OpenToWork, #Freelancer, #FurtherEducation). */
export function EmploymentBadge({ status }: { status: EmploymentStatus }) {
  const { t } = useTranslation();
  return <Badge tone={tones[status]}>{t(`graduates.employment.${status}`)}</Badge>;
}
