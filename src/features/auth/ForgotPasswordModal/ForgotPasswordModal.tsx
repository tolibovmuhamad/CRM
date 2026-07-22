import { useTranslation } from 'react-i18next';
import { Button, Modal } from '@/shared/ui';

export interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * «Forgot password?» — экрана восстановления в макете нет, поэтому объясняем, что
 * делать: пароль выдаёт администратор центра (решение заказчика от 21.07.2026).
 */
export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={t('auth.forgotPasswordTitle')}
      footer={<Button onClick={onClose}>{t('common.close')}</Button>}
    >
      <p className="text-body text-ink-secondary">{t('auth.forgotPasswordText')}</p>
    </Modal>
  );
}
