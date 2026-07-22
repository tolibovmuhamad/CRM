import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSignup } from '@/entities/session';
import { signupDtoSchema, type SignupDto } from '@/shared/api';
import { Button, Input, PasswordInput } from '@/shared/ui';
import { FormAlert } from '../FormAlert';

export interface SignupFormProps {
  /** Заявка принята — страница показывает экран успеха. */
  onSuccess: (fullName: string) => void;
}

/**
 * Заявка на обучение (макет Sign up). Поля ровно как в макете, включая телефон
 * родителя. Аккаунт не создаётся — заявку разбирает менеджер.
 */
export function SignupForm({ onSuccess }: SignupFormProps) {
  const { t } = useTranslation();
  const signup = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupDto>({
    resolver: zodResolver(signupDtoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      address: '',
      phone: '',
      parentPhone: '',
      password: '',
    },
  });

  const submit = handleSubmit((values) => {
    signup.mutate(values, { onSuccess: (request) => onSuccess(request.fullName) });
  });

  const fieldError = (key: keyof SignupDto) => errors[key] && t(errors[key]?.message ?? '');

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {signup.isError && <FormAlert>{t('auth.errors.signupFailed')}</FormAlert>}

      <Input
        {...register('firstName')}
        inputSize="lg"
        autoComplete="given-name"
        placeholder={t('auth.fields.firstName')}
        aria-label={t('auth.fields.firstName')}
        error={fieldError('firstName')}
      />
      <Input
        {...register('lastName')}
        inputSize="lg"
        autoComplete="family-name"
        placeholder={t('auth.fields.lastName')}
        aria-label={t('auth.fields.lastName')}
        error={fieldError('lastName')}
      />
      <Input
        {...register('birthDate')}
        inputSize="lg"
        type="date"
        autoComplete="bday"
        label={t('auth.fields.birthDate')}
        error={fieldError('birthDate')}
      />
      <Input
        {...register('address')}
        inputSize="lg"
        autoComplete="street-address"
        placeholder={t('auth.fields.address')}
        aria-label={t('auth.fields.address')}
        error={fieldError('address')}
      />
      <Input
        {...register('phone')}
        inputSize="lg"
        type="tel"
        autoComplete="tel"
        placeholder={t('auth.fields.phone')}
        aria-label={t('auth.fields.phone')}
        error={fieldError('phone')}
      />
      <Input
        {...register('parentPhone')}
        inputSize="lg"
        type="tel"
        placeholder={t('auth.fields.parentPhone')}
        aria-label={t('auth.fields.parentPhone')}
        error={fieldError('parentPhone')}
      />
      <PasswordInput
        {...register('password')}
        inputSize="lg"
        autoComplete="new-password"
        placeholder={t('auth.fields.password')}
        aria-label={t('auth.fields.password')}
        error={fieldError('password')}
      />

      <Button type="submit" size="xl" fullWidth loading={signup.isPending}>
        {signup.isPending ? t('auth.sending') : t('auth.signUp')}
      </Button>
    </form>
  );
}
