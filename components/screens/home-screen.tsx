'use client'

import { useState } from 'react'
import { Grid3x3, Layers, MessageCircle, TrendingDown } from 'lucide-react'
import { useAgentHub, type Screen } from '../agenthub-context'
import { LiveDemo } from '../live-demo'
import {
  brl,
  isValidCNPJ,
  maskCNPJ,
  PROFILES,
  type Profile,
} from '@/lib/agenthub-data'

const FEATURES: {
  icon: typeof TrendingDown
  title: string
  desc: string
  target: Screen
}[] = [
  {
    icon: TrendingDown,
    title: 'Painel Preditivo',
    desc: 'Projeção de 90 dias do seu caixa',
    target: 'painel',
  },
  {
    icon: MessageCircle,
    title: 'Modo WhatsApp',
    desc: 'Converse com o agente pelo WhatsApp',
    target: 'whatsapp',
  },
  {
    icon: Layers,
    title: 'Agentes Disponíveis',
    desc: 'Fiscal, Precificação, Negociação, Compliance',
    target: 'agentes',
  },
  {
    icon: Grid3x3,
    title: 'Plataforma AgentHub',
    desc: 'Conheça a visão completa do produto',
    target: 'plataforma',
  },
]

const SETORES = [
  'E-commerce / Varejo',
  'Serviços / Salão',
  'Comércio físico',
  'Indústria',
  'Alimentação',
]
const REGIMES: Profile['regime'][] = ['Simples Nacional', 'Lucro Presumido']

export function HomeScreen() {
  const { userName, company, setCompany, navigate } = useAgentHub()
  const [form, setForm] = useState(() => ({
    empresa: company?.empresa ?? PROFILES[0].empresa,
    cnpj: company?.cnpj ?? PROFILES[0].cnpj,
    setor: company?.setor ?? PROFILES[0].setor,
    regime: company?.regime ?? PROFILES[0].regime,
    faturamento: company?.faturamento ?? PROFILES[0].faturamento,
    contasPagar: company?.contasPagar ?? PROFILES[0].contasPagar,
    saldo: company?.saldo ?? PROFILES[0].saldo,
  }))

  const cnpjValid = isValidCNPJ(form.cnpj)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCompany(form)
    navigate('painel')
  }

  return (
    <main className="animate-screen-in mx-auto max-w-6xl px-5 py-12">
      {/* SEÇÃO 1 — Hero split-screen */}
      <section className="grid gap-px border border-border md:grid-cols-[55fr_45fr]">
        <div className="flex flex-col justify-center gap-6 bg-background p-8 sm:p-10">
          <p className="eyebrow">Bem-vindo, {userName}</p>
          <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
            AgentHub
          </h1>
          <p className="text-pretty text-base leading-relaxed text-foreground sm:text-lg">
            O AgentHub analisa os dados financeiros da sua empresa e mostra, com
            antecedência, quando o seu caixa vai entrar em risco — antes que o
            problema aconteça. Você vê o futuro do seu dinheiro, recebe uma
            recomendação de ação, e ainda simula como a Reforma Tributária vai
            impactar sua margem nos próximos meses.
          </p>
          <ul className="flex flex-col gap-2 text-sm text-foreground">
            {[
              'Projeção de caixa para os próximos 90 dias',
              'Alerta antecipado de risco financeiro',
              'Simulação do impacto da Reforma Tributária (CBS/IBS)',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-gold">✦</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <LiveDemo />
      </section>

      {/* SEÇÃO 2 — Botões de funcionalidades */}
      <section className="mt-16 border-t border-border pt-10">
        <p className="eyebrow mb-6">Explore as funcionalidades</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <button
                key={f.title}
                onClick={() => navigate(f.target)}
                className="group flex flex-col items-start gap-3 rounded-md border border-border bg-surface p-5 text-left transition-colors hover:border-positive"
              >
                <Icon
                  size={24}
                  className="text-muted-foreground transition-colors group-hover:text-positive"
                />
                <span className="font-medium text-foreground">{f.title}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* SEÇÃO 3 — Formulário de cadastro */}
      <section className="mt-16 border-t border-border pt-10">
        <p className="eyebrow mb-2">Dados da sua empresa</p>
        <p className="mb-8 text-sm text-muted-foreground">
          Confira ou ajuste os dados pré-preenchidos para personalizar sua
          projeção.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Field label="Nome da empresa">
              <input
                value={form.empresa}
                onChange={(e) => update('empresa', e.target.value)}
                className="field-input"
              />
            </Field>
            <Field
              label="CNPJ"
              hint={
                form.cnpj.replace(/\D/g, '').length === 14
                  ? cnpjValid
                    ? { text: 'CNPJ válido ✓', tone: 'positive' }
                    : { text: 'Verifique os dígitos do CNPJ', tone: 'muted' }
                  : undefined
              }
            >
              <input
                value={form.cnpj}
                onChange={(e) => update('cnpj', maskCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="field-input"
              />
            </Field>
            <Field label="Setor">
              <select
                value={form.setor}
                onChange={(e) => update('setor', e.target.value)}
                className="field-input"
              >
                {SETORES.map((s) => (
                  <option key={s} value={s} className="bg-surface">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Regime tributário">
              <select
                value={form.regime}
                onChange={(e) =>
                  update('regime', e.target.value as Profile['regime'])
                }
                className="field-input"
              >
                {REGIMES.map((r) => (
                  <option key={r} value={r} className="bg-surface">
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex flex-col gap-6">
            <Field label={`Faturamento médio mensal — ${brl(form.faturamento)}`}>
              <input
                type="number"
                value={form.faturamento}
                onChange={(e) => update('faturamento', Number(e.target.value))}
                className="field-input tnum"
              />
            </Field>
            <Field label={`Contas a pagar recorrentes/mês — ${brl(form.contasPagar)}`}>
              <input
                type="number"
                value={form.contasPagar}
                onChange={(e) => update('contasPagar', Number(e.target.value))}
                className="field-input tnum"
              />
            </Field>
            <Field label={`Saldo em caixa atual — ${brl(form.saldo)}`}>
              <input
                type="number"
                value={form.saldo}
                onChange={(e) => update('saldo', Number(e.target.value))}
                className="field-input tnum"
              />
            </Field>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md bg-positive py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 md:col-span-2"
          >
            Ver minha projeção →
          </button>
        </form>
      </section>
    </main>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: { text: string; tone: 'positive' | 'muted' }
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
      {hint && (
        <span
          className={`text-xs ${
            hint.tone === 'positive' ? 'text-positive' : 'text-muted-foreground'
          }`}
        >
          {hint.text}
        </span>
      )}
    </label>
  )
}
