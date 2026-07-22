import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, type InputProps } from '@/shared/ui/Input';
import { EyeIcon, EyeOffIcon } from '@/shared/ui/icons';

export type PasswordInputProps = Omit<InputProps, 'type' | 'rightSlot'>;

/**
 * Поле пароля с показом содержимого (в макете — иконка remove_red_eye справа).
 * Кнопка доступна с клавиатуры и сообщает состояние через aria-pressed.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightSlot={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={t(visible ? 'auth.hidePassword' : 'auth.showPassword')}
            aria-pressed={visible}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        }
        {...props}
      />
    );
  },
);
