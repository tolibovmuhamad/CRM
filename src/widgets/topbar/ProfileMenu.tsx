import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import { useClickOutside } from '@/shared/lib/useClickOutside';
import { useLogout, useSession } from '@/entities/session';
import { ChevronDownIcon, LogoutIcon, UserIcon } from '@/shared/ui/icons';

/** Меню профиля в шапке (UI-Kit: Profile_menu): кто вошёл, его роль и выход. */
export function ProfileMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const { data: session } = useSession();
  const logout = useLogout();
  const user = session?.user;

  function handleLogout() {
    setOpen(false);
    logout.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('profileMenu.aria')}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1 rounded-full border border-line pl-1 pr-2 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-subtle text-brand">
          <UserIcon size={18} />
        </span>
        <ChevronDownIcon size={16} className="text-ink-muted" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-line bg-surface-card py-1 shadow-dropdown"
        >
          {user && (
            <div className="border-b border-line px-4 py-3">
              <p className="truncate text-label text-ink">{user.fullName}</p>
              <p className="text-labelSm text-ink-secondary">{t(`roles.${user.role}`)}</p>
            </div>
          )}

          {['profileMenu.profile', 'profileMenu.settings'].map((key) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block w-full px-4 py-2 text-left text-label text-ink transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none"
            >
              {t(key)}
            </button>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={logout.isPending}
            className={cn(
              'flex w-full items-center gap-2 px-4 py-2 text-left text-label text-danger-fg transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none',
              logout.isPending && 'opacity-50',
            )}
          >
            <LogoutIcon size={18} />
            {t('profileMenu.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
