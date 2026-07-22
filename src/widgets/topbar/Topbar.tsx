import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/shared/ui/IconButton';
import { Input } from '@/shared/ui/Input';
import { Drawer } from '@/shared/ui/Drawer';
import { BellIcon, MenuIcon, SearchIcon } from '@/shared/ui/icons';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { LanguageSwitcher } from '@/features/language-switcher/LanguageSwitcher';
import { useSidebarStore } from '@/features/sidebar/useSidebarStore';
import { ProfileMenu } from './ProfileMenu';

/** Шапка приложения (UI-Kit: User header): свернуть сайдбар, поиск, язык, уведомления, тема, профиль. */
export function Topbar() {
  const { t } = useTranslation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleSidebar = useSidebarStore((s) => s.toggle);
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface-card px-4">
      <IconButton
        aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        variant="text"
        onClick={toggleSidebar}
        className="hidden md:inline-flex"
      >
        <MenuIcon />
      </IconButton>

      <div className="w-full max-w-md">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<SearchIcon size={18} />}
          placeholder={t('topbar.search')}
          aria-label={t('topbar.search')}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        <IconButton
          aria-label={t('notifications.title')}
          variant="text"
          onClick={() => setNotifOpen(true)}
          className="relative"
        >
          <BellIcon />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger"
            aria-hidden="true"
          />
        </IconButton>
        <ThemeToggle />
        <ProfileMenu />
      </div>

      <Drawer open={notifOpen} onClose={() => setNotifOpen(false)} title={t('notifications.title')}>
        <p className="text-body text-ink-secondary">{t('notifications.empty')}</p>
      </Drawer>
    </header>
  );
}
