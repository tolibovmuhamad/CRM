import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@/shared/ui';
import { DeleteIcon, UserIcon } from '@/shared/ui/icons';

export interface AvatarPickerProps {
  value: string | undefined;
  /** Имя нужно только для подписи картинки. */
  name: string | undefined;
  onChange: (url: string) => void;
}

/** Больше 2 МБ в data-URL раздувают мок-хранилище и localStorage. */
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Панель «Photo» из макета: выбрать файл, посмотреть превью, удалить.
 *
 * Загрузки на сервер нет — файл читается в data-URL и живёт в моках. Когда
 * появится бэкенд, здесь останется только заменить чтение на POST файла.
 */
export function AvatarPicker({ value, name, onChange }: AvatarPickerProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function pick(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_SIZE_BYTES) {
      setError(t('students.form.photoTooBig'));
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h5 text-ink">{t('students.form.photo')}</h2>
        {value && (
          <Button
            variant="text"
            size="sm"
            leftIcon={<DeleteIcon size={16} />}
            onClick={() => {
              onChange('');
              setError(null);
            }}
          >
            {t('students.form.removePhoto')}
          </Button>
        )}
      </div>

      <div className="flex justify-center">
        {value ? (
          <img
            src={value}
            alt={t('students.form.photoAlt', { name: name || '' })}
            className="h-40 w-40 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-40 w-40 items-center justify-center rounded-full bg-surface-sunken text-ink-muted">
            <UserIcon size={64} />
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-labelSm text-danger-fg">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <Button variant="primaryOutline" fullWidth onClick={() => inputRef.current?.click()}>
        {t('students.form.chooseAvatar')}
      </Button>
      <p className="text-labelSm text-ink-muted">{t('students.form.photoHint')}</p>
    </Card>
  );
}
