import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CourseCard, CourseIcon, useCourses, type Course } from '@/entities/course';
import { cn } from '@/shared/lib/cn';
import { formatSomoni } from '@/shared/lib/money';
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
  TableSkeleton,
} from '@/shared/ui';
import { EditIcon, GridViewIcon, ListViewIcon, PlusIcon, SearchIcon } from '@/shared/ui/icons';
import { useCoursesViewStore } from '@/features/courses-view/useCoursesViewStore';

const PAGE_SIZE = 8;

/** Список курсов (макет Courses/Grid и Courses/List). */
export function CoursesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const storedView = useCoursesViewStore((s) => s.view);
  const setView = useCoursesViewStore((s) => s.setView);
  const isMobile = useIsMobile();
  // На узких экранах таблицы курсов в макете нет — только плитка.
  const view = isMobile ? 'grid' : storedView;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, refetch, isFetching } = useCourses({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch);

  function resetFilters() {
    setSearch('');
    setPage(1);
  }

  /** По названию курса открываем его ресурсы — единственный экран курса в макете. */
  const openResources = (course: Course) => navigate(`/courses/${course.id}/resources`);
  // Формы правки курса в макете нет — появится вместе с ней.
  const noop = () => undefined;

  const columns: Column<Course>[] = [
    {
      key: 'name',
      header: t('courses.columns.name'),
      render: (c) => (
        <div className="flex items-center gap-3">
          <CourseIcon icon={c.icon} className="h-9 w-9 text-bodySm" />
          <button
            type="button"
            onClick={() => openResources(c)}
            className="text-label text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {c.name}
          </button>
        </div>
      ),
    },
    {
      key: 'groups',
      header: t('courses.columns.groups'),
      render: (c) => <Badge tone="neutral">{c.groupCount}</Badge>,
    },
    {
      key: 'students',
      header: t('courses.columns.students'),
      render: (c) => <Badge tone="brand">{c.studentCount}</Badge>,
    },
    {
      key: 'schedule',
      header: t('courses.columns.schedule'),
      render: (c) => (
        <span className="text-ink-secondary">{formatScheduleDays(c.scheduleDays, t)}</span>
      ),
    },
    {
      key: 'duration',
      header: t('courses.columns.duration'),
      render: (c) => c.duration ?? <span className="text-ink-muted">—</span>,
    },
    {
      key: 'fee',
      header: t('courses.columns.fee'),
      render: (c) => <span className="text-label text-success-fg">{formatSomoni(c.fee)}</span>,
    },
    {
      key: 'action',
      header: t('students.columns.action'),
      render: (c) => (
        <IconButton
          aria-label={t('courses.editAria', { name: c.name })}
          variant="text"
          size="sm"
          onClick={noop}
        >
          <EditIcon size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h3 text-ink">{t('nav.courses')}</h1>
        <Button leftIcon={<PlusIcon size={18} />} disabled title={t('courses.addSoon')}>
          {t('courses.addNew')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          inputSize="lg"
          className="sm:max-w-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<SearchIcon size={18} />}
          placeholder={t('courses.searchPlaceholder')}
          aria-label={t('courses.searchPlaceholder')}
        />

        {!isMobile && (
          <SegmentedControl
            aria-label={t('courses.viewAria')}
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
          <p className="text-body text-danger-fg">{t('courses.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'courses.emptyFiltered' : 'courses.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'courses.emptyFilteredHint' : 'courses.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : view === 'list' ? (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(c) => c.id} />
        </Card>
      ) : (
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
            isFetching && 'opacity-60 transition-opacity',
          )}
        >
          {items.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={openResources} onEdit={noop} />
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
