'use client'

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { brl, type WeekPoint } from '@/lib/agenthub-data'

type Props = {
  points: WeekPoint[]
  showReforma: boolean
  firstNegative: WeekPoint | null
}

export function CashflowChart({ points, showReforma, firstNegative }: Props) {
  // Série para área negativa: apenas a parte abaixo de zero.
  const data = points.map((p) => ({
    ...p,
    negativo: p.saldo < 0 ? p.saldo : 0,
  }))

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
        >
          <defs>
            <pattern
              id="hatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#E8694A"
                strokeWidth="1.2"
                opacity="0.5"
              />
            </pattern>
          </defs>

          <CartesianGrid stroke="#243530" vertical={false} />
          <XAxis
            dataKey="data"
            stroke="#8FA39B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#243530' }}
          />
          <YAxis
            stroke="#8FA39B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={44}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#131F1B',
              border: '1px solid #243530',
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: '#8FA39B' }}
            formatter={(value: number, name: string) => [
              brl(value),
              name === 'saldo'
                ? showReforma
                  ? 'Com reforma'
                  : 'Saldo projetado'
                : name === 'saldoBase'
                  ? 'Sem reforma'
                  : name,
            ]}
          />

          <ReferenceLine y={0} stroke="#8FA39B" strokeDasharray="2 2" />

          {/* Área hachurada abaixo de zero */}
          <Area
            type="monotone"
            dataKey="negativo"
            stroke="none"
            fill="url(#hatch)"
            isAnimationActive
            animationDuration={500}
          />

          {/* Curva original (cinza pontilhada) quando reforma ativa */}
          {showReforma && (
            <Line
              type="monotone"
              dataKey="saldoBase"
              stroke="#8FA39B"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive
              animationDuration={500}
            />
          )}

          {/* Curva principal */}
          <Line
            type="monotone"
            dataKey="saldo"
            stroke={showReforma ? '#C9A961' : '#4FD1A5'}
            strokeWidth={2.5}
            dot={(props: { cx?: number; cy?: number; payload?: WeekPoint }) => {
              const { cx, cy, payload } = props
              if (
                payload &&
                firstNegative &&
                payload.week === firstNegative.week &&
                cx != null &&
                cy != null
              ) {
                return (
                  <circle
                    key={payload.week}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#E8694A"
                    stroke="#0B1210"
                    strokeWidth={2}
                  />
                )
              }
              return <g key={payload?.week ?? Math.random()} />
            }}
            isAnimationActive
            animationDuration={500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
