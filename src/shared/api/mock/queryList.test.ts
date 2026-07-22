import { describe, expect, it } from 'vitest';
import { queryList } from './queryList';

interface Row {
  id: string;
  name: string;
  score: number;
}

const rows: Row[] = [
  { id: '1', name: 'Ali', score: 30 },
  { id: '2', name: 'Bek', score: 10 },
  { id: '3', name: 'Vali', score: 20 },
  { id: '4', name: 'Gafur', score: 40 },
];

describe('queryList', () => {
  it('пагинирует и отдаёт общий total', () => {
    const r = queryList(rows, { page: 1, pageSize: 2 });
    expect(r.items).toHaveLength(2);
    expect(r.total).toBe(4);
    expect(r.page).toBe(1);
    const r2 = queryList(rows, { page: 2, pageSize: 2 });
    expect(r2.items.map((x) => x.id)).toEqual(['3', '4']);
  });

  it('ищет подстрокой без учёта регистра по заданным полям', () => {
    const r = queryList(rows, { page: 1, pageSize: 10, search: 'al', searchFields: ['name'] });
    expect(r.items.map((x) => x.name)).toEqual(['Ali', 'Vali']);
  });

  it('сортирует по числу в обе стороны', () => {
    const asc = queryList(rows, { page: 1, pageSize: 10, sortBy: 'score', sortDir: 'asc' });
    expect(asc.items.map((x) => x.score)).toEqual([10, 20, 30, 40]);
    const desc = queryList(rows, { page: 1, pageSize: 10, sortBy: 'score', sortDir: 'desc' });
    expect(desc.items.map((x) => x.score)).toEqual([40, 30, 20, 10]);
  });

  it('применяет пользовательский фильтр', () => {
    const r = queryList(rows, { page: 1, pageSize: 10, filter: (x) => x.score >= 20 });
    expect(r.total).toBe(3);
  });

  it('не мутирует исходный массив при сортировке', () => {
    const before = rows.map((x) => x.id);
    queryList(rows, { page: 1, pageSize: 10, sortBy: 'score', sortDir: 'desc' });
    expect(rows.map((x) => x.id)).toEqual(before);
  });
});
