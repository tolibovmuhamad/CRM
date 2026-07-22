import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useEnrollments, useEnrollmentStats, type Enrollment } from '@/entities/enrollment';
import { api, queryKeys } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import {
  Button,
  Card,
  type Column,
  DataTable,
  Input,
  Pagination,
  Select,
  Skeleton,
  TableSkeleton,
} from '@/shared/ui';
import { SearchIcon } from '@/shared/ui/icons';
import { EnrollmentChart } from './EnrollmentChart';
import { toCsv, downloadCsv } from './exportCsv';

const PAGE_SIZE = 10;
const YEAR = 2024;

/** Записи в группы (макет Enroll students): график по месяцам, фильтры, таблица. */
export function EnrollPage() {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const [groupId, setGroupId] = useState('');
  const [month, setMonth] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const stats = useEnrollmentStats(YEAR);
  const { data, isPending, isError, refetch, isFetching } = useEnrollments({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    groupId: groupId || undefined,
    month: month || undefined,
  });

  const groups = useQuery({
    queryKey: queryKeys.groups.list({ pageSize: 100 }),
    queryFn: () => api.getGroups({ pageSize: 100 }),
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || groupId || month);

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  /** Выгружаем то, что видно на экране с текущими фильтрами. */
  function exportCsv() {
    const rows = items.map((e) => [
      e.fullName,
      e.groupName,
      e.mentorName ?? '',
      e.phone,
      formatDate(e.enrolledAt, i18n.language),
    ]);
    const header = [
      t('enroll.columns.name'),
      t('students.filters.group'),
      t('enroll.columns.mentor'),
      t('students.columns.phone'),
      t('enroll.columns.date'),
    ];
    downloadCsv(`enrollments-${YEAR}.csv`, toCsv([header, ...rows]));
  }

  const columns: Column<Enrollment>[] = [
    { key: 'fullName', header: t('enroll.columns.name'), render: (e) => e.fullName },
    { key: 'groupName', header: t('students.filters.group'), render: (e) => e.groupName },
    {
      key: 'mentorName',
      header: t('enroll.columns.mentor'),
      render: (e) => e.mentorName ?? <span className="text-ink-muted">—</span>,
    },
    {
      key: 'phone',
      header: t('students.columns.phone'),
      render: (e) => <span className="text-ink-secondary">{e.phone}</span>,
    },
    {
      key: 'enrolledAt',
      header: t('enroll.columns.date'),
      render: (e) => formatDate(e.enrolledAt, i18n.language),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h3 text-ink">{t('nav.enroll')}</h1>
        <Button variant="secondaryOutline" onClick={exportCsv} disabled={items.length === 0}>
          {t('enroll.export')}
        </Button>
      </div>

      <Card className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-h5 text-ink">{t('enroll.chartTitle', { year: YEAR })}</h2>
          <p className="text-body text-ink-secondary">
            {t('enroll.chartTotal')}{' '}
            <strong className="text-ink">{stats.data?.total ?? '—'}</strong>
          </p>
        </div>

        {stats.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : stats.isError ? (
          <p className="py-8 text-center text-body text-danger-fg">{t('enroll.chartError')}</p>
        ) : (
          <EnrollmentChart stats={stats.data} />
        )}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          type="search"
          inputSize="lg"
          value={search}
          onChange={(e) => change(setSearch)(e.target.value)}
          leftIcon={<SearchIcon size={18} />}
          placeholder={t('students.searchPlaceholder')}
          aria-label={t('students.searchPlaceholder')}
        />
        <Select
          selectSize="lg"
          value={groupId}
          onChange={(e) => change(setGroupId)(e.target.value)}
          aria-label={t('students.filters.group')}
        >
          <option value="">{t('students.filters.group')}</option>
          {groups.data?.items.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>
        <Select
          selectSize="lg"
          value={month}
          onChange={(e) => change(setMonth)(e.target.value)}
          aria-label={t('enroll.filters.month')}
        >
          <option value="">{t('enroll.filters.month')}</option>
          {Array.from({ length: 12 }, (_, index) => {
            const value = `${YEAR}-${String(index + 1).padStart(2, '0')}`;
            return (
              <option key={value} value={value}>
                {t(`months.full.${index + 1}`)} {YEAR}
              </option>
            );
          })}
        </Select>
      </div>

      {isPending ? (
        <Card>
          <TableSkeleton rows={6} columns={5} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('enroll.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'enroll.emptyFiltered' : 'enroll.empty')}
          </p>
          <p className="text-body text-ink-secondary">{t('enroll.emptyHint')}</p>
          {hasFilters && (
            <Button
              variant="secondaryOutline"
              onClick={() => {
                setSearch('');
                setGroupId('');
                setMonth('');
                setPage(1);
              }}
            >
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(e) => e.id} />
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
