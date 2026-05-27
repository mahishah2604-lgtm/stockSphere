import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useId } from 'react'
import type { StockPoint } from '../types'

type ChartMode = 'line' | 'area' | 'bar' | 'candlestick'

type StockChartProps = {
  data: StockPoint[]
  mode?: ChartMode
  showIndicators?: boolean
  compact?: boolean
}

function tooltipFormatter(value: unknown, name: unknown) {
  const label = String(name)
  if (typeof value !== 'number') return [String(value ?? ''), label] as [string, string]
  return [label === 'volume' ? value.toLocaleString() : `$${value.toFixed(2)}`, label.toUpperCase()]
}

export default function StockChart({
  data,
  mode = 'area',
  showIndicators = false,
  compact = false,
}: StockChartProps) {
  const id = useId().replaceAll(':', '')
  const priceGradient = `priceGlow-${id}`
  const barGradient = `volumeGlow-${id}`
  const commonProps = {
    data,
    margin: compact ? { top: 8, right: 0, left: 0, bottom: 0 } : { top: 12, right: 18, left: 0, bottom: 8 },
  }

  const axes = (
    <>
      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
      <XAxis dataKey="label" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
      <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
      {!compact && <YAxis yAxisId="volume" orientation="right" hide />}
      <Tooltip
        formatter={tooltipFormatter}
        contentStyle={{
          background: 'rgba(9,9,9,0.92)',
          border: '1px solid rgba(139,92,246,0.35)',
          borderRadius: 12,
          color: '#fff',
          boxShadow: '0 0 26px rgba(139,92,246,0.22)',
          backdropFilter: 'blur(18px)',
        }}
        labelStyle={{ color: '#B3B3B3' }}
      />
    </>
  )

  return (
    <ResponsiveContainer width="100%" height={compact ? 92 : 360}>
      {mode === 'line' ? (
        <LineChart {...commonProps}>
          {axes}
          <Line type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={compact ? 2 : 3} dot={false} />
          {showIndicators && <Line type="monotone" dataKey="ma50" stroke="#38BDF8" strokeWidth={2} dot={false} />}
          {showIndicators && <Line type="monotone" dataKey="ma200" stroke="#A855F7" strokeWidth={2} dot={false} />}
        </LineChart>
      ) : mode === 'bar' ? (
        <BarChart {...commonProps}>
          <defs>
            <linearGradient id={barGradient} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.18} />
            </linearGradient>
          </defs>
          {axes}
          <Bar dataKey="volume" fill={`url(#${barGradient})`} radius={[6, 6, 0, 0]} animationDuration={900} />
        </BarChart>
      ) : mode === 'candlestick' ? (
        <ComposedChart {...commonProps}>
          {axes}
          <Bar dataKey="high" fill="rgba(56,189,248,0.2)" radius={[5, 5, 0, 0]} animationDuration={900} />
          <Line type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={3} dot={false} animationDuration={1000} />
          <Line type="monotone" dataKey="low" stroke="#EF4444" strokeWidth={1.6} dot={false} animationDuration={1000} />
        </ComposedChart>
      ) : (
        <ComposedChart {...commonProps}>
          <defs>
            <linearGradient id={priceGradient} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.52} />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#090909" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={barGradient} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.42} />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {axes}
          {!compact && (
            <Bar yAxisId="volume" dataKey="volume" fill={`url(#${barGradient})`} radius={[4, 4, 0, 0]} barSize={9} />
          )}
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8B5CF6"
            strokeWidth={compact ? 2 : 3}
            fill={`url(#${priceGradient})`}
            dot={false}
            animationDuration={1100}
          />
          {showIndicators && <Line type="monotone" dataKey="ma50" stroke="#38BDF8" strokeWidth={2} dot={false} />}
          {showIndicators && <Line type="monotone" dataKey="upperBand" stroke="#60A5FA" strokeWidth={1.4} dot={false} />}
          {showIndicators && <Line type="monotone" dataKey="lowerBand" stroke="#60A5FA" strokeWidth={1.4} dot={false} />}
        </ComposedChart>
      )}
    </ResponsiveContainer>
  )
}
