import type { LogEntry } from '@/shared/api/schemas';

/** Журнал действий (макет Administration/Logs). Имена — из демо-аккаунтов. */
export const logsFixture: LogEntry[] = [
  {
    id: 'log-1',
    userName: 'Sattorova Malika',
    action: 'create',
    target: 'Студент «Tojiev Olimjon»',
    createdAt: '2024-09-15T09:12:00.000Z',
  },
  {
    id: 'log-2',
    userName: 'Usmonov Bekhzod',
    action: 'send',
    target: 'SMS-рассылка «Студенты»',
    createdAt: '2024-09-14T16:40:00.000Z',
  },
  {
    id: 'log-3',
    userName: 'Karimov Sardor',
    action: 'update',
    target: 'Журнал группы «C# 5 June»',
    createdAt: '2024-09-14T12:05:00.000Z',
  },
  {
    id: 'log-4',
    userName: 'Sattorova Malika',
    action: 'update',
    target: 'Профиль студента «Ahmad Abdulsamad»',
    createdAt: '2024-09-13T10:30:00.000Z',
  },
  {
    id: 'log-5',
    userName: 'Nazarov Firuz',
    action: 'login',
    target: 'Вход в систему',
    createdAt: '2024-09-13T08:00:00.000Z',
  },
  {
    id: 'log-6',
    userName: 'Usmonov Bekhzod',
    action: 'create',
    target: 'Платёж «Rasulov Alij»',
    createdAt: '2024-09-12T15:20:00.000Z',
  },
  {
    id: 'log-7',
    userName: 'Sattorova Malika',
    action: 'delete',
    target: 'Группа «React 2 November»',
    createdAt: '2024-09-11T11:45:00.000Z',
  },
  {
    id: 'log-8',
    userName: 'Karimov Sardor',
    action: 'update',
    target: 'Посещаемость группы «Python 3 July»',
    createdAt: '2024-09-10T13:10:00.000Z',
  },
  {
    id: 'log-9',
    userName: 'Nazarov Firuz',
    action: 'create',
    target: 'Курс «JavaScript»',
    createdAt: '2024-09-09T09:55:00.000Z',
  },
  {
    id: 'log-10',
    userName: 'Usmonov Bekhzod',
    action: 'login',
    target: 'Вход в систему',
    createdAt: '2024-09-09T07:50:00.000Z',
  },
];
