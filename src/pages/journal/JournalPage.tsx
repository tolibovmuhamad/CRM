import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { AttendanceBadge, useJournal } from '@/entities/journal';
import { api, queryKeys, type AttendanceStatus } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { Button, Card, Select, Skeleton, StatCard } from '@/shared/ui';

/** Ключ ячейки журнала. */
const cellKey = (studentId: string, date: string) => `${studentId}|${date}`;

/**
 * Журнал посещаемости группы (макет Journal). Студенты × даты занятий, в ячейках —
 * отметка присутствия; над таблицей — счётчики Present / Absent / Late.
 * Оценки (Progressbook) ждут макета компонента `Week`.
 */
export function JournalPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const groupsQuery = useQuery({
    queryKey: queryKeys.groups.list({ pageSize: 100 }),
    queryFn: () => api.getGroups({ pageSize: 100 }),
  });
  const groupItems = useMemo(() => groupsQuery.data?.items ?? [], [groupsQuery.data]);

  const [groupId, setGroupId] = useState(searchParams.get('group') ?? '');
  // Пока группа не выбрана — берём первую из списка, чтобы журнал не был пустым.
  useEffect(() => {
    if (!groupId && groupItems.length) setGroupId(groupItems[0].id);
  }, [groupId, groupItems]);

  function selectGroup(id: string) {
    setGroupId(id);
    setSearchParams(id ? { group: id } : {}, { replace: true });
  }

  const { data, isPending, isError, refetch, isFetching } = useJournal(groupId);

  const byCell = new Map<string, AttendanceStatus>();
  data?.entries.forEach((e) => byCell.set(cellKey(e.studentId, e.date), e.status));

  const loading = groupsQuery.isPending || (Boolean(groupId) && isPending);
  // Ошибка любого из запросов: без списка групп журнал тоже не показать.
  const errored = groupsQuery.isError || isError;

  function retry() {
    void groupsQuery.refetch();
    void refetch();
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-h3 text-ink">{t('nav.journal')}</h1>
        <Select
          selectSize="lg"
          className="sm:max-w-xs"
          value={groupId}
          onChange={(e) => selectGroup(e.target.value)}
          aria-label={t('journal.group')}
        >
          {groupItems.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-3 sm:max-w-xl sm:grid-cols-3">
        <StatCard
          label={t('journal.summary.present')}
          value={data?.summary.present}
          toneClassName="bg-success"
        />
        <StatCard
          label={t('journal.summary.late')}
          value={data?.summary.late}
          toneClassName="bg-late"
        />
        <StatCard
          label={t('journal.summary.absent')}
          value={data?.summary.absent}
          toneClassName="bg-danger"
        />
      </div>

      {loading ? (
        <Card className="p-4">
          <Skeleton className="h-64 w-full" />
        </Card>
      ) : errored ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('journal.loadError')}</p>
          <Button variant="secondaryOutline" onClick={retry}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : !data || data.students.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">{t('journal.empty')}</p>
          <p className="text-body text-ink-secondary">{t('journal.emptyHint')}</p>
        </Card>
      ) : (
        <div
          className={
            'overflow-x-auto rounded-xl border border-line' +
            (isFetching ? ' opacity-60 transition-opacity' : '')
          }
        >
          <table className="w-full border-collapse text-bodySm">
            <thead>
              <tr className="bg-surface-sunken text-ink-secondary">
                <th className="sticky left-0 z-10 bg-surface-sunken px-4 py-3 text-left font-medium">
                  {t('journal.student')}
                </th>
                {data.dates.map((date) => (
                  <th key={date} className="whitespace-nowrap px-3 py-3 text-center font-medium">
                    {formatDate(date, i18n.language)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map((student) => (
                <tr key={student.id} className="border-t border-line">
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-surface-card px-4 py-2 text-label text-ink">
                    {student.fullName}
                  </td>
                  {data.dates.map((date) => {
                    const status = byCell.get(cellKey(student.id, date));
                    return (
                      <td key={date} className="px-3 py-2 text-center">
                        {status ? (
                          <AttendanceBadge status={status} />
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
