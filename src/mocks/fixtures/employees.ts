import type { Employee } from '@/shared/api/schemas';

/** Суммы в дирамах (ТЗ §9): 500000 дирам = 5000 сомони. */
export const employeesFixture: Employee[] = [
  {
    id: 'e-1',
    fullName: 'Karimov Sardor',
    position: 'mentor',
    level: 3,
    groupIds: ['g-csharp-5'],
    salary: 500000,
  },
  {
    id: 'e-2',
    fullName: 'Rahimova Nigina',
    position: 'mentor',
    level: 2,
    groupIds: ['g-react-1'],
    salary: 420000,
  },
  { id: 'e-3', fullName: 'Usmonov Bekhzod', position: 'manager', groupIds: [], salary: 380000 },
  { id: 'e-4', fullName: 'Sattorova Malika', position: 'admin', groupIds: [], salary: 350000 },
  { id: 'e-5', fullName: 'Nazarov Firuz', position: 'developer', groupIds: [], salary: 600000 },
];
