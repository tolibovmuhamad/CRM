import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { navItemsForRole, primaryMobileNav } from '@/shared/config/navigation';
import { useSession } from '@/entities/session';
import { Drawer } from '@/shared/ui/Drawer';
import { MenuIcon } from '@/shared/ui/icons';

/** Нижняя навигация для мобайла (UI-Kit: bottom-nav). Полный список разделов — в «Ещё». */
export function BottomNav() {
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user.role;
  const allowed = role ? navItemsForRole(role) : [];
  const primary = primaryMobileNav.filter((item) => allowed.includes(item));

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-line bg-surface-card md:hidden">
        {primary.map(({ to, labelKey, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-caption',
                isActive ? 'text-brand' : 'text-ink-secondary',
              )
            }
          >
            <Icon size={20} />
            <span className="truncate px-1">{t(labelKey)}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-caption text-ink-secondary"
        >
          <MenuIcon size={20} />
          <span>{t('nav.more')}</span>
        </button>
      </nav>

      <Drawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        side="left"
        widthClassName="w-[280px]"
        title={t('app.name')}
      >
        <nav className="flex flex-col gap-1">
          {allowed.map(({ to, labelKey, Icon, end, children }) => (
            <div key={to} className="flex flex-col gap-1">
              <NavLink
                to={to}
                end={end ?? Boolean(children)}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-label transition-colors',
                    isActive
                      ? 'bg-brand-subtle text-brand'
                      : 'text-ink-secondary hover:bg-surface-hover hover:text-ink',
                  )
                }
              >
                <Icon size={20} />
                <span>{t(labelKey)}</span>
              </NavLink>

              {/* Вложенные экраны (Выпускники, Записи) на мобайле доступны только отсюда. */}
              {children
                ?.filter((child) => child.to !== to)
                .map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md py-2 pl-11 pr-3 text-label transition-colors',
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
          ))}
        </nav>
      </Drawer>
    </>
  );
}
