import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ContractBadge,
  StudentCard,
  StudentName,
  StudentPhone,
  StudentStatusBadge,
  useDeleteStudent,
  useStudents,
  type Student,
} from '@/entities/student';
import {
  emptyStudentsFilters,
  StudentsFilters,
  type StudentsFiltersValue,
} from '@/features/students-filters';
import { useStudentsViewStore } from '@/features/students-view/useStudentsViewStore';
import { cn } from '@/shared/lib/cn';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { useIsMobile } from '@/shared/lib/useMediaQuery';
import {
  Button,
  Card,
  type Column,
  DataTable,
  IconButton,
  Pagination,
  SegmentedControl,
  Skeleton,
  TableSkeleton,
} from '@/shared/ui';
import { DeleteIcon, EditIcon, GridViewIcon, ListViewIcon, PlusIcon } from '@/shared/ui/icons';
import { DeleteStudentDialog } from './DeleteStudentDialog';

const PAGE_SIZE = 10;

/** Список студентов (макет Students/List и Students/Grid). */
export function StudentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storedView = useStudentsViewStore((s) => s.view);
  const setView = useStudentsViewStore((s) => s.setView);
  const isMobile = useIsMobile();
  // На 360px таблица годится только для горизонтальной прокрутки, поэтому в
  // мобильном макете список нарисован плиткой — её и показываем.
  const view = isMobile ? 'grid' : storedView;

  const [filters, setFilters] = useState<StudentsFiltersValue>(emptyStudentsFilters);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Student | null>(null);

  const search = useDebouncedValue(filters.search);
  const { data, isPending, isError, refetch, isFetching } = useStudents({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    courseId: filters.courseId || undefined,
    groupId: filters.groupId || undefined,
    contractStatus: filters.contractStatus || undefined,
  });

  const deleteStudent = useDeleteStudent();
  const items = data?.items ?? [];
  const hasFilters = search !== '' || filters.courseId !== '' || filters.groupId !== '';

  /** Смена фильтра возвращает на первую страницу: иначе можно остаться на пустой. */
  function changeFilters(next: StudentsFiltersValue) {
    setFilters(next);
    setPage(1);
  }

  function confirmDelete() {
    if (!toDelete) return;
    deleteStudent.mutate(toDelete.id, { onSuccess: () => setToDelete(null) });
  }

  const columns: Column<Student>[] = [
    {
      key: 'fullName',
      header: t('students.columns.name'),
      render: (s, index) => (
        <StudentName
          fullName={s.fullName}
          isPremium={s.isPremium}
          index={(page - 1) * PAGE_SIZE + index + 1}
        />
      ),
    },
    {
      key: 'groups',
      header: t('students.columns.groups'),
      render: (s) =>
        s.groups.length > 0 ? (
          s.groups.map((g) => g.name).join(', ')
        ) : (
          <span className="text-ink-muted">—</span>
        ),
    },
    {
      key: 'phone',
      header: t('students.columns.phone'),
      render: (s) => <StudentPhone student={s} />,
    },
    {
      key: 'status',
      header: t('students.columns.status'),
      render: (s) => <StudentStatusBadge status={s.status} />,
    },
    {
      key: 'account',
      header: t('students.columns.account'),
      render: (s) => t(s.hasAccount ? 'common.yes' : 'common.no'),
    },
    {
      key: 'contract',
      header: t('students.columns.contract'),
      render: (s) => <ContractBadge student={s} />,
    },
    {
      key: 'action',
      header: t('students.columns.action'),
      render: (s) => (
        <div className="flex items-center gap-1">
          <IconButton
            aria-label={t('students.editAria', { name: s.fullName })}
            variant="text"
            size="sm"
            onClick={() => navigate(`/students/${s.id}/edit`)}
          >
            <EditIcon size={18} />
          </IconButton>
          <IconButton
            aria-label={t('students.deleteAria', { name: s.fullName })}
            variant="text"
            size="sm"
            className="text-danger-fg"
            onClick={() => setToDelete(s)}
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
        <h1 className="text-h3 text-ink">{t('nav.students')}</h1>
        <Button leftIcon={<PlusIcon size={18} />} onClick={() => navigate('/students/new')}>
          {t('students.addNew')}
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <StudentsFilters
            value={filters}
            onChange={changeFilters}
            withContract={view === 'list'}
          />
        </div>
        {/* На мобайле выбирать нечего — там всегда плитка, поэтому переключателя нет. */}
        {!isMobile && (
          <SegmentedControl
            aria-label={t('students.viewAria')}
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
        <LoadingState view={view} />
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('students.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'students.emptyFiltered' : 'students.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'students.emptyFilteredHint' : 'students.emptyHint')}
          </p>
          {hasFilters ? (
            <Button variant="secondaryOutline" onClick={() => changeFilters(emptyStudentsFilters)}>
              {t('students.resetFilters')}
            </Button>
          ) : (
            <Button leftIcon={<PlusIcon size={18} />} onClick={() => navigate('/students/new')}>
              {t('students.addNew')}
            </Button>
          )}
        </Card>
      ) : view === 'list' ? (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(s) => s.id} />
        </Card>
      ) : (
        // Сетка карточек: 1 колонка на мобайле, 3 на десктопе — как в макете.
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
            isFetching && 'opacity-60 transition-opacity',
          )}
        >
          {items.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={(s) => navigate(`/students/${s.id}/edit`)}
              onOpenGroup={(groupId) => navigate(`/groups/${groupId}`)}
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

      <DeleteStudentDialog
        student={toDelete}
        pending={deleteStudent.isPending}
        error={deleteStudent.isError}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

/** Скелет под текущий вид: таблица или плитка. */
function LoadingState({ view }: { view: 'list' | 'grid' }) {
  if (view === 'list') {
    return (
      <Card>
        <TableSkeleton rows={6} columns={6} />
      </Card>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index} className="flex flex-col gap-4 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </Card>
      ))}
    </div>
  );
}
