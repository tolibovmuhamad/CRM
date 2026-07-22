import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { navItemsForRole, type NavItem } from '@/shared/config/navigation';
import { useSession } from '@/entities/session';
import { useSidebarStore } from '@/features/sidebar/useSidebarStore';
import { Logo } from '@/shared/ui';
import { ChevronDownIcon } from '@/shared/ui/icons';

const linkStyles = (isActive: boolean, collapsed: boolean) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
    collapsed && 'justify-center',
    isActive
      ? 'bg-brand-subtle text-brand'
      : 'text-ink-secondary hover:bg-surface-hover hover:text-ink',
  );

/** Боковая навигация (UI-Kit: Navbar). Сворачивается, на мобайле скрыта (там BottomNav). */
export function Sidebar() {
  const { t } = useTranslation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const { data: session } = useSession();
  // Разделы зависят от роли: то, что роли не положено, не показываем вовсе.
  const items = session ? navItemsForRole(session.user.role) : [];

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-line bg-surface-card transition-[width] duration-200 md:flex',
        collapsed ? 'w-[72px]' : 'w-60',
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Logo height={32} markOnly={collapsed} />
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-2">
        {items.map((item) =>
          item.children && !collapsed ? (
            <NavGroup key={item.to} item={item} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? t(item.labelKey) : undefined}
              className={({ isActive }) => linkStyles(isActive, collapsed)}
            >
              <item.Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
}

/**
 * Раздел с вложенными пунктами (в макете Students раскрывается в All students /
 * Graduates). Раскрыт, если открыт любой из вложенных экранов.
 */
function NavGroup({ item }: { item: NavItem }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const inside = pathname === item.to || pathname.startsWith(`${item.to}/`);
  const [open, setOpen] = useState(inside);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(linkStyles(inside, false), 'w-full text-left')}
      >
        <item.Icon size={20} className="shrink-0" />
        <span className="flex-1 truncate">{t(item.labelKey)}</span>
        <ChevronDownIcon
          size={16}
          className={cn('shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-1 py-1 pl-8">
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  isActive
                    ? 'bg-brand-subtle text-brand'
                    : 'text-ink-secondary hover:bg-surface-hover hover:text-ink',
                )
              }
            >
              {t(child.labelKey)}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
