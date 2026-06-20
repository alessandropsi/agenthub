'use client'

import { useEffect, useState } from 'react'

type Props = {
  label: string
  duration?: number
  onDone: () => void
}

// Barra de progresso de "processamento" antes de revelar resultados.
export function Processing({ label, duration = 1500, onDone }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(id)
        onDone()
      }
    }, 40)
    return () => clearInterval(id)
  }, [duration, onDone])

  return (
    <div className="animate-screen-in flex flex-col gap-3 py-10">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="h-px w-full overflow-hidden bg-border">
        <div
          className="h-full bg-positive transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
