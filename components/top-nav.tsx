'use client'

import { useAgentHub, type Screen } from './agenthub-context'

const ITEMS: { key: Screen; label: string }[] = [
  { key: 'home', label: 'Início' },
  { key: 'painel', label: 'Painel Preditivo' },
  { key: 'whatsapp', label: 'Modo WhatsApp' },
  { key: 'agentes', label: 'Agentes' },
  { key: 'plataforma', label: 'Plataforma' },
]

export function TopNav() {
  const { screen, navigate, userName, logout } = useAgentHub()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <button
          onClick={() => navigate('home')}
          className="font-display text-lg tracking-tight text-foreground"
        >
          AgentHub
        </button>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                screen === item.key
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {screen === item.key && (
                <span className="mt-1 block h-px w-full bg-positive" />
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {userName}
          </span>
          <button
            onClick={logout}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Navegação mobile */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t px-5 py-2 md:hidden">
        {ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.key)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
              screen === item.key
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
