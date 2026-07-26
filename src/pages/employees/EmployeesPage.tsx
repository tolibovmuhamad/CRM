import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmployeeAvatar,
  EmployeeCard,
  PositionBadge,
  useEmployees,
  type Employee,
  type Position,
} from '@/entities/employee';
import { cn } from '@/shared/lib/cn';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { useIsMobile } from '@/shared/lib/useMediaQuery';
import {
  Badge,
  Button,
  Card,
  type Column,
  DataTable,
  Input,
  Pagination,
  SegmentedControl,
  Select,
  TableSkeleton,
} from '@/shared/ui';
import { GridViewIcon, ListViewIcon, PlusIcon, SearchIcon } from '@/shared/ui/icons';
import { useEmployeesViewStore } from '@/features/employees-view/useEmployeesViewStore';

const PAGE_SIZE = 8;
const POSITIONS: Position[] = ['admin', 'manager', 'mentor', 'developer'];

/** Список сотрудников и менторов (макет Employees/Grid и Employees/List). */
export function EmployeesPage() {
  const { t } = useTranslation();

  const storedView = useEmployeesViewStore((s) => s.view);
  const setView = useEmployeesViewStore((s) => s.setView);
  const isMobile = useIsMobile();
  // На узких экранах таблицы сотрудников в макете нет — только плитка.
  const view = isMobile ? 'grid' : storedView;

  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<Position | ''>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, refetch, isFetching } = useEmployees({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    position: position || undefined,
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || position);

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function resetFilters() {
    setSearch('');
    setPosition('');
    setPage(1);
  }

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: t('employees.columns.name'),
      render: (e) => (
        <div className="flex items-center gap-3">
          <EmployeeAvatar fullName={e.fullName} avatarUrl={e.avatarUrl} size="sm" />
          <span className="text-label text-ink">{e.fullName}</span>
        </div>
      ),
    },
    {
      key: 'position',
      header: t('employees.columns.position'),
      render: (e) => <PositionBadge position={e.position} />,
    },
    {
      key: 'level',
      header: t('employees.columns.level'),
      render: (e) =>
        e.level != null ? (
          <Badge tone="info">{t('employees.level', { level: e.level })}</Badge>
        ) : (
          <span className="text-ink-muted">—</span>
        ),
    },
    {
      key: 'groups',
      header: t('employees.columns.groups'),
      render: (e) => <Badge tone="neutral">{e.groupIds.length}</Badge>,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h3 text-ink">{t('nav.employees')}</h1>
        <Button leftIcon={<PlusIcon size={18} />} disabled title={t('employees.addSoon')}>
          {t('employees.addNew')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:max-w-xl">
          <Input
            type="search"
            inputSize="lg"
            value={search}
            onChange={(e) => change(setSearch)(e.target.value)}
            leftIcon={<SearchIcon size={18} />}
            placeholder={t('employees.searchPlaceholder')}
            aria-label={t('employees.searchPlaceholder')}
          />
          <Select
            selectSize="lg"
            value={position}
            onChange={(e) => change(setPosition)(e.target.value as Position | '')}
            aria-label={t('employees.columns.position')}
          >
            <option value="">{t('employees.allPositions')}</option>
            {POSITIONS.map((value) => (
              <option key={value} value={value}>
                {t(`roles.${value}`)}
              </option>
            ))}
          </Select>
        </div>

        {!isMobile && (
          <SegmentedControl
            aria-label={t('employees.viewAria')}
            value={storedView}
            onChange={setView}
            items={[
              { value: 'grid', label: t('students.viewGrid'), content: <GridViewIcon size={18} /> },
              { value: 'list', label: t('students.viewList'), content: <ListViewIcon size={18} /> },
            ]}
          />
        )}
      </div>

      {isPending ? (
        <Card>
          <TableSkeleton rows={6} columns={4} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('employees.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'employees.emptyFiltered' : 'employees.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'employees.emptyFilteredHint' : 'employees.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : view === 'list' ? (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(e) => e.id} />
        </Card>
      ) : (
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
            isFetching && 'opacity-60 transition-opacity',
          )}
        >
          {items.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
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
