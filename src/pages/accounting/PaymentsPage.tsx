import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  PaymentStatusBadge,
  usePayments,
  usePaymentStats,
  type Payment,
  type PaymentStatus,
} from '@/entities/payment';
import { api, queryKeys } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { formatSomoni } from '@/shared/lib/money';
import {
  Badge,
  Button,
  Card,
  type Column,
  DataTable,
  Pagination,
  Select,
  StatCard,
  TableSkeleton,
} from '@/shared/ui';

const PAGE_SIZE = 8;
const STATUSES: PaymentStatus[] = ['paid', 'pending'];

/** Платежи (макет Accounting → Payments). Первый экран раздела «Бухгалтерия». */
export function PaymentsPage() {
  const { t, i18n } = useTranslation();

  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isPending, isError, refetch, isFetching } = usePayments({
    page,
    pageSize: PAGE_SIZE,
    status: status || undefined,
    sortBy: 'date',
    sortDir: 'desc',
  });
  const stats = usePaymentStats();

  // Имена студентов — платёж хранит только studentId.
  const students = useQuery({
    queryKey: queryKeys.students.list({ pageSize: 100 }),
    queryFn: () => api.getStudents({ pageSize: 100 }),
  });
  const nameById = new Map(students.data?.items.map((s) => [s.id, s.fullName]));

  const items = data?.items ?? [];
  const hasFilters = Boolean(status);

  function resetFilters() {
    setStatus('');
    setPage(1);
  }

  // Повтор тянет и имена студентов, и сводку — они грузятся отдельными запросами.
  function retry() {
    void refetch();
    void stats.refetch();
    void students.refetch();
  }

  const columns: Column<Payment>[] = [
    {
      key: 'student',
      header: t('accounting.columns.student'),
      render: (p) => (
        <span className="text-label text-ink">
          {nameById.get(p.studentId) ?? <span className="text-ink-muted">—</span>}
        </span>
      ),
    },
    {
      key: 'date',
      header: t('accounting.columns.date'),
      render: (p) => <span className="text-ink-secondary">{formatDate(p.date, i18n.language)}</span>,
    },
    {
      key: 'type',
      header: t('accounting.columns.type'),
      render: (p) => <Badge tone="neutral">{t(`accounting.type.${p.type}`)}</Badge>,
    },
    {
      key: 'amount',
      header: t('accounting.columns.amount'),
      render: (p) => <span className="text-label text-success-fg">{formatSomoni(p.amount)}</span>,
    },
    {
      key: 'status',
      header: t('accounting.columns.status'),
      render: (p) => <PaymentStatusBadge status={p.status} />,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-h3 text-ink">{t('accounting.payments')}</h1>

      <div className="grid gap-3 sm:max-w-2xl sm:grid-cols-3">
        <StatCard
          label={t('accounting.stats.collected')}
          value={stats.data ? formatSomoni(stats.data.collected) : undefined}
          toneClassName="bg-success"
        />
        <StatCard
          label={t('accounting.stats.pending')}
          value={stats.data ? formatSomoni(stats.data.pending) : undefined}
          toneClassName="bg-warning"
        />
        <StatCard label={t('accounting.stats.count')} value={stats.data?.count} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          selectSize="lg"
          className="sm:max-w-xs"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as PaymentStatus | '');
            setPage(1);
          }}
          aria-label={t('accounting.columns.status')}
        >
          <option value="">{t('accounting.allStatuses')}</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {t(`accounting.status.${value}`)}
            </option>
          ))}
        </Select>
      </div>

      {isPending ? (
        <Card>
          <TableSkeleton rows={6} columns={5} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('accounting.loadError')}</p>
          <Button variant="secondaryOutline" onClick={retry}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'accounting.emptyFiltered' : 'accounting.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'accounting.emptyFilteredHint' : 'accounting.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(p) => p.id} />
        </Card>
      )}

      {data && (
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
