import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Вкладки делят ширину поровну (макет Log in / Sign up). */
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** Панель вкладок (UI-Kit: Tab). Роль tablist, роуминг-фокус стрелками. */
export function Tabs({ tabs, value, onChange, fullWidth = false, className, ...rest }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + delta + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={rest['aria-label']}
      className={cn('flex gap-1 border-b border-line', className)}
    >
      {tabs.map((tab, index) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              '-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              fullWidth && 'flex-1',
              active
                ? 'border-brand text-brand'
                : 'border-transparent text-ink-secondary hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
