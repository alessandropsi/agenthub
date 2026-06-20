'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAgentHub } from '../agenthub-context'
import { CashflowChart } from '../cashflow-chart'
import { brl, projectCashflow, recommendation } from '@/lib/agenthub-data'

export function PainelScreen() {
  const { userName, company, navigate } = useAgentHub()
  const [reforma, setReforma] = useState(false)
  const [showScenario, setShowScenario] = useState(false)
  const [perdaCliente, setPerdaCliente] = useState(0)
  const [atrasoFornecedor, setAtrasoFornecedor] = useState(0)

  const timestamp = useMemo(
    () =>
      new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [],
  )

  if (!company) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-muted-foreground">
          Cadastre os dados da sua empresa para ver a projeção.
        </p>
        <button
          onClick={() => navigate('home')}
          className="mt-4 rounded-md bg-positive px-5 py-2 text-sm text-background"
        >
          Ir para a Página Inicial
        </button>
      </main>
    )
  }

  const input = {
    saldo: company.saldo,
    faturamento: company.faturamento,
    contasPagar: company.contasPagar,
    reforma,
    perdaCliente: perdaCliente / 100,
    atrasoFornecedor,
  }

  const { points, firstNegative } = projectCashflow(input)
  const rec = recommendation(input)

  return (
    <main className="animate-screen-in mx-auto max-w-6xl px-5 py-12">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="text-sm text-muted-foreground">Olá, {userName}</p>
          <h1 className="mt-1 font-display text-2xl text-foreground">
            {company.empresa}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {company.setor} · {company.regime}
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow mb-1">Saldo em caixa atual</p>
          <p className="font-display text-4xl tabular-nums text-foreground">
            {brl(company.saldo)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Atualizado agora · {timestamp}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <section className="mt-10">
        <p className="eyebrow mb-6">Projeção de caixa — próximas 12 semanas</p>
        <CashflowChart
          points={points}
          showReforma={reforma}
          firstNegative={firstNegative}
        />
      </section>

      {/* Recomendação */}
      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div
          className="border-l-[3px] bg-surface px-6 py-5"
          style={{ borderColor: rec.tone === 'risk' ? '#E8694A' : '#4FD1A5' }}
        >
          <p className="eyebrow mb-2">Ação recomendada</p>
          <p className="text-pretty leading-relaxed text-foreground">
            {rec.text}
          </p>
          {firstNegative && (
            <p className="mt-3 text-sm tabular-nums text-risk">
              Ponto de cruzamento: {firstNegative.data} ·{' '}
              {brl(firstNegative.saldo)}
            </p>
          )}
        </div>

        {/* Toggle Reforma */}
        <div className="bg-surface px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">
                Simular Reforma Tributária (CBS/IBS)
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Adiciona alíquotas de teste crescentes ao longo de 2026.
              </p>
            </div>
            <button
              role="switch"
              aria-checked={reforma}
              onClick={() => setReforma((r) => !r)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                reforma ? 'bg-gold' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                  reforma ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          {reforma && (
            <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              Baseado no cronograma CBS e IBS (Lei Complementar 214/2025),
              alíquotas de teste crescentes em 2026.
            </p>
          )}
        </div>
      </section>

      {/* Simular cenário */}
      <section className="mt-8 border-t border-border pt-8">
        <button
          onClick={() => setShowScenario((s) => !s)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="eyebrow">Simular cenário</span>
          <ChevronDown
            size={18}
            className={`text-muted-foreground transition-transform ${
              showScenario ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showScenario && (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-foreground">
                  E se eu perder um cliente importante?
                </label>
                <span className="text-sm tabular-nums text-gold">
                  -{perdaCliente}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={perdaCliente}
                onChange={(e) => setPerdaCliente(Number(e.target.value))}
                className="mt-3 w-full accent-[#4FD1A5]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Redução no faturamento mensal
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm text-foreground">
                  E se eu atrasar um pagamento a fornecedor?
                </label>
                <span className="text-sm tabular-nums text-gold">
                  {atrasoFornecedor} dias
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={atrasoFornecedor}
                onChange={(e) => setAtrasoFornecedor(Number(e.target.value))}
                className="mt-3 w-full accent-[#4FD1A5]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Dias de atraso no pagamento
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
