import type { AuthUser } from '@/shared/api/schemas';

/**
 * Демо-аккаунты для входа в мок-режиме (решение заказчика от 21.07.2026).
 * Пароль не проверяется — вход по телефону, любой непустой пароль. Когда появится
 * реальный бэкенд, файл удаляется вместе с мок-реализацией `login`.
 *
 * Роль определяет доступные разделы — см. `shared/config/navigation`.
 */
export const demoAccountsFixture: AuthUser[] = [
  { id: 'e-4', fullName: 'Sattorova Malika', phone: '+992 900 00 00 01', role: 'admin' },
  { id: 'e-3', fullName: 'Usmonov Bekhzod', phone: '+992 900 00 00 02', role: 'manager' },
  { id: 'e-1', fullName: 'Karimov Sardor', phone: '+992 900 00 00 03', role: 'mentor' },
  { id: 'e-5', fullName: 'Nazarov Firuz', phone: '+992 900 00 00 04', role: 'developer' },
  { id: 's-2', fullName: 'Ahmad Abdulsamad', phone: '+992 900 00 00 05', role: 'student' },
];

/** Сравнение телефонов без учёта форматирования: «+992 900…» и «992900…» — одно и то же. */
export const normalizePhone = (phone: string) => phone.replace(/\D/g, '');
