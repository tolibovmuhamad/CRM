import { useTranslation } from 'react-i18next';
import type { Student } from '@/entities/student';
import { Button, Modal } from '@/shared/ui';

export interface DeleteStudentDialogProps {
  /** `null` — диалог закрыт. */
  student: Student | null;
  pending: boolean;
  error: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Подтверждение удаления: действие необратимое, поэтому спрашиваем (ТЗ §10). */
export function DeleteStudentDialog({
  student,
  pending,
  error,
  onCancel,
  onConfirm,
}: DeleteStudentDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={student !== null}
      onClose={onCancel}
      size="sm"
      title={t('students.deleteTitle')}
      footer={
        <>
          <Button variant="secondaryOutline" onClick={onCancel} disabled={pending}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={pending}>
            {t('students.deleteConfirm')}
          </Button>
        </>
      }
    >
      <p className="text-body text-ink-secondary">
        {t('students.deleteText', { name: student?.fullName ?? '' })}
      </p>
      {error && (
        <p role="alert" className="mt-3 text-body text-danger-fg">
          {t('students.deleteError')}
        </p>
      )}
    </Modal>
  );
}
