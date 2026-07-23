import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/shared/ui';
import { UsersTab } from './UsersTab';
import { RolesTab } from './RolesTab';
import { LogsTab } from './LogsTab';

type TabId = 'users' | 'roles' | 'logs';

/** Администрирование (макет Administration): Пользователи, Роли, Журнал действий. */
export function AdministrationPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabId>('users');

  const tabs = [
    { id: 'users', label: t('admin.tabs.users') },
    { id: 'roles', label: t('admin.tabs.roles') },
    { id: 'logs', label: t('admin.tabs.logs') },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-h3 text-ink">{t('nav.administration')}</h1>
      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(id) => setTab(id as TabId)}
        aria-label={t('nav.administration')}
      />
      {tab === 'users' ? <UsersTab /> : tab === 'roles' ? <RolesTab /> : <LogsTab />}
    </section>
  );
}
