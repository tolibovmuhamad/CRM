import type { Branch } from '@/shared/api/schemas';

/** Филиалы учебного центра (id совпадают с branchId в фикстуре групп). */
export const branchesFixture: Branch[] = [
  { id: 'b-1', name: 'Душанбе, Центр', address: 'ул. Рудаки, 25' },
  { id: 'b-2', name: 'Душанбе, Сомони', address: 'пр. Сомони, 14' },
  { id: 'b-3', name: 'Худжанд', address: 'ул. Ленина, 3' },
];
