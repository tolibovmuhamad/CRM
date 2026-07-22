import { useTranslation } from 'react-i18next';
import type { Student } from '@/shared/api';
import { Popover } from '@/shared/ui';
import { ChevronDownIcon } from '@/shared/ui/icons';

/**
 * Телефон студента с поповером Student/Father (макет: список студентов).
 * Если телефона родителя нет, поповер не нужен — показываем просто номер.
 */
export function StudentPhone({ student }: { student: Student }) {
  const { t } = useTranslation();

  if (student.phones.length === 0) {
    return <span className="text-ink-secondary">{student.phone}</span>;
  }

  return (
    <Popover
      triggerLabel={t('students.phoneAria', { name: student.fullName })}
      triggerClassName="text-ink-secondary hover:text-ink"
      trigger={
        <>
          {student.phone}
          <ChevronDownIcon size={16} />
        </>
      }
    >
      <dl className="flex flex-col gap-3">
        <div>
          <dt className="text-labelSm text-ink-muted">{t('students.phoneOwner.student')}</dt>
          <dd className="text-label text-ink">{student.phone}</dd>
        </div>
        {student.phones.map((extra, index) => (
          <div key={`${extra.value}-${index}`}>
            <dt className="text-labelSm text-ink-muted">
              {extra.description || t('students.phoneOwner.extra')}
            </dt>
            <dd className="text-label text-ink">{extra.value}</dd>
          </div>
        ))}
      </dl>
    </Popover>
  );
}
