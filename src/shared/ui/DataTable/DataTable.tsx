import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** `index` — порядковый номер строки на текущей странице, с нуля. */
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
}

function defaultCell<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  return value == null ? '' : String(value);
}

/** Табличный виджет (UI-Kit: Table). Колонки конфигурируются, ячейки — через render. */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  empty,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[560px] border-collapse text-body">
        <thead>
          <tr className="border-b border-line text-left text-labelSm uppercase text-ink-muted">
            {columns.map((column) => (
              <th key={column.key} className={cn('px-4 py-3 font-medium', column.headerClassName)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-ink-secondary">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-line last:border-0',
                  onRowClick ? 'cursor-pointer hover:bg-surface-hover' : 'hover:bg-surface-hover',
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-3 text-ink', column.className)}>
                    {column.render ? column.render(row, rowIndex) : defaultCell(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
