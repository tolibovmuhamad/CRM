import { useTranslation } from 'react-i18next';
import type { Student } from '@/shared/api';
import { formatDateRange } from '@/shared/lib/date';
import { Card, IconButton } from '@/shared/ui';
import { ChevronRightIcon, EditIcon, NoteIcon, UserIcon } from '@/shared/ui/icons';
import { calcAge } from '../lib/age';
import { StudentName } from './StudentName';
import { StudentPhone } from './StudentPhone';

export interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onOpenGroup: (groupId: string) => void;
}

/** Карточка студента для вида «плитка» (макет Students/Grid). */
export function StudentCard({ student, onEdit, onOpenGroup }: StudentCardProps) {
  const { t, i18n } = useTranslation();
  const age = calcAge(student.birthDate);
  const group = student.groups[0];

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <StudentName
            fullName={student.fullName}
            isPremium={student.isPremium}
            className="text-h6 text-ink"
          />
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-bodySm text-ink-secondary">
            <span
              className={student.status === 'active' ? 'text-success' : 'text-ink-muted'}
              aria-hidden
            >
              ●
            </span>
            <StudentPhone student={student} />
            {age != null && (
              <>
                <span aria-hidden>|</span>
                <span>{t('students.years', { count: age })}</span>
              </>
            )}
            {student.gender && (
              <>
                <span aria-hidden>|</span>
                <span>{t(`students.gender.${student.gender}`)}</span>
              </>
            )}
          </div>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink-muted">
          <UserIcon size={22} />
        </span>
      </div>

      {group ? (
        <div className="flex items-center gap-3 rounded-md bg-surface-sunken p-3">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onOpenGroup(group.id)}
              className="inline-flex items-center gap-1 text-label text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="truncate">{group.name}</span>
              <ChevronRightIcon size={16} className="shrink-0 text-brand" />
            </button>
            <p className="text-bodySm text-ink-secondary">
              {formatDateRange(group.startDate, group.endDate, i18n.language)}
            </p>
          </div>
          <IconButton
            aria-label={t('students.openJournal')}
            variant="primaryOutline"
            size="sm"
            onClick={() => onOpenGroup(group.id)}
          >
            <NoteIcon size={18} />
          </IconButton>
        </div>
      ) : (
        <p className="rounded-md bg-surface-sunken p-3 text-bodySm text-ink-secondary">
          {t('students.noGroup')}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-bodySm text-ink-secondary">
          {t('students.columns.status')}:{' '}
          <span className={student.status === 'active' ? 'text-success-fg' : 'text-ink'}>
            {t(`students.status.${student.status}`)}
          </span>
        </p>
        <IconButton
          aria-label={t('students.editAria', { name: student.fullName })}
          variant="text"
          size="sm"
          onClick={() => onEdit(student)}
        >
          <EditIcon size={18} />
        </IconButton>
      </div>
    </Card>
  );
}
