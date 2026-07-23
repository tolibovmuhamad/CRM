import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Group } from '@/shared/api';
import { formatSomoni } from '@/shared/lib/money';
import {
  axisProps,
  barRadius,
  chartColors,
  gridProps,
  tooltipStyles,
} from '@/shared/ui/chart/chartTheme';

export interface GroupIncomeChartProps {
  groups: Group[];
}

/**
 * Доход по группам (макет Dashboard). Топ-6 по доходу. Значения — в сомони
 * (из дирам, ТЗ §9); общие настройки — `chartTheme`, поэтому график живёт в тёмной теме.
 */
export function GroupIncomeChart({ groups }: GroupIncomeChartProps) {
  const { t } = useTranslation();

  // Доход держим в дирамах (ТЗ §9); в сомони переводит formatSomoni при выводе.
  const data = [...groups]
    .sort((a, b) => b.income - a.income)
    .slice(0, 6)
    .map((g) => ({ name: g.name, income: g.income }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="name" {...axisProps} interval={0} />
          <YAxis
            allowDecimals={false}
            {...axisProps}
            width={56}
            tickFormatter={(value) => formatSomoni(Number(value), { withSymbol: false })}
          />
          <Tooltip
            {...tooltipStyles}
            formatter={(value) => [formatSomoni(Number(value)), t('dashboard.income')]}
          />
          <Bar
            dataKey="income"
            name={t('dashboard.income')}
            fill={chartColors.series}
            radius={barRadius}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
