import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EnrollmentStats } from '@/entities/enrollment';
import {
  axisProps,
  barRadius,
  chartColors,
  gridProps,
  tooltipStyles,
} from '@/shared/ui/chart/chartTheme';

export interface EnrollmentChartProps {
  stats: EnrollmentStats;
}

/**
 * Записи по месяцам за год (макет Enroll students). Одна серия, поэтому легенды
 * нет — заголовок над графиком уже говорит, что показано. Числа над столбцами не
 * ставим: значения читаются в подсказке и в таблице ниже.
 */
export function EnrollmentChart({ stats }: EnrollmentChartProps) {
  const { t } = useTranslation();

  const data = stats.points.map((point) => ({
    month: t(`months.short.${point.month}`),
    count: point.count,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis allowDecimals={false} {...axisProps} />
          <Tooltip {...tooltipStyles} formatter={(value) => [value, t('enroll.chartSeries')]} />
          <Bar
            dataKey="count"
            name={t('enroll.chartSeries')}
            fill={chartColors.series}
            radius={barRadius}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
