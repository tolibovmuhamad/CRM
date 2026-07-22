import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/IconButton';
import { CloseIcon } from '@/shared/ui/icons';
import { useFocusTrap, useScrollLock } from '@/shared/ui/lib/dialog';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  ariaLabel?: string;
  side?: 'left' | 'right';
  /** Ширина панели (Tailwind-класс), по умолчанию w-[420px]. */
  widthClassName?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  ariaLabel,
  side = 'right',
  widthClassName = 'w-[420px]',
  footer,
  children,
}: DrawerProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useFocusTrap<HTMLDivElement>(open, onClose);
  useScrollLock(open);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        className={cn(
          'absolute top-0 flex h-full max-w-full flex-col bg-surface-card shadow-dropdown',
          widthClassName,
          side === 'right' ? 'right-0' : 'left-0',
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
        <div className="flex-1 overflow-y-auto px-5 py-4 text-body text-ink">{children}</div>
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
