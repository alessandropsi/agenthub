'use client'

import { useState } from 'react'
import { useAgentHub } from '../agenthub-context'
import { Processing } from '../processing'
import { brl } from '@/lib/agenthub-data'

export function AgentePrecificacao() {
  const { company } = useAgentHub()
  const ticketBase = company ? Math.round((company.faturamento / 4.3 / 30) * 0.4) : 200

  const [custo, setCusto] = useState(ticketBase)
  const [margem, setMargem] = useState(35)
  const [pressao, setPressao] = useState(50)
  const [phase, setPhase] = useState<'form' | 'processing' | 'result'>('form')

  const m = margem / 100
  const p = pressao / 100
  const precoMin = custo / (1 - m * 0.7)
  const precoIdeal = (custo / (1 - m)) * (1 + p * 0.2)
  const precoPremium = precoIdeal * 1.25
  const precoIdealReforma = precoIdeal * 1.021

  // posição do termômetro (preço ideal entre min e premium)
  const range = precoPremium - precoMin
  const pos = range > 0 ? ((precoIdeal - precoMin) / range) * 100 : 50

  return (
    <div className="animate-screen-in">
      <div className="grid gap-6 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="eyebrow">Custo direto (R$)</span>
          <input
            type="number"
            value={custo}
            onChange={(e) => setCusto(Number(e.target.value))}
            className="field-input tnum"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="eyebrow">Margem desejada (%)</span>
          <input
            type="number"
            value={margem}
            onChange={(e) => setMargem(Number(e.target.value))}
            className="field-input tnum"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="eyebrow">Pressão de mercado — {pressao}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={pressao}
            onChange={(e) => setPressao(Number(e.target.value))}
            className="mt-3 w-full accent-[#4FD1A5]"
          />
        </label>
      </div>

      <button
        onClick={() => setPhase('processing')}
        className="mt-8 rounded-md bg-positive px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Calcular preço ideal →
      </button>

      {phase === 'processing' && (
        <Processing
          label="Analisando mercado e custos…"
          duration={2000}
          onDone={() => setPhase('result')}
        />
      )}

      {phase === 'result' && (
        <div className="animate-screen-in mt-10">
          <div className="grid gap-px border border-border sm:grid-cols-3">
            <PriceCol label="Preço mínimo" value={precoMin} tone="muted" />
            <PriceCol label="Preço ideal" value={precoIdeal} tone="positive" />
            <PriceCol label="Preço premium" value={precoPremium} tone="gold" />
          </div>

          {/* Termômetro */}
          <div className="mt-6">
            <div className="relative h-1.5 w-full rounded-full bg-border">
              <div
                className="absolute -top-1 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-background bg-positive"
                style={{ left: `${pos}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Mínimo</span>
              <span>Premium</span>
            </div>
          </div>

          <div
            className="mt-8 border-l-[3px] bg-surface px-6 py-5"
            style={{ borderColor: '#E8694A' }}
          >
            <p className="leading-relaxed text-foreground">
              Com a Reforma Tributária (CBS/IBS), seu custo efetivo aumentará
              +2,1% a partir de out/2026. O preço ideal subirá para{' '}
              <span className="tabular-nums text-gold">
                {brl(precoIdealReforma)}
              </span>
              . O AgentHub atualizará automaticamente conforme o cronograma
              tributário.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function PriceCol({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'muted' | 'positive' | 'gold'
}) {
  const color =
    tone === 'positive' ? '#4FD1A5' : tone === 'gold' ? '#C9A961' : '#8FA39B'
  return (
    <div className="bg-surface p-6">
      <p className="eyebrow mb-3">{label}</p>
      <p
        className="font-display text-3xl tabular-nums"
        style={{ color }}
      >
        {brl(value)}
      </p>
    </div>
  )
}
