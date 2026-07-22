import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ResourceTypeIcon,
  useCourse,
  useCourseResources,
  type CourseResource,
  type ResourceType,
} from '@/entities/course';
import { formatDate } from '@/shared/lib/date';
import { formatFileSize } from '@/shared/lib/fileSize';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import {
  Badge,
  Button,
  Card,
  type Column,
  DataTable,
  IconButton,
  Input,
  Pagination,
  Select,
  TableSkeleton,
} from '@/shared/ui';
import { ArrowLeftIcon, DownloadIcon, PlusIcon, SearchIcon } from '@/shared/ui/icons';

const PAGE_SIZE = 10;
const TYPES: ResourceType[] = ['pdf', 'image', 'ppt', 'word', 'doc', 'video'];

/** Ресурсы курса — файлы (макет Courses/Resources). */
export function CourseResourcesPage() {
  const { t, i18n } = useTranslation();
  const { id = '' } = useParams();

  const [search, setSearch] = useState('');
  const [type, setType] = useState<ResourceType | ''>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const course = useCourse(id);
  const { data, isPending, isError, refetch, isFetching } = useCourseResources({
    courseId: id,
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    type: type || undefined,
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || type);

  function resetFilters() {
    setSearch('');
    setType('');
    setPage(1);
  }

  const columns: Column<CourseResource>[] = [
    {
      key: 'name',
      header: t('resources.columns.name'),
      render: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <ResourceTypeIcon type={r.type} />
          <span className="truncate text-label text-ink">{r.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: t('resources.columns.type'),
      render: (r) => <Badge tone="neutral">{t(`resources.type.${r.type}`)}</Badge>,
    },
    {
      key: 'size',
      header: t('resources.columns.size'),
      render: (r) => (
        <span className="text-ink-secondary">{formatFileSize(r.sizeBytes, i18n.language)}</span>
      ),
    },
    {
      key: 'uploadedAt',
      header: t('resources.columns.uploadedAt'),
      render: (r) => (
        <span className="text-ink-secondary">{formatDate(r.uploadedAt, i18n.language)}</span>
      ),
    },
    {
      key: 'action',
      header: t('students.columns.action'),
      render: (r) => (
        <IconButton
          aria-label={t('resources.downloadAria', { name: r.name })}
          variant="text"
          size="sm"
          disabled
          title={t('resources.downloadSoon')}
        >
          <DownloadIcon size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          to="/courses"
          className="inline-flex w-fit items-center gap-2 text-body text-ink-secondary transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ArrowLeftIcon size={16} />
          {t('nav.courses')}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-h3 text-ink">
            {course.data ? t('resources.title', { name: course.data.name }) : t('resources.heading')}
          </h1>
          <Button leftIcon={<PlusIcon size={18} />} disabled title={t('resources.addSoon')}>
            {t('resources.addNew')}
          </Button>
        </div>
      </div>

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
          placeholder={t('resources.searchPlaceholder')}
          aria-label={t('resources.searchPlaceholder')}
        />
        <Select
          selectSize="lg"
          value={type}
          onChange={(e) => {
            setType(e.target.value as ResourceType | '');
            setPage(1);
          }}
          aria-label={t('resources.columns.type')}
        >
          <option value="">{t('resources.allTypes')}</option>
          {TYPES.map((value) => (
            <option key={value} value={value}>
              {t(`resources.type.${value}`)}
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
          <p className="text-body text-danger-fg">{t('resources.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'resources.emptyFiltered' : 'resources.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'resources.emptyFilteredHint' : 'resources.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(r) => r.id} />
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
