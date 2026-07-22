import { useTranslation } from 'react-i18next';
import type { Group } from '@/shared/api';
import { formatDateRange } from '@/shared/lib/date';
import { formatScheduleDays } from '@/shared/lib/schedule';
import { Badge, Button, Card, IconButton } from '@/shared/ui';
import { DeleteIcon, EditIcon, NoteIcon } from '@/shared/ui/icons';

export interface GroupCardProps {
  group: Group;
  onOpen: (group: Group) => void;
  onOpenJournal: (group: Group) => void;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

/** Карточка группы для списка (макет Groups/Grid). */
export function GroupCard({ group, onOpen, onOpenJournal, onEdit, onDelete }: GroupCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onOpen(group)}
          className="self-start text-h6 text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {group.name}
        </button>
        <p className="text-bodySm text-ink-secondary">
          {formatDateRange(group.startDate, group.endDate, i18n.language)}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-bodySm text-ink-secondary">
          <Badge tone="neutral">
            {group.studentCount}/{group.capacity}
          </Badge>
          {t('groups.students')}
        </p>
        <p className="flex items-center gap-2 text-bodySm text-ink-secondary">
          <Badge tone="brand">
            {group.passingCount}/{group.studentCount}
          </Badge>
          {t('groups.passingStudents')}
        </p>
      </div>

      <div className="flex flex-col gap-0.5 text-bodySm text-ink-secondary">
        <span>{formatScheduleDays(group.scheduleDays, t)}</span>
        <span>
          {group.duration}
          {group.lessonTime ? ` (${group.lessonTime})` : ''}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="primaryOutline"
          size="sm"
          leftIcon={<NoteIcon size={16} />}
          onClick={() => onOpenJournal(group)}
        >
          {t('groups.journal')}
        </Button>

        <div className="flex items-center gap-1">
          <IconButton
            aria-label={t('groups.editAria', { name: group.name })}
            variant="text"
            size="sm"
            onClick={() => onEdit(group)}
          >
            <EditIcon size={18} />
          </IconButton>
          <IconButton
            aria-label={t('groups.deleteAria', { name: group.name })}
            variant="text"
            size="sm"
            className="text-danger-fg"
            onClick={() => onDelete(group)}
          >
            <DeleteIcon size={18} />
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
