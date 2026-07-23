import type { SignupRequest } from '@/shared/api/schemas';

/**
 * Лиды — заявки на обучение с экрана Sign up (аккаунт не создаётся, ТЗ). Ими же
 * пополняется список при отправке заявки; здесь — стартовые, чтобы аудитория
 * рассылки «Лиды» не была пустой.
 */
export const leadsFixture: SignupRequest[] = [
  {
    id: 'lead-1',
    fullName: 'Rustamov Doston',
    phone: '93 700 1010',
    parentPhone: '93 700 2020',
    birthDate: '2005-04-12',
    address: 'Душанбе, ул. Айни 5',
    createdAt: '2024-09-14T10:00:00.000Z',
  },
  {
    id: 'lead-2',
    fullName: 'Saidova Nasiba',
    phone: '93 700 3030',
    parentPhone: '93 700 4040',
    birthDate: '2006-08-01',
    address: 'Худжанд, ул. Гагарина 8',
    createdAt: '2024-09-13T16:30:00.000Z',
  },
  {
    id: 'lead-3',
    fullName: 'Ismoilov Farrukh',
    phone: '93 700 5050',
    parentPhone: '93 700 6060',
    birthDate: '2004-12-20',
    address: 'Душанбе, пр. Сомони 22',
    createdAt: '2024-09-11T12:00:00.000Z',
  },
];
