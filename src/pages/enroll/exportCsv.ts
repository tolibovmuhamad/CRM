/** Экранируем кавычки и оборачиваем каждое поле — иначе запятая в имени ломает столбцы. */
export function toCsv(rows: string[][]): string {
  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
}

/**
 * Отдаём CSV файлом. BOM в начале — иначе Excel открывает кириллицу кракозябрами.
 */
export function downloadCsv(fileName: string, content: string): void {
  const blob = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
