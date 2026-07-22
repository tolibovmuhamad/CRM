import type { Paginated, SortDirection } from '../schemas';

export interface QueryListOptions<T> {
  page: number;
  pageSize: number;
  /** Строка поиска (регистронезависимо, подстрокой). */
  search?: string;
  /** Поля, по которым ищем. */
  searchFields?: (keyof T)[];
  /** Доп. фильтр по полям. */
  filter?: (item: T) => boolean;
  sortBy?: keyof T;
  sortDir?: SortDirection;
}

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''));
}

/**
 * Генерик-обработка списка для моков: фильтр → поиск → сортировка → пагинация.
 * Одна реализация на все сущности (ТЗ §6: единый способ работы со списками).
 */
export function queryList<T>(source: readonly T[], options: QueryListOptions<T>): Paginated<T> {
  let items = [...source];

  if (options.filter) {
    items = items.filter(options.filter);
  }

  const search = options.search?.trim().toLowerCase();
  if (search && options.searchFields?.length) {
    items = items.filter((item) =>
      options.searchFields!.some((field) =>
        String(item[field] ?? '')
          .toLowerCase()
          .includes(search),
      ),
    );
  }

  if (options.sortBy) {
    const key = options.sortBy;
    const dir = options.sortDir === 'desc' ? -1 : 1;
    items.sort((a, b) => compare(a[key], b[key]) * dir);
  }

  const total = items.length;
  const start = (options.page - 1) * options.pageSize;
  const pageItems = items.slice(start, start + options.pageSize);

  return { items: pageItems, total, page: options.page, pageSize: options.pageSize };
}
