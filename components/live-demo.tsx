'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { brl } from '@/lib/agenthub-data'

const SEQUENCE = [28400, 27800, 28950, 27200, 28600]

export function LiveDemo() {
  const [index, setIndex] = useState(0)
  const [alertState, setAlertState] = useState<'A' | 'B'>('A')
  const [alertVisible, setAlertVisible] = useState(true)

  // Oscilação do saldo a cada 2s.
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SEQUENCE.length)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  // Alternância do card de alerta: 4s visível, fade 2s, troca.
  useEffect(() => {
    const cycle = setInterval(() => {
      setAlertVisible(false)
      const swap = setTimeout(() => {
        setAlertState((s) => (s === 'A' ? 'B' : 'A'))
        setAlertVisible(true)
      }, 2000)
      return () => clearTimeout(swap)
    }, 6000)
    return () => clearInterval(cycle)
  }, [])

  const current = SEQUENCE[index]
  const previous = SEQUENCE[(index - 1 + SEQUENCE.length) % SEQUENCE.length]
  const rising = current >= previous

  return (
    <div className="flex flex-col gap-6 bg-surface p-8">
      <p className="eyebrow">Demonstração ao vivo — dados fictícios</p>

      <div>
        <p className="eyebrow mb-2">Saldo projetado — semana 4</p>
        <p className="font-display text-5xl tabular-nums tracking-tight text-foreground transition-all duration-500">
          {brl(current)}
        </p>
        <div
          className={`mt-3 flex items-center gap-2 text-sm ${
            rising ? 'text-positive' : 'text-risk'
          }`}
        >
          {rising ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{rising ? 'tendência de alta' : 'tendência de queda'}</span>
        </div>
      </div>

      <div
        className="border-l-[3px] border-risk bg-background/40 px-4 py-3 transition-opacity duration-700"
        style={{ opacity: alertVisible ? 1 : 0 }}
      >
        {alertState === 'A' ? (
          <p className="text-sm leading-relaxed text-foreground">
            <span className="text-risk">⚠</span> Risco de caixa negativo em
            18/ago — R$ -3.200 projetado
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">
            <span className="text-positive">✓</span> Atrasar fornecedor 6 dias
            resolve o problema
          </p>
        )}
      </div>
    </div>
  )
}
