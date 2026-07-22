import { useTranslation } from 'react-i18next';
import { useFieldArray, useForm, type FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  api,
  createStudentDtoSchema,
  editableStudentStatuses,
  queryKeys,
  type CreateStudentDto,
  type Student,
} from '@/shared/api';
import { Button, Card, IconButton, Input, Select, Textarea } from '@/shared/ui';
import { DeleteIcon, PlusIcon } from '@/shared/ui/icons';
import { AvatarPicker } from './AvatarPicker';
import { RadioGroup } from './RadioGroup';
import { toFormValues } from './toFormValues';

export interface StudentFormProps {
  /** Есть студент — правка, нет — создание. */
  student?: Student;
  pending: boolean;
  submitError: boolean;
  onSubmit: (dto: CreateStudentDto) => void;
  onCancel: () => void;
}

/**
 * Форма студента (макет Students/Add new student и Students/Edit profile).
 * Курса и группы здесь нет намеренно: запись в группу — экран Enroll students
 * (решение заказчика от 21.07.2026).
 */
export function StudentForm({
  student,
  pending,
  submitError,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentDto>({
    resolver: zodResolver(createStudentDtoSchema),
    defaultValues: toFormValues(student),
  });

  const phones = useFieldArray({ control, name: 'phones' });
  const branches = useQuery({
    queryKey: queryKeys.branches.list({ pageSize: 100 }),
    queryFn: () => api.getBranches({ pageSize: 100 }),
  });

  const err = (error: FieldError | undefined) => (error ? t(error.message ?? '') : undefined);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <Card className="flex flex-col gap-4 p-6">
        <h2 className="text-h5 text-ink">{t('students.form.basicDetails')}</h2>

        {submitError && (
          <p role="alert" className="rounded-md bg-danger-bg px-4 py-3 text-body text-danger-fg">
            {t('students.form.submitError')}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register('firstName')}
            inputSize="lg"
            label={t('students.form.firstName')}
            error={err(errors.firstName)}
          />
          <Input
            {...register('lastName')}
            inputSize="lg"
            label={t('students.form.lastName')}
            error={err(errors.lastName)}
          />
          <Input
            {...register('birthDate')}
            inputSize="lg"
            type="date"
            label={t('students.form.birthDate')}
            error={err(errors.birthDate)}
          />
          <RadioGroup
            label={t('students.form.gender')}
            name="gender"
            value={watch('gender') ?? ''}
            onChange={(value) => setValue('gender', value as CreateStudentDto['gender'])}
            options={[
              { value: 'male', label: t('students.gender.male') },
              { value: 'female', label: t('students.gender.female') },
            ]}
          />
        </div>

        <Input
          {...register('address')}
          inputSize="lg"
          label={t('students.form.address')}
          error={err(errors.address)}
        />
        <Input
          {...register('email')}
          inputSize="lg"
          type="email"
          label={t('students.form.email')}
          error={err(errors.email)}
        />

        <RadioGroup
          label={t('students.columns.status')}
          name="status"
          value={watch('status')}
          onChange={(value) => setValue('status', value as CreateStudentDto['status'])}
          options={editableStudentStatuses.map((status) => ({
            value: status,
            label: t(`students.status.${status}`),
          }))}
        />

        <Input
          {...register('phone')}
          inputSize="lg"
          type="tel"
          label={t('students.form.phone')}
          error={err(errors.phone)}
        />

        <fieldset className="flex flex-col gap-3">
          <legend className="text-labelSm text-ink-secondary">{t('students.form.phones')}</legend>

          {phones.fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <Input
                {...register(`phones.${index}.value`)}
                inputSize="lg"
                type="tel"
                containerClassName="flex-1"
                aria-label={t('students.form.extraPhone', { number: index + 1 })}
                placeholder={t('students.form.phone')}
                error={err(errors.phones?.[index]?.value)}
              />
              <Input
                {...register(`phones.${index}.description`)}
                inputSize="lg"
                containerClassName="flex-1"
                aria-label={t('students.form.extraPhoneDescription', { number: index + 1 })}
                placeholder={t('students.form.description')}
              />
              <IconButton
                aria-label={t('students.form.removePhone', { number: index + 1 })}
                variant="secondaryOutline"
                size="lg"
                className="mt-0 shrink-0 border-danger text-danger-fg"
                onClick={() => phones.remove(index)}
              >
                <DeleteIcon size={18} />
              </IconButton>
            </div>
          ))}

          <Button
            variant="primaryOutline"
            leftIcon={<PlusIcon size={18} />}
            className="self-start"
            onClick={() => phones.append({ value: '', description: '' })}
          >
            {t('students.form.addPhone')}
          </Button>
        </fieldset>

        <Select
          {...register('branchId')}
          selectSize="lg"
          label={t('students.form.branch')}
          error={err(errors.branchId)}
        >
          <option value="">{t('students.form.chooseBranch')}</option>
          {branches.data?.items.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </Select>

        <Input
          {...register('telegramUsername')}
          inputSize="lg"
          label={t('students.form.telegram')}
          error={err(errors.telegramUsername)}
        />

        <Textarea {...register('notes')} label={t('students.form.notes')} rows={3} />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" size="xl" loading={pending}>
            {t('students.form.save')}
          </Button>
          <Button type="button" variant="primaryOutline" size="xl" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </Card>

      <AvatarPicker
        value={watch('avatarUrl')}
        name={watch('firstName')}
        onChange={(url) => setValue('avatarUrl', url)}
      />
    </form>
  );
}
