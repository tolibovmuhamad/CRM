import type { ComponentType } from 'react';
import type { Role } from '@/shared/api/schemas';
import {
  AccountingIcon,
  AdminIcon,
  CoursesIcon,
  EmployeesIcon,
  GroupsIcon,
  HomeIcon,
  type IconProps,
  JournalIcon,
  SmsIcon,
  TimetableIcon,
  UsersIcon,
} from '@/shared/ui/icons';

export interface NavChild {
  to: string;
  labelKey: string;
}

export interface NavItem {
  to: string;
  /** Ключ i18n для подписи. */
  labelKey: string;
  Icon: ComponentType<IconProps>;
  end?: boolean;
  /** Роли, которым раздел виден. Пусто — виден всем авторизованным. */
  roles?: Role[];
  /** Вложенные пункты (в макете Students раскрывается в All students / Graduates). */
  children?: NavChild[];
}

const STAFF: Role[] = ['admin', 'manager', 'mentor', 'developer'];
const OFFICE: Role[] = ['admin', 'manager', 'developer'];
const ADMINS: Role[] = ['admin', 'developer'];

/**
 * Разделы навигации (docs/screens.md). Используются сайдбаром и мобильной навигацией.
 *
 * Раскладка ролей — предложение, а не требование ТЗ: в макете нарисованы chips
 * ролей, но матрицы доступа нет. Уточнить у заказчика при разделе Administration.
 */
export const navItems: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', Icon: HomeIcon, end: true },
  {
    to: '/students',
    labelKey: 'nav.students',
    Icon: UsersIcon,
    roles: STAFF,
    children: [
      { to: '/students', labelKey: 'nav.allStudents' },
      { to: '/students/graduates', labelKey: 'nav.graduates' },
      { to: '/students/enroll', labelKey: 'nav.enroll' },
    ],
  },
  { to: '/groups', labelKey: 'nav.groups', Icon: GroupsIcon, roles: STAFF },
  { to: '/courses', labelKey: 'nav.courses', Icon: CoursesIcon },
  { to: '/employees', labelKey: 'nav.employees', Icon: EmployeesIcon, roles: OFFICE },
  { to: '/journal', labelKey: 'nav.journal', Icon: JournalIcon },
  { to: '/timetable', labelKey: 'nav.timetable', Icon: TimetableIcon },
  { to: '/accounting', labelKey: 'nav.accounting', Icon: AccountingIcon, roles: OFFICE },
  { to: '/sms', labelKey: 'nav.sms', Icon: SmsIcon, roles: OFFICE },
  { to: '/administration', labelKey: 'nav.administration', Icon: AdminIcon, roles: ADMINS },
];

/** Пункты, доступные роли. Один источник и для меню, и для защиты роутов. */
export function navItemsForRole(role: Role): NavItem[] {
  return navItems.filter((item) => !item.roles || item.roles.includes(role));
}

/** Доступен ли роли путь. Неизвестный путь считаем разрешённым — за него отвечает 404. */
export function canAccessPath(role: Role, pathname: string): boolean {
  const item = matchNavItem(pathname);
  return !item || !item.roles || item.roles.includes(role);
}

/** Самый длинный подходящий префикс: `/students/s-1` относится к разделу `/students`. */
function matchNavItem(pathname: string): NavItem | undefined {
  return navItems
    .filter((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))
    .sort((a, b) => b.to.length - a.to.length)[0];
}

/** Основные пункты для мобильной нижней навигации (остальное — в «Ещё»). */
export const primaryMobileNav: NavItem[] = navItems.filter((item) =>
  ['/', '/students', '/groups', '/timetable'].includes(item.to),
);
