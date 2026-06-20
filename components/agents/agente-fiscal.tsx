'use client'

import { useState } from 'react'
import { useAgentHub } from '../agenthub-context'
import { Processing } from '../processing'
import { fiscalCalendar } from '@/lib/agenthub-data'

function badge(dias: number): { label: string; color: string } {
  if (dias > 30) return { label: `${dias} dias`, color: '#4FD1A5' }
  if (dias >= 8) return { label: `${dias} dias`, color: '#C9A961' }
  return { label: `${dias} dias`, color: '#E8694A' }
}

export function AgenteFiscal() {
  const { company } = useAgentHub()
  const [ready, setReady] = useState(false)

  if (!company) return null
  const obrigacoes = fiscalCalendar(company.regime)

  if (!ready) {
    return (
      <Processing
        label="Analisando obrigações fiscais…"
        duration={1500}
        onDone={() => setReady(true)}
      />
    )
  }

  return (
    <div className="animate-screen-in">
      <p className="eyebrow mb-6">
        Calendário fiscal · próximos 90 dias · {company.regime}
      </p>
      <ul className="border-t border-border">
        {obrigacoes.map((o) => {
          const b = badge(o.diasRestantes)
          return (
            <li
              key={o.nome}
              className="flex flex-wrap items-center gap-4 border-b border-border py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-foreground">{o.nome}</p>
                <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                  Vencimento: {o.data}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full border px-3 py-1 text-xs tabular-nums"
                style={{ borderColor: `${b.color}66`, color: b.color }}
              >
                {b.label}
              </span>
            </li>
          )
        })}
      </ul>

      <div
        className="mt-8 border-l-[3px] bg-surface px-6 py-5"
        style={{ borderColor: '#C9A961' }}
      >
        <p className="leading-relaxed text-foreground">
          Com CBS e IBS entrando em vigor em 2026, sua próxima revisão de
          enquadramento tributário deve ocorrer até setembro/2026. O AgentHub
          monitorará as mudanças automaticamente.
        </p>
      </div>
    </div>
  )
}
