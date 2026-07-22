import { useTranslation } from 'react-i18next';
import type { Course } from '@/shared/api';
import { formatSomoni } from '@/shared/lib/money';
import { formatScheduleDays } from '@/shared/lib/schedule';
import { Card, IconButton } from '@/shared/ui';
import { EditIcon } from '@/shared/ui/icons';
import { CourseIcon } from './CourseIcon';

export interface CourseCardProps {
  course: Course;
  onOpen: (course: Course) => void;
  onEdit: (course: Course) => void;
}

/**
 * Карточка курса. Снята с компонента `Course` (UI-Kit, 343×152): шапка с
 * названием и счётчиком групп + кружок курса, строка «дни · длительность»,
 * подвал «Fee: …» с кнопкой правки. Разделители — тонкие линии сверху блоков.
 */
export function CourseCard({ course, onOpen, onEdit }: CourseCardProps) {
  const { t } = useTranslation();

  return (
    <Card radius="md" className="flex flex-col gap-5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <button
            type="button"
            onClick={() => onOpen(course)}
            className="self-start truncate text-h4 font-semibold text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {course.name}
          </button>
          <p className="flex items-center gap-1 text-body text-ink-secondary">
            {t('courses.groups')}
            <span className="text-label text-ink-secondary">{course.groupCount}</span>
          </p>
        </div>
        <CourseIcon icon={course.icon} />
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line py-3">
        <span className="text-body font-medium text-ink">
          {formatScheduleDays(course.scheduleDays, t)}
        </span>
        {course.duration && <span className="text-body text-ink">{course.duration}</span>}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="flex items-center gap-1 text-body text-ink">
          {t('courses.fee')}
          <span className="text-label text-success-fg">{formatSomoni(course.fee)}</span>
        </p>
        <IconButton
          aria-label={t('courses.editAria', { name: course.name })}
          variant="text"
          size="sm"
          onClick={() => onEdit(course)}
        >
          <EditIcon size={18} />
        </IconButton>
      </div>
    </Card>
  );
}
