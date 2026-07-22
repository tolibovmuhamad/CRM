/**
 * Общие настройки графиков (Recharts). Один файл на проект, чтобы все графики
 * читались как одна система: тонкие метки, приглушённые оси и сетка, скруглённые
 * концы столбцов, цвета через переменные темы — тогда график живёт и в тёмной.
 */

/** Цвет серии берём переменной темы, а не hex: иначе тёмная тема не подхватится. */
export const chartColors = {
  series: 'var(--c-brand)',
  grid: 'var(--c-line)',
  axis: 'var(--c-ink-muted)',
  surface: 'var(--c-surface-card)',
} as const;

/** Оси: подписи мелкие и приглушённые, линии осей не рисуем — они шумят. */
export const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: chartColors.axis, fontSize: 12 },
} as const;

/** Сетка только горизонтальная — вертикальные линии для столбцов лишние. */
export const gridProps = {
  vertical: false,
  stroke: chartColors.grid,
  strokeDasharray: '3 3',
} as const;

/** Скругление верхних углов столбца: [tl, tr, br, bl]. Низ прижат к оси. */
export const barRadius: [number, number, number, number] = [4, 4, 0, 0];

export const tooltipStyles = {
  contentStyle: {
    background: chartColors.surface,
    border: '1px solid var(--c-line)',
    borderRadius: 8,
    fontSize: 12,
  },
  labelStyle: { color: 'var(--c-ink-secondary)' },
  itemStyle: { color: 'var(--c-ink)' },
  cursor: { fill: 'var(--c-surface-hover)' },
} as const;
