'use client'

const AGENTS = [
  {
    nome: 'Fluxo de Caixa Preditivo',
    desc: 'Veja o futuro do seu caixa antes que ele aconteça.',
    status: 'Disponível agora',
    tone: 'positive' as const,
  },
  {
    nome: 'Agente Fiscal',
    desc: 'Alertas antecipados sobre obrigações e mudanças tributárias.',
    status: 'Demonstração',
    tone: 'gold' as const,
  },
  {
    nome: 'Agente de Precificação',
    desc: 'Preço ideal calculado a partir do seu custo real e do mercado.',
    status: 'Demonstração',
    tone: 'gold' as const,
  },
  {
    nome: 'Agente de Negociação com Fornecedores',
    desc: 'Melhores condições de pagamento, negociadas com dados.',
    status: 'Demonstração',
    tone: 'gold' as const,
  },
  {
    nome: 'Agente de Compliance Trabalhista',
    desc: 'Evite passivos trabalhistas antes que eles aconteçam.',
    status: 'Demonstração',
    tone: 'gold' as const,
  },
]

export function PlataformaScreen() {
  return (
    <main className="animate-screen-in mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow mb-4">Plataforma AgentHub</p>
      <h1 className="max-w-3xl text-balance font-display text-3xl leading-tight text-foreground sm:text-4xl">
        O AgentHub está construindo o copiloto financeiro completo para PMEs
        brasileiras.
      </h1>

      <ul className="mt-12 border-t border-border">
        {AGENTS.map((a, i) => (
          <li
            key={a.nome}
            className="flex flex-wrap items-center gap-4 border-b border-border py-6"
          >
            <span className="font-display text-lg tabular-nums text-gold">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{a.nome}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {a.desc}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                a.tone === 'positive'
                  ? 'border-positive/40 text-positive'
                  : 'border-gold/40 text-gold'
              }`}
            >
              {a.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-2xl border-t border-border pt-8 font-display text-lg italic leading-relaxed text-muted-foreground">
        Todos os agentes compartilham a mesma base de dados financeiros e
        operacionais da sua empresa — quanto mais você usa o AgentHub, mais
        inteligente ele fica.
      </p>
    </main>
  )
}
