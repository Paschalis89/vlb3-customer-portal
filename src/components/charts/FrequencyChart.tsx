import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatTelemetryAxisLabel,
  formatTelemetryTooltipLabel,
} from '../../lib/telemetry';
import type { TelemetryPoint, TelemetryRange } from '../../types/telemetry';

interface FrequencyChartProps {
  points: TelemetryPoint[];
  range: TelemetryRange;
}

export function FrequencyChart({ points, range }: FrequencyChartProps) {
  return (
    <div className="telemetry-chart" aria-label="Grafico frequenza nel tempo" role="img">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 10, bottom: 4, left: -8 }}>
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="4 5"
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="timestamp"
            minTickGap={28}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            tickFormatter={(value: unknown) => formatTelemetryAxisLabel(String(value), range)}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={[0, 50]}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            tickFormatter={(value: unknown) => `${value}`}
            tickLine={false}
            ticks={[0, 10, 20, 30, 40, 50]}
            width={38}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface-strong)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-card)',
            }}
            itemStyle={{ color: 'var(--color-text)' }}
            labelFormatter={(value: unknown) => formatTelemetryTooltipLabel(String(value))}
            labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '6px' }}
            formatter={(value: unknown) => [
              `${Number(value).toFixed(2)} Hz`,
              'Frequenza',
            ] as [string, string]}
          />
          <Line
            activeDot={{ r: 4 }}
            connectNulls={false}
            dataKey="frequencyHz"
            dot={false}
            isAnimationActive={false}
            name="Frequenza"
            stroke="var(--color-primary)"
            strokeWidth={2.4}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
