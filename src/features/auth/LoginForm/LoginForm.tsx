import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/entities/session';
import { ApiError, loginDtoSchema, type LoginDto } from '@/shared/api';
import { Button, Input, PasswordInput } from '@/shared/ui';
import { FormAlert } from '../FormAlert';

export interface LoginFormProps {
  /** Куда идти после успешного входа — решает страница, а не форма. */
  onSuccess: () => void;
  onForgotPassword: () => void;
}

/** Форма входа (макет Log in): телефон + пароль. */
export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const { t } = useTranslation();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginDtoSchema),
    defaultValues: { phone: '', password: '' },
  });

  const submit = handleSubmit((values) => {
    login.mutate(values, { onSuccess });
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {login.isError && <FormAlert>{loginErrorMessage(login.error, t)}</FormAlert>}

      <Input
        {...register('phone')}
        inputSize="lg"
        type="tel"
        autoComplete="tel"
        placeholder={t('auth.fields.phone')}
        aria-label={t('auth.fields.phone')}
        error={errors.phone && t(errors.phone.message ?? '')}
      />

      <PasswordInput
        {...register('password')}
        inputSize="lg"
        autoComplete="current-password"
        placeholder={t('auth.fields.password')}
        aria-label={t('auth.fields.password')}
        error={errors.password && t(errors.password.message ?? '')}
      />

      <Button type="submit" size="xl" fullWidth loading={login.isPending}>
        {login.isPending ? t('auth.loggingIn') : t('auth.logIn')}
      </Button>

      <Button type="button" variant="text" size="md" onClick={onForgotPassword}>
        {t('auth.forgotPassword')}
      </Button>
    </form>
  );
}

/** 401 — это «не тот телефон или пароль», всё остальное — сбой связи. */
function loginErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError && error.status === 401) return t('auth.errors.invalidCredentials');
  return t('auth.errors.loginFailed');
}
