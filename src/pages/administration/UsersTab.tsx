import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleBadge, useUsers, type AuthUser, type Role } from '@/entities/user';
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
const ROLES: Role[] = ['admin', 'manager', 'mentor', 'developer', 'student'];

/** Вкладка «Пользователи» (макет Administration/User). */
export function UsersTab() {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const { data, isPending, isError, refetch, isFetching } = useUsers({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    role: role || undefined,
  });

  const items = data?.items ?? [];
  const hasFilters = Boolean(debouncedSearch || role);

  function resetFilters() {
    setSearch('');
    setRole('');
    setPage(1);
  }

  const columns: Column<AuthUser>[] = [
    {
      key: 'name',
      header: t('admin.users.columns.name'),
      render: (u) => <span className="text-label text-ink">{u.fullName}</span>,
    },
    {
      key: 'phone',
      header: t('admin.users.columns.phone'),
      render: (u) => <span className="text-ink-secondary">{u.phone}</span>,
    },
    {
      key: 'role',
      header: t('admin.users.columns.role'),
      render: (u) => <RoleBadge role={u.role} />,
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
          placeholder={t('admin.users.searchPlaceholder')}
          aria-label={t('admin.users.searchPlaceholder')}
        />
        <Select
          selectSize="lg"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as Role | '');
            setPage(1);
          }}
          aria-label={t('admin.users.columns.role')}
        >
          <option value="">{t('admin.users.allRoles')}</option>
          {ROLES.map((value) => (
            <option key={value} value={value}>
              {t(`roles.${value}`)}
            </option>
          ))}
        </Select>
      </div>

      {isPending ? (
        <Card>
          <TableSkeleton rows={5} columns={3} />
        </Card>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('admin.users.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'admin.users.emptyFiltered' : 'admin.users.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'admin.users.emptyFilteredHint' : 'admin.users.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <Card className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <DataTable columns={columns} rows={items} getRowKey={(u) => u.id} />
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
