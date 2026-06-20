'use client'

import { useAgentHub } from './agenthub-context'
import { TopNav } from './top-nav'
import { LoginScreen } from './screens/login-screen'
import { HomeScreen } from './screens/home-screen'
import { PainelScreen } from './screens/painel-screen'
import { WhatsappScreen } from './screens/whatsapp-screen'
import { AgentesScreen } from './screens/agentes-screen'
import { PlataformaScreen } from './screens/plataforma-screen'

export function AgentHubApp() {
  const { screen } = useAgentHub()

  if (screen === 'login') {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      {screen === 'home' && <HomeScreen />}
      {screen === 'painel' && <PainelScreen />}
      {screen === 'whatsapp' && <WhatsappScreen />}
      {screen === 'agentes' && <AgentesScreen />}
      {screen === 'plataforma' && <PlataformaScreen />}
    </div>
  )
}
