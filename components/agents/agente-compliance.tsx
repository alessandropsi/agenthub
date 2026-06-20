'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useAgentHub } from '../agenthub-context'
import { Processing } from '../processing'
import { PROFILES } from '@/lib/agenthub-data'

export function AgenteCompliance() {
  const { profile, company } = useAgentHub()
  const active =
    profile ?? PROFILES.find((p) => p.setor === company?.setor) ?? PROFILES[0]
  const score = active.complianceScore

  const [ready, setReady] = useState(false)

  if (!ready) {
    return (
      <Processing
        label="Verificando conformidade trabalhista…"
        duration={2500}
        onDone={() => setReady(true)}
      />
    )
  }

  const risco =
    active.id === 1
      ? 'Avaliar enquadramento de colaboradores freelance — risco de vínculo empregatício.'
      : 'Verificar aplicação de dissídio coletivo — possível defasagem salarial acima de 12 meses.'

  return (
    <div className="animate-screen-in flex flex-col gap-10">
      <div className="flex flex-col items-center">
        <p className="eyebrow mb-4">Score de compliance</p>
        <Gauge value={score} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-risk" />
            <span className="eyebrow">Riscos identificados</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{risco}</p>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-positive" />
            <span className="eyebrow">Pontos em conformidade</span>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-foreground">
            <li>FGTS recolhido regularmente</li>
            <li>Jornada de trabalho dentro do limite legal</li>
            <li>Férias sem acúmulo crítico</li>
          </ul>
        </div>
      </div>

      <div
        className="border-l-[3px] bg-surface px-6 py-5"
        style={{ borderColor: '#C9A961' }}
      >
        <p className="leading-relaxed text-foreground">
          Agende uma revisão com seu contador nos próximos 30 dias para
          regularizar os pontos identificados. O AgentHub monitorará
          automaticamente novos riscos.
        </p>
      </div>
    </div>
  )
}

function Gauge({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const color = value > 75 ? '#4FD1A5' : value >= 50 ? '#C9A961' : '#E8694A'

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / 1000)
      setDisplay(Math.round(t * value))
      if (t >= 1) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [value])

  // Semicírculo de 180°: ângulo da agulha de -90° (0) a +90° (100)
  const angle = -90 + (display / 100) * 180
  const r = 90
  const cx = 110
  const cy = 110

  return (
    <div className="relative">
      <svg width="220" height="130" viewBox="0 0 220 130">
        {/* arco de fundo */}
        <path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke="#243530"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* arco preenchido */}
        <path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={Math.PI * r}
          strokeDashoffset={Math.PI * r * (1 - display / 100)}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        {/* agulha */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + r * 0.78 * Math.cos((angle - 90) * (Math.PI / 180))}
          y2={cy + r * 0.78 * Math.sin((angle - 90) * (Math.PI / 180))}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill={color} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <span
          className="font-display text-4xl tabular-nums"
          style={{ color }}
        >
          {display}
        </span>
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
    </div>
  )
}
