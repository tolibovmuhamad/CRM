import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  GroupCard,
  GroupStatusBadge,
  useGroups,
  type Group,
  type GroupStatus,
} from '@/entities/group';
import { api, queryKeys } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { formatDateRange } from '@/shared/lib/date';
import { formatScheduleDays } from '@/shared/lib/schedule';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { useIsMobile } from '@/shared/lib/useMediaQuery';
import {
  Badge,
  Button,
  Card,
  type Column,
  DataTable,
  IconButton,
  Input,
  Pagination,
  SegmentedControl,
  Select,
  TableSkeleton,
} from '@/shared/ui';
import {
  DeleteIcon,
  EditIcon,
  GridViewIcon,
  ListViewIcon,
  PlusIcon,
  SearchIcon,
} from '@/shared/ui/icons';
import { useGroupsViewStore } from '@/features/groups-view/useGroupsViewStore';

const PAGE_SIZE = 8;
const STATUSES: GroupStatus[] = ['planned', 'active', 'finished'];

/** Список групп (макет Groups/Grid и Groups/List). */
export function GroupsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const storedView = useGroupsViewStore((s) => s.view);
  const setView = useGroupsViewStore((s) => s.setView);
  const isMobile = useIsMobile();
  // На 360px таблицы групп в макете нет — там плитка.
  const view = isMobile ? 'grid' : storedView;

  const [search, setSearch] = useState('');
  const [branchId, setBranchId] = useState('');
  const [status, setStatus] = useState<GroupStatus | ''>('');
  const [courseId, setCourseId] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, refetch, isFetching } = useGroups({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    branchId: branchId || undefined,
    status: status || undefined,
    courseId: courseId || undefined,
  });

  const branches = useQuery({
    queryKey: queryKeys.branches.list({ pageSize: 100 }),
    queryFn: () => api.getBranches({ pageSize: 100 }),
  });
  const courses = useQuery({
    queryKey: queryKeys.courses.list({ pageSize: 100 }),
    queryFn: () => api.getCourses({ pageSize: 100 }),
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || branchId || status || courseId);

  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function resetFilters() {
    setSearch('');
    setBranchId('');
    setStatus('');
    setCourseId('');
    setPage(1);
  }

  const openGroup = (group: Group) => navigate(`/groups/${group.id}`);
  const openJournal = (group: Group) => navigate(`/journal?group=${group.id}`);

  const columns: Column<Group>[] = [
    {
      key: 'name',
      header: t('groups.columns.name'),
      render: (g) => (
        <button
          type="button"
          onClick={() => openGroup(g)}
          className="text-label text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {g.name}
        </button>
      ),
    },
    {
      key: 'period',
      header: t('groups.columns.period'),
      render: (g) => (
        <span className="text-ink-secondary">
          {formatDateRange(g.startDate, g.endDate, i18n.language)}
        </span>
      ),
    },
    {
      key: 'mentor',
      header: t('groups.columns.mentor'),
      render: (g) => g.mentorName ?? <span className="text-ink-muted">—</span>,
    },
    {
      key: 'students',
      header: t('groups.columns.students'),
      render: (g) => (
        <Badge tone="neutral">
          {g.studentCount}/{g.capacity}
        </Badge>
      ),
    },
    {
      key: 'passing',
      header: t('groups.passingStudents'),
      render: (g) => (
        <Badge tone="brand">
          {g.passingCount}/{g.studentCount}
        </Badge>
      ),
    },
    {
      key: 'schedule',
      header: t('groups.columns.schedule'),
      render: (g) => (
        <span className="text-ink-secondary">
          {formatScheduleDays(g.scheduleDays, t)}
          {g.lessonTime ? ` · ${g.lessonTime}` : ''}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('students.columns.status'),
      render: (g) => <GroupStatusBadge status={g.status} />,
    },
    {
      key: 'action',
      header: t('students.columns.action'),
      render: (g) => (
        <div className="flex items-center gap-1">
          <IconButton
            aria-label={t('groups.editAria', { name: g.name })}
            variant="text"
            size="sm"
            onClick={() => navigate(`/groups/${g.id}`)}
          >
            <EditIcon size={18} />
          </IconButton>
          <IconButton
            aria-label={t('groups.deleteAria', { name: g.name })}
            variant="text"
            size="sm"
            className="text-danger-fg"
            onClick={() => undefined}
            disabled
            title={t('groups.deleteSoon')}
          >
            <DeleteIcon size={18} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h3 text-ink">{t('nav.groups')}</h1>
        <Button leftIcon={<PlusIcon size={18} />} disabled title={t('groups.addSoon')}>
          {t('groups.addNew')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            type="search"
            inputSize="lg"
            value={search}
            onChange={(e) => change(setSearch)(e.target.value)}
            leftIcon={<SearchIcon size={18} />}
            placeholder={t('groups.searchPlaceholder')}
            aria-label={t('groups.searchPlaceholder')}
          />
          <Select
            selectSize="lg"
            value={branchId}
            onChange={(e) => change(setBranchId)(e.target.value)}
            aria-label={t('students.form.branch')}
          >
            <option value="">{t('students.form.branch')}</option>
            {branches.data?.items.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
          <Select
            selectSize="lg"
            value={status}
            onChange={(e) => change(setStatus)(e.target.value as GroupStatus | '')}
            aria-label={t('students.columns.status')}
          >
            <option value="">{t('students.columns.status')}</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`groups.status.${value}`)}
              </option>
            ))}
          </Select>
          <Select
            selectSize="lg"
            value={courseId}
            onChange={(e) => change(setCourseId)(e.target.value)}
            aria-label={t('students.filters.course')}
          >
            <option value="">{t('students.filters.course')}</option>
            {courses.data?.items.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </Select>
        </div>

        {!isMobile && (
          <SegmentedControl
            aria-label={t('groups.viewAria')}
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
          <TableSkeleton rows={6} columns={6} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('groups.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'groups.emptyFiltered' : 'groups.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'groups.emptyFilteredHint' : 'groups.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : view === 'list' ? (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(g) => g.id} />
        </Card>
      ) : (
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
            isFetching && 'opacity-60 transition-opacity',
          )}
        >
          {items.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onOpen={openGroup}
              onOpenJournal={openJournal}
              onEdit={openGroup}
              onDelete={() => undefined}
            />
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
