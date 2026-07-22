import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';

export interface SignupSuccessProps {
  fullName: string;
  onBackToLogin: () => void;
}

/**
 * Состояние «заявка отправлена». Аккаунта пока нет — объясняем, что будет дальше
 * (ТЗ §10: сообщение говорит, что случилось и что делать).
 */
export function SignupSuccess({ fullName, onBackToLogin }: SignupSuccessProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-h4 text-ink">{t('auth.signupDoneTitle')}</h1>
      <p className="text-body text-ink-secondary">{t('auth.signupDoneText', { name: fullName })}</p>
      <Button size="xl" fullWidth onClick={onBackToLogin}>
        {t('auth.backToLogin')}
      </Button>
    </div>
  );
}
