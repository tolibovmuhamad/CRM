import type { SmsMailing } from '@/shared/api/schemas';

/** История рассылок (макет SMS mailings). */
export const smsMailingsFixture: SmsMailing[] = [
  {
    id: 'sms-1',
    audience: 'students',
    recipientCount: 16,
    text: 'Здравствуйте! Напоминаем об оплате за обучение в Omuz. Спасибо!',
    status: 'sent',
    createdAt: '2024-09-12T09:30:00.000Z',
  },
  {
    id: 'sms-2',
    audience: 'group',
    groupId: 'g-csharp-5',
    groupName: 'C# 5 June',
    recipientCount: 14,
    text: 'Занятия вашей группы начинаются на этой неделе. Расписание уточняйте у администратора.',
    status: 'sent',
    createdAt: '2024-09-05T14:00:00.000Z',
  },
  {
    id: 'sms-3',
    audience: 'graduates',
    recipientCount: 8,
    text: 'Поздравляем с успешным окончанием курса! Желаем удачи в карьере. Команда Omuz.',
    status: 'sent',
    createdAt: '2024-08-28T11:15:00.000Z',
  },
  {
    id: 'sms-4',
    audience: 'leads',
    recipientCount: 3,
    text: 'Приглашаем вас на бесплатный пробный урок в учебном центре Omuz. Запись по телефону.',
    status: 'queued',
    createdAt: '2024-09-15T08:00:00.000Z',
  },
];
