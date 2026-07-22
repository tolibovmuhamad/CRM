import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  EmploymentBadge,
  useGraduates,
  useGraduateStats,
  type EmploymentStatus,
  type Graduate,
} from '@/entities/graduate';
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
  StatCard,
  TableSkeleton,
} from '@/shared/ui';
import { SearchIcon } from '@/shared/ui/icons';

const PAGE_SIZE = 10;

const STATUSES: EmploymentStatus[] = ['employed', 'open_to_work', 'freelancer', 'further_edu'];

/** Выпускники (макет Graduates): счётчики, фильтры, таблица сертификатов. */
export function GraduatesPage() {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EmploymentStatus | ''>('');
  const [groupId, setGroupId] = useState('');
  const [issuedFrom, setIssuedFrom] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const stats = useGraduateStats();
  const { data, isPending, isError, refetch, isFetching } = useGraduates({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    employmentStatus: status || undefined,
    groupId: groupId || undefined,
    issuedFrom: issuedFrom || undefined,
  });

  const groups = useQuery({
    queryKey: queryKeys.groups.list({ pageSize: 100 }),
    queryFn: () => api.getGroups({ pageSize: 100 }),
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || status || groupId || issuedFrom);

  /** Любая смена фильтра возвращает на первую страницу. */
  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function resetFilters() {
    setSearch('');
    setStatus('');
    setGroupId('');
    setIssuedFrom('');
    setPage(1);
  }

  const columns: Column<Graduate>[] = [
    { key: 'fullName', header: t('graduates.columns.name'), render: (g) => g.fullName },
    {
      key: 'age',
      header: t('graduates.columns.age'),
      render: (g) => g.age ?? <span className="text-ink-muted">—</span>,
    },
    {
      key: 'issuedAt',
      header: t('graduates.columns.issuedAt'),
      render: (g) => formatDate(g.issuedAt, i18n.language),
    },
    {
      key: 'workPlace',
      header: t('graduates.columns.workPlace'),
      render: (g) => (
        <span className="flex flex-wrap items-center gap-2">
          <EmploymentBadge status={g.employmentStatus} />
          {g.workPlace && <span className="text-ink-secondary">{g.workPlace}</span>}
        </span>
      ),
    },
    { key: 'serial', header: t('graduates.columns.serial'), render: (g) => g.serial },
    {
      key: 'certificate',
      header: t('graduates.columns.certificate'),
      render: (g) => (
        <Button
          variant="text"
          size="sm"
          // Файлы сертификатов появятся вместе с бэкендом — пока показываем серию.
          disabled={!g.certificateUrl}
          title={g.certificateUrl ? undefined : t('graduates.certificateSoon')}
        >
          {t('graduates.openCertificate')}
        </Button>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-h3 text-ink">{t('nav.graduates')}</h1>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={t('graduates.stats.total')} value={stats.data?.total} />
        <StatCard
          label={t('graduates.employment.employed')}
          value={stats.data?.employed}
          toneClassName="bg-success"
        />
        <StatCard
          label={t('graduates.employment.open_to_work')}
          value={stats.data?.openToWork}
          toneClassName="bg-info"
        />
        <StatCard
          label={t('graduates.employment.freelancer')}
          value={stats.data?.freelancer}
          toneClassName="bg-brand"
        />
        <StatCard
          label={t('graduates.employment.further_edu')}
          value={stats.data?.furtherEdu}
          toneClassName="bg-warning"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Input
          type="search"
          inputSize="lg"
          value={search}
          onChange={(e) => change(setSearch)(e.target.value)}
          leftIcon={<SearchIcon size={18} />}
          placeholder={t('graduates.searchPlaceholder')}
          aria-label={t('graduates.searchPlaceholder')}
        />
        <Select
          selectSize="lg"
          value={status}
          onChange={(e) => change(setStatus)(e.target.value as EmploymentStatus | '')}
          aria-label={t('graduates.filters.status')}
        >
          <option value="">{t('graduates.filters.status')}</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {t(`graduates.employment.${value}`)}
            </option>
          ))}
        </Select>
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
        <Input
          type="date"
          inputSize="lg"
          value={issuedFrom}
          onChange={(e) => change(setIssuedFrom)(e.target.value)}
          aria-label={t('graduates.filters.issuedFrom')}
        />
      </div>

      {isPending ? (
        <Card>
          <TableSkeleton rows={6} columns={6} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('graduates.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'graduates.emptyFiltered' : 'graduates.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'graduates.emptyFilteredHint' : 'graduates.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(g) => g.id} />
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
