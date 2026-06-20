'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useAgentHub } from '../agenthub-context'

export function LoginScreen() {
  const { login } = useAgentHub()
  const [name, setName] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const valid = name.trim().length >= 2

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (valid) login(name.trim())
  }

  return (
    <main className="animate-screen-in flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <p className="eyebrow mb-6">Copiloto financeiro preditivo</p>
        <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
          AgentHub
        </h1>
        <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
          Veja o futuro do caixa da sua empresa antes que ele aconteça.
        </p>

        <form onSubmit={handleSubmit} className="mt-12 w-full">
          <label
            htmlFor="name"
            className="eyebrow mb-3 block text-left"
          >
            Como você se chama?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="w-full border-b border-border bg-transparent pb-2 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-positive"
            placeholder="Digite seu nome"
          />

          <button
            type="submit"
            disabled={!valid}
            className="mt-8 w-full rounded-md bg-positive py-3 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={() => setShowGuide(true)}
          className="mt-6 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Está avaliando este projeto? Veja como explorar →
        </button>
      </div>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6 backdrop-blur-sm"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="animate-screen-in relative w-full max-w-lg border border-border bg-surface p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuide(false)}
              aria-label="Fechar"
              className="absolute right-5 top-5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl text-foreground">
              Como explorar o AgentHub
            </h2>
            <ol className="mt-6 flex flex-col gap-4">
              {[
                'Na Página Inicial, veja o painel animado de demonstração ao vivo.',
                'Explore as funcionalidades pelos botões antes de preencher qualquer dado.',
                'No Painel Preditivo, ative o toggle de Reforma Tributária e veja a curva mudar.',
                'Use os sliders de "Simular Cenário" — o gráfico responde em tempo real.',
                'Acesse o Modo WhatsApp para ver o agente respondendo como no WhatsApp.',
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-display text-lg text-gold tnum">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-8 rounded-md border border-border px-5 py-2 text-sm text-foreground transition-colors hover:border-positive"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
