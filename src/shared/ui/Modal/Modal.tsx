import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/IconButton';
import { CloseIcon } from '@/shared/ui/icons';
import { useFocusTrap, useScrollLock } from '@/shared/ui/lib/dialog';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** aria-label, если заголовок не текстовый/отсутствует. */
  ariaLabel?: string;
  size?: ModalSize;
  footer?: ReactNode;
  children: ReactNode;
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[550px]',
  lg: 'max-w-[720px]',
};

export function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  size = 'md',
  footer,
  children,
}: ModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useFocusTrap<HTMLDivElement>(open, onClose);
  useScrollLock(open);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full flex-col rounded-2xl bg-surface-card shadow-dropdown',
          sizes[size],
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-h5 text-ink">
            {title}
          </h2>
          <IconButton aria-label={t('common.close')} variant="text" size="sm" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </header>
        <div className="overflow-y-auto px-5 py-4 text-body text-ink">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
