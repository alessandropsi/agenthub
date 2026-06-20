'use client'

import { useState } from 'react'
import {
  Calculator,
  Handshake,
  ScrollText,
  ShieldCheck,
} from 'lucide-react'
import { AgenteFiscal } from '../agents/agente-fiscal'
import { AgentePrecificacao } from '../agents/agente-precificacao'
import { AgenteNegociacao } from '../agents/agente-negociacao'
import { AgenteCompliance } from '../agents/agente-compliance'

type Tab = 'fiscal' | 'precificacao' | 'negociacao' | 'compliance'

const TABS: { key: Tab; label: string; icon: typeof Calculator }[] = [
  { key: 'fiscal', label: 'Agente Fiscal', icon: ScrollText },
  { key: 'precificacao', label: 'Precificação', icon: Calculator },
  { key: 'negociacao', label: 'Negociação', icon: Handshake },
  { key: 'compliance', label: 'Compliance', icon: ShieldCheck },
]

export function AgentesScreen() {
  const [tab, setTab] = useState<Tab>('fiscal')

  return (
    <main className="animate-screen-in mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow mb-2">Agentes disponíveis</p>
      <h1 className="mb-8 font-display text-3xl text-foreground">
        Funcionalidades demonstrativas
      </h1>

      <div className="mb-10 grid gap-3 sm:grid-cols-4">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-start gap-2 rounded-md border p-4 text-left transition-colors ${
                active
                  ? 'border-positive bg-surface'
                  : 'border-border bg-surface hover:border-positive/50'
              }`}
            >
              <Icon
                size={20}
                className={active ? 'text-positive' : 'text-muted-foreground'}
              />
              <span className="text-sm font-medium text-foreground">
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* key força remontagem -> reinicia animação de processamento ao trocar */}
      <div key={tab}>
        {tab === 'fiscal' && <AgenteFiscal />}
        {tab === 'precificacao' && <AgentePrecificacao />}
        {tab === 'negociacao' && <AgenteNegociacao />}
        {tab === 'compliance' && <AgenteCompliance />}
      </div>
    </main>
  )
}
