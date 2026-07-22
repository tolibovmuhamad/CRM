import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCreateStudent, useStudent, useUpdateStudent } from '@/entities/student';
import { StudentForm } from '@/features/student-form';
import { Button, Card, IconButton, Skeleton } from '@/shared/ui';
import { ChevronLeftIcon } from '@/shared/ui/icons';

export interface StudentFormPageProps {
  mode: 'create' | 'edit';
}

/**
 * Экраны «Add new student» и «Edit profile» — одна форма, разные заголовок и
 * мутация. Правка ждёт загрузки студента, чтобы поля не мигали пустыми.
 */
export function StudentFormPage({ mode }: StudentFormPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const student = useStudent(mode === 'edit' ? id : '');
  const create = useCreateStudent();
  const update = useUpdateStudent();

  const backToList = () => navigate('/students');

  const title = t(mode === 'create' ? 'students.form.createTitle' : 'students.form.editTitle');

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <IconButton aria-label={t('common.back')} variant="text" onClick={backToList}>
          <ChevronLeftIcon />
        </IconButton>
        <h1 className="text-h4 text-ink">{title}</h1>
      </div>

      {mode === 'edit' && student.isPending ? (
        <Card className="flex flex-col gap-4 p-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </Card>
      ) : mode === 'edit' && student.isError ? (
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-body text-danger-fg">{t('students.form.loadError')}</p>
          <Button variant="secondaryOutline" onClick={() => void student.refetch()}>
            {t('common.retry')}
          </Button>
        </Card>
      ) : (
        <StudentForm
          student={student.data}
          pending={create.isPending || update.isPending}
          submitError={create.isError || update.isError}
          onCancel={backToList}
          onSubmit={(dto) => {
            if (mode === 'create') {
              create.mutate(dto, { onSuccess: backToList });
            } else {
              update.mutate({ id, dto }, { onSuccess: backToList });
            }
          }}
        />
      )}
    </section>
  );
}
