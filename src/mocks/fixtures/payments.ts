import type { Payment } from '@/shared/api/schemas';

/** Суммы в дирамах (ТЗ §9): 450000 дирам = 4500 сомони. */
export const paymentsFixture: Payment[] = [
  {
    id: 'p-1',
    studentId: 's-1',
    amount: 450000,
    date: '2024-08-01T00:00:00.000Z',
    type: 'tuition',
    status: 'paid',
  },
  {
    id: 'p-2',
    studentId: 's-2',
    amount: 400000,
    date: '2024-08-03T00:00:00.000Z',
    type: 'tuition',
    status: 'paid',
  },
  {
    id: 'p-3',
    studentId: 's-3',
    amount: 400000,
    date: '2024-08-05T00:00:00.000Z',
    type: 'tuition',
    status: 'pending',
  },
  {
    id: 'p-4',
    studentId: 's-6',
    amount: 350000,
    date: '2024-09-02T00:00:00.000Z',
    type: 'tuition',
    status: 'paid',
  },
  {
    id: 'p-5',
    studentId: 's-7',
    amount: 500000,
    date: '2024-07-25T00:00:00.000Z',
    type: 'tuition',
    status: 'paid',
  },
  {
    id: 'p-6',
    studentId: 's-8',
    amount: 420000,
    date: '2024-06-01T00:00:00.000Z',
    type: 'tuition',
    status: 'paid',
  },
  {
    id: 'p-7',
    studentId: 's-2',
    amount: 15000,
    date: '2024-09-10T00:00:00.000Z',
    type: 'other',
    status: 'pending',
  },
  {
    id: 'p-8',
    studentId: 's-4',
    amount: 400000,
    date: '2023-11-05T00:00:00.000Z',
    type: 'tuition',
    status: 'paid',
  },
];
