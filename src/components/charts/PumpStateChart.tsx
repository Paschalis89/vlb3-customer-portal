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
  pumpStateChartLabel,
  pumpStateToChartValue,
} from '../../lib/telemetry';
import type { TelemetryPoint, TelemetryRange } from '../../types/telemetry';

interface PumpStateChartProps {
  points: TelemetryPoint[];
  range: TelemetryRange;
}

export function PumpStateChart({ points, range }: PumpStateChartProps) {
  const chartData = points.map((point) => ({
    ...point,
    pumpValue: pumpStateToChartValue(point.pumpState),
  }));

  return (
    <div className="telemetry-chart telemetry-chart--state" aria-label="Grafico stato pompa nel tempo" role="img">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 10, bottom: 4, left: -8 }}>
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
            domain={[-0.1, 1.1]}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
            tickFormatter={(value: unknown) => (Number(value) >= 0.5 ? 'RUN' : 'STOP')}
            tickLine={false}
            ticks={[0, 1]}
            width={43}
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
              pumpStateChartLabel(Number(value)),
              'Stato',
            ] as [string, string]}
          />
          <Line
            activeDot={{ r: 4 }}
            connectNulls={false}
            dataKey="pumpValue"
            dot={false}
            isAnimationActive={false}
            name="Stato"
            stroke="var(--color-primary)"
            strokeWidth={2.4}
            type="stepAfter"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
