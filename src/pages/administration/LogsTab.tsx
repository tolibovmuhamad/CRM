import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogActionBadge, useLogs, type LogAction, type LogEntry } from '@/entities/log';
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
  TableSkeleton,
} from '@/shared/ui';
import { SearchIcon } from '@/shared/ui/icons';

const PAGE_SIZE = 8;
const ACTIONS: LogAction[] = ['create', 'update', 'delete', 'login', 'send'];

/** Вкладка «Журнал действий» (макет Administration/Logs). */
export function LogsTab() {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const [action, setAction] = useState<LogAction | ''>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, refetch, isFetching } = useLogs({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    action: action || undefined,
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || action);

  function resetFilters() {
    setSearch('');
    setAction('');
    setPage(1);
  }

  const columns: Column<LogEntry>[] = [
    {
      key: 'user',
      header: t('admin.logs.columns.user'),
      render: (l) => <span className="text-label text-ink">{l.userName}</span>,
    },
    {
      key: 'action',
      header: t('admin.logs.columns.action'),
      render: (l) => <LogActionBadge action={l.action} />,
    },
    {
      key: 'target',
      header: t('admin.logs.columns.target'),
      render: (l) => <span className="text-ink-secondary">{l.target}</span>,
    },
    {
      key: 'date',
      header: t('admin.logs.columns.date'),
      render: (l) => (
        <span className="whitespace-nowrap text-ink-secondary">
          {formatDate(l.createdAt, i18n.language)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:max-w-xl">
        <Input
          type="search"
          inputSize="lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<SearchIcon size={18} />}
          placeholder={t('admin.logs.searchPlaceholder')}
          aria-label={t('admin.logs.searchPlaceholder')}
        />
        <Select
          selectSize="lg"
          value={action}
          onChange={(e) => {
            setAction(e.target.value as LogAction | '');
            setPage(1);
          }}
          aria-label={t('admin.logs.columns.action')}
        >
          <option value="">{t('admin.logs.allActions')}</option>
          {ACTIONS.map((value) => (
            <option key={value} value={value}>
              {t(`admin.action.${value}`)}
            </option>
          ))}
        </Select>
      </div>

      {isPending ? (
        <Card>
          <TableSkeleton rows={6} columns={4} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('admin.logs.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'admin.logs.emptyFiltered' : 'admin.logs.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'admin.logs.emptyFilteredHint' : 'admin.logs.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(l) => l.id} />
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
    </div>
  );
}
