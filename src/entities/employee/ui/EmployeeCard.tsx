import { useTranslation } from 'react-i18next';
import type { Employee } from '@/shared/api';
import { Badge, Card } from '@/shared/ui';
import { EmployeeAvatar } from './EmployeeAvatar';
import { PositionBadge } from './PositionBadge';

export interface EmployeeCardProps {
  employee: Employee;
}

/**
 * Карточка сотрудника для списка (макет Employees/Grid). Аватар, ФИО, чип
 * должности; для менторов — уровень (компонент `Level`) и число групп.
 */
export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <EmployeeAvatar fullName={employee.fullName} avatarUrl={employee.avatarUrl} />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-h6 text-ink">{employee.fullName}</span>
          <PositionBadge position={employee.position} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-bodySm text-ink-secondary">
        {employee.level != null && (
          <Badge tone="info">{t('employees.level', { level: employee.level })}</Badge>
        )}
        <span className="flex items-center gap-1">
          {t('employees.groups')}
          <Badge tone="neutral">{employee.groupIds.length}</Badge>
        </span>
      </div>
    </Card>
  );
}
