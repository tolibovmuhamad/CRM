import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useTimetable } from '@/entities/timetable';
import { api, queryKeys, type Weekday } from '@/shared/api';
import { Button, Card, Select, Skeleton } from '@/shared/ui';
import { LessonCard } from './LessonCard';

/** Порядок колонок недели (Пн…Вс), как в макете Time table. */
const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** JS `getDay()` (0 = вс) → наш код дня, чтобы подсветить сегодняшнюю колонку. */
const JS_DAY: Record<number, Weekday> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

/**
 * Расписание на неделю (макет Time table). Недельная сетка собирается из активных
 * групп: колонка на день, в колонке — занятия по времени. Виды Month/Day и
 * редактирование событий ждут выгрузки макета.
 */
export function TimetablePage() {
  const { t } = useTranslation();

  const [branchId, setBranchId] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [courseId, setCourseId] = useState('');

  const { data, isPending, isError, refetch, isFetching } = useTimetable({
    branchId: branchId || undefined,
    mentorId: mentorId || undefined,
    courseId: courseId || undefined,
  });

  const branches = useQuery({
    queryKey: queryKeys.branches.list({ pageSize: 100 }),
    queryFn: () => api.getBranches({ pageSize: 100 }),
  });
  const mentors = useQuery({
    queryKey: queryKeys.employees.list({ position: 'mentor', pageSize: 100 }),
    queryFn: () => api.getEmployees({ position: 'mentor', pageSize: 100 }),
  });
  const courses = useQuery({
    queryKey: queryKeys.courses.list({ pageSize: 100 }),
    queryFn: () => api.getCourses({ pageSize: 100 }),
  });

  const lessons = data ?? [];
  const hasFilters = Boolean(branchId || mentorId || courseId);
  const today = JS_DAY[new Date().getDay()];

  // Занятия по дням, внутри дня — по времени начала.
  const byDay = WEEKDAYS.map((day) => ({
    day,
    lessons: lessons
      .filter((l) => l.weekday === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  function resetFilters() {
    setBranchId('');
    setMentorId('');
    setCourseId('');
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h3 text-ink">{t('nav.timetable')}</h1>
        <p className="text-bodySm text-ink-secondary">
          {t('timetable.lessonCount', { count: lessons.length })}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:max-w-2xl xl:grid-cols-3">
        <Select
          selectSize="lg"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
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
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
          aria-label={t('timetable.mentor')}
        >
          <option value="">{t('timetable.allMentors')}</option>
          {mentors.data?.items.map((mentor) => (
            <option key={mentor.id} value={mentor.id}>
              {mentor.fullName}
            </option>
          ))}
        </Select>
        <Select
          selectSize="lg"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
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

      {isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div key={day} className="flex flex-col gap-2">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('timetable.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : lessons.length === 0 ? (
        <Card className="flex flex-col items-start gap-3 p-8">
          <p className="text-h5 text-ink">
            {t(hasFilters ? 'timetable.emptyFiltered' : 'timetable.empty')}
          </p>
          <p className="text-body text-ink-secondary">
            {t(hasFilters ? 'timetable.emptyFilteredHint' : 'timetable.emptyHint')}
          </p>
          {hasFilters && (
            <Button variant="secondaryOutline" onClick={resetFilters}>
              {t('students.resetFilters')}
            </Button>
          )}
        </Card>
      ) : (
        <div
          className={
            'grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7' +
            (isFetching ? ' opacity-60 transition-opacity' : '')
          }
        >
          {byDay.map(({ day, lessons: dayLessons }) => (
            <div key={day} className="flex flex-col gap-2">
              <h2
                className={
                  'text-label ' + (day === today ? 'text-brand' : 'text-ink-secondary')
                }
              >
                {t(`weekdays.short.${day}`)}
                {day === today && (
                  <span className="ml-1 text-labelSm text-brand">{t('timetable.today')}</span>
                )}
              </h2>
              {dayLessons.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line px-2 py-4 text-center text-bodySm text-ink-muted">
                  {t('timetable.dayEmpty')}
                </p>
              ) : (
                dayLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
