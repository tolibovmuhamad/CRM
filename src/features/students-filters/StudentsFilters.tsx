import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api, queryKeys, type ContractStatus } from '@/shared/api';
import { Input, Select } from '@/shared/ui';
import { SearchIcon } from '@/shared/ui/icons';
import type { StudentsFiltersValue } from './filters';

export interface StudentsFiltersProps {
  value: StudentsFiltersValue;
  onChange: (value: StudentsFiltersValue) => void;
  /** В виде «плитка» фильтра по контракту в макете нет. */
  withContract?: boolean;
}

const CONTRACT_OPTIONS: ContractStatus[] = ['active', 'ending_soon', 'finished'];

/** Панель фильтров списка студентов (макет: поиск, Course, Group, Contract). */
export function StudentsFilters({ value, onChange, withContract = true }: StudentsFiltersProps) {
  const { t } = useTranslation();

  // Справочники для селектов: короткие списки, одна страница.
  const courses = useQuery({
    queryKey: queryKeys.courses.list({ pageSize: 100 }),
    queryFn: () => api.getCourses({ pageSize: 100 }),
  });
  const groups = useQuery({
    queryKey: queryKeys.groups.list({ pageSize: 100 }),
    queryFn: () => api.getGroups({ pageSize: 100 }),
  });

  const set = (patch: Partial<StudentsFiltersValue>) => onChange({ ...value, ...patch });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        type="search"
        inputSize="lg"
        value={value.search}
        onChange={(e) => set({ search: e.target.value })}
        leftIcon={<SearchIcon size={18} />}
        placeholder={t('students.searchPlaceholder')}
        aria-label={t('students.searchPlaceholder')}
      />

      <Select
        selectSize="lg"
        value={value.courseId}
        onChange={(e) => set({ courseId: e.target.value })}
        aria-label={t('students.filters.course')}
      >
        <option value="">{t('students.filters.course')}</option>
        {courses.data?.items.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </Select>

      <Select
        selectSize="lg"
        value={value.groupId}
        onChange={(e) => set({ groupId: e.target.value })}
        aria-label={t('students.filters.group')}
      >
        <option value="">{t('students.filters.group')}</option>
        {groups.data?.items.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Select>

      {withContract && (
        <Select
          selectSize="lg"
          value={value.contractStatus}
          onChange={(e) => set({ contractStatus: e.target.value as ContractStatus | '' })}
          aria-label={t('students.filters.contract')}
        >
          <option value="">{t('students.filters.contract')}</option>
          {CONTRACT_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {t(`students.contract.${status}`)}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
