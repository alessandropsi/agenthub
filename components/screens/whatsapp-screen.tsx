'use client'

import { useEffect, useRef, useState } from 'react'

type Msg = { from: 'user' | 'bot'; text: string; delay: number }

const SCRIPT: Msg[] = [
  { from: 'user', text: 'AgentHub, como tá meu caixa esse mês?', delay: 600 },
  {
    from: 'bot',
    text: 'Seu saldo atual é R$ 18.000. No ritmo atual, você fica negativo na semana de 18/ago. Quer que eu simule como evitar isso?',
    delay: 1500,
  },
  { from: 'user', text: 'Quero sim', delay: 900 },
  {
    from: 'bot',
    text: 'Se você atrasar o pagamento do fornecedor principal em 6 dias, seu caixa fica positivo até o fim do mês. Posso te lembrar disso na quinta-feira?',
    delay: 1000,
  },
  { from: 'user', text: 'Pode. E a reforma tributária vai afetar meu preço?', delay: 1200 },
  {
    from: 'bot',
    text: 'Vai sim. Com CBS e IBS, sua margem aperta gradualmente a partir de abril. Recomendo revisar seu preço em até 60 dias. Quer ver a simulação completa?',
    delay: 2000,
  },
]

export function WhatsappScreen() {
  const [visible, setVisible] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    async function run() {
      for (let i = 0; i < SCRIPT.length; i++) {
        const msg = SCRIPT[i]
        await new Promise<void>((resolve) => {
          if (msg.from === 'bot') setTyping(true)
          const t = setTimeout(() => {
            if (cancelled) return resolve()
            setTyping(false)
            setVisible((v) => [...v, msg])
            resolve()
          }, msg.delay)
          timers.push(t)
        })
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [visible, typing])

  return (
    <main className="animate-screen-in mx-auto flex max-w-2xl flex-col items-center px-5 py-12">
      <p className="eyebrow mb-2 text-center">Modo WhatsApp</p>
      <h1 className="mb-8 text-center font-display text-2xl text-foreground">
        O AgentHub vive onde você já está
      </h1>

      {/* Moldura do celular */}
      <div className="w-full max-w-[390px] overflow-hidden rounded-[28px] border border-border">
        {/* Barra superior */}
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
            AH
          </div>
          <div>
            <p className="text-sm font-medium text-white">AgentHub</p>
            <p className="text-xs text-white/70">online</p>
          </div>
        </div>

        {/* Conversa */}
        <div
          ref={scrollRef}
          className="flex h-[460px] flex-col gap-2 overflow-y-auto bg-[#E5DDD5] p-4"
        >
          {visible.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed text-[#111] ${
                m.from === 'user'
                  ? 'self-end bg-[#DCF8C6]'
                  : 'self-start bg-white'
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="self-start rounded-lg bg-white px-3 py-2 text-sm text-[#667781]">
              digitando…
            </div>
          )}
        </div>

        {/* Input desabilitado */}
        <div className="flex items-center gap-2 bg-[#F0F0F0] px-3 py-2">
          <div className="flex-1 rounded-full bg-white px-4 py-2 text-sm text-[#999]">
            Digite uma mensagem
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
        Simulação da experiência via WhatsApp Business API — em produção, o
        AgentHub responde diretamente no seu WhatsApp.
      </p>
    </main>
  )
}
