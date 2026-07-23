import { useTranslation } from 'react-i18next';
import { useStudents } from '@/entities/student';
import { useGroups } from '@/entities/group';
import { useEmployees } from '@/entities/employee';
import { usePaymentStats } from '@/entities/payment';
import { useEnrollmentStats } from '@/entities/enrollment';
import { EmploymentBadge, useGraduates } from '@/entities/graduate';
import { formatSomoni } from '@/shared/lib/money';
import { Button, Card, Skeleton, StatCard } from '@/shared/ui';
import { EnrollmentChart } from '@/pages/enroll/EnrollmentChart';
import { GroupIncomeChart } from './GroupIncomeChart';

/** Год для графика записей — тот же, что на экране Enroll students. */
const YEAR = 2024;

/**
 * Дашборд (макет Dashboard). Собран из готовых данных и компонентов: плитки-счётчики,
 * график записей по месяцам (переиспользован с Enroll), доход по группам, список
 * трудоустроенных выпускников. Полный набор графиков макета — по мере выгрузки.
 */
export function DashboardPage() {
  const { t } = useTranslation();

  const students = useStudents({ pageSize: 1 });
  const groups = useGroups({ pageSize: 100 });
  const employees = useEmployees({ pageSize: 1 });
  const payments = usePaymentStats();
  const enrollment = useEnrollmentStats(YEAR);
  const graduates = useGraduates({ employmentStatus: 'employed', pageSize: 5 });

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-h3 text-ink">{t('nav.dashboard')}</h1>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('dashboard.stats.students')} value={students.data?.total} />
        <StatCard label={t('dashboard.stats.groups')} value={groups.data?.total} />
        <StatCard label={t('dashboard.stats.employees')} value={employees.data?.total} />
        <StatCard
          label={t('dashboard.stats.collected')}
          value={payments.data ? formatSomoni(payments.data.collected) : undefined}
          toneClassName="bg-success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="flex flex-col gap-3 p-5">
          <h2 className="text-h5 text-ink">{t('dashboard.enrollTitle', { year: YEAR })}</h2>
          {enrollment.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : enrollment.isError ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-body text-danger-fg">{t('dashboard.loadError')}</p>
              <Button variant="secondaryOutline" onClick={() => void enrollment.refetch()}>
                {t('common.retry')}
              </Button>
            </div>
          ) : (
            <EnrollmentChart stats={enrollment.data} />
          )}
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <h2 className="text-h5 text-ink">{t('dashboard.incomeTitle')}</h2>
          {groups.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : groups.isError ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-body text-danger-fg">{t('dashboard.loadError')}</p>
              <Button variant="secondaryOutline" onClick={() => void groups.refetch()}>
                {t('common.retry')}
              </Button>
            </div>
          ) : (
            <GroupIncomeChart groups={groups.data.items} />
          )}
        </Card>
      </div>

      <Card className="flex flex-col gap-3 p-5">
        <h2 className="text-h5 text-ink">{t('dashboard.graduatesTitle')}</h2>
        {graduates.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : graduates.isError ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-body text-danger-fg">{t('dashboard.loadError')}</p>
            <Button variant="secondaryOutline" onClick={() => void graduates.refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : graduates.data.items.length === 0 ? (
          <p className="text-body text-ink-secondary">{t('dashboard.graduatesEmpty')}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {graduates.data.items.map((grad) => (
              <li key={grad.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-label text-ink">{grad.fullName}</span>
                  <span className="truncate text-bodySm text-ink-secondary">
                    {grad.workPlace ?? '—'}
                  </span>
                </div>
                <EmploymentBadge status={grad.employmentStatus} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
