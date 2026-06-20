'use client'

import { useState } from 'react'
import { useAgentHub } from '../agenthub-context'
import { Processing } from '../processing'
import {
  brl,
  FORNECEDORES,
  negotiationPotential,
  PROFILES,
  type Fornecedor,
} from '@/lib/agenthub-data'

export function AgenteNegociacao() {
  const { company } = useAgentHub()
  const profile = PROFILES.find((p) => p.setor === company?.setor) ?? PROFILES[0]
  const fornecedores = FORNECEDORES[profile.setorKey]

  const total = fornecedores.reduce((acc, f) => acc + f.valor, 0)
  const melhoria = total * 0.08

  return (
    <div className="animate-screen-in">
      <p className="eyebrow mb-6">Fornecedores · {company?.setor}</p>
      <div className="flex flex-col gap-px border border-border">
        {fornecedores.map((f) => (
          <FornecedorRow key={f.nome} fornecedor={f} />
        ))}
      </div>

      <div
        className="mt-8 border-l-[3px] bg-surface px-6 py-5"
        style={{ borderColor: '#4FD1A5' }}
      >
        <p className="leading-relaxed text-foreground">
          Se você negociar as condições acima, seu caixa melhora{' '}
          <span className="tabular-nums text-positive">{brl(melhoria)}</span> nos
          próximos 30 dias.
        </p>
      </div>
    </div>
  )
}

function FornecedorRow({ fornecedor }: { fornecedor: Fornecedor }) {
  const [phase, setPhase] = useState<'idle' | 'processing' | 'done'>('idle')
  const pot = negotiationPotential(fornecedor.valor)
  const potColor =
    pot === 'Alto' ? '#4FD1A5' : pot === 'Médio' ? '#C9A961' : '#8FA39B'

  return (
    <div className="bg-surface p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-foreground">{fornecedor.nome}</p>
          <p className="mt-1 text-sm tabular-nums text-muted-foreground">
            {brl(fornecedor.valor)}/mês · prazo {fornecedor.prazo} dias
          </p>
        </div>
        {phase === 'idle' && (
          <button
            onClick={() => setPhase('processing')}
            className="shrink-0 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-positive"
          >
            Analisar potencial →
          </button>
        )}
      </div>

      {phase === 'processing' && (
        <Processing
          label="Analisando histórico e condições…"
          duration={1500}
          onDone={() => setPhase('done')}
        />
      )}

      {phase === 'done' && (
        <div className="animate-screen-in mt-4 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="eyebrow">Potencial de negociação</span>
            <span className="text-sm font-medium" style={{ color: potColor }}>
              {pot}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Potencial de negociar +10 dias de prazo ou 3% de desconto à vista com
            base no volume e histórico de pagamento em dia.
          </p>
        </div>
      )}
    </div>
  )
}
