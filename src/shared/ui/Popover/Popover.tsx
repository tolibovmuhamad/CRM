import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface PopoverProps {
  /** Содержимое кнопки-триггера. */
  trigger: ReactNode;
  children: ReactNode;
  /** Доступное имя триггера, если внутри только иконка или цифры. */
  triggerLabel?: string;
  triggerClassName?: string;
  className?: string;
}

/**
 * Поповер по клику (в макете — телефоны Student/Father в таблице). Закрывается
 * по Esc и клику вне.
 *
 * Свой обработчик вместо `useClickOutside`: по Esc фокус возвращается на триггер
 * (иначе он улетает в body), а по клику снаружи — нет, там пользователь уже
 * выбрал, куда смотреть.
 */
export function Popover({
  trigger,
  children,
  triggerLabel,
  triggerClassName,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={triggerLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          triggerClassName,
        )}
      >
        {trigger}
      </button>

      {open && (
        <div
          id={panelId}
          className={cn(
            'absolute left-0 top-full z-40 mt-1 min-w-[180px] rounded-xl border border-line bg-surface-card p-4 text-left shadow-dropdown',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
