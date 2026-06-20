'use client'

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { type Profile, profileFromName } from '@/lib/agenthub-data'

export type Screen =
  | 'login'
  | 'home'
  | 'painel'
  | 'whatsapp'
  | 'agentes'
  | 'plataforma'

export type Company = {
  empresa: string
  cnpj: string
  setor: string
  regime: Profile['regime']
  faturamento: number
  contasPagar: number
  saldo: number
}

type AgentHubState = {
  userName: string
  profile: Profile | null
  company: Company | null
  screen: Screen
  login: (name: string) => void
  setCompany: (company: Company) => void
  navigate: (screen: Screen) => void
  logout: () => void
}

const AgentHubContext = createContext<AgentHubState | null>(null)

export function AgentHubProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [company, setCompanyState] = useState<Company | null>(null)
  const [screen, setScreen] = useState<Screen>('login')

  function login(name: string) {
    const p = profileFromName(name)
    setUserName(name)
    setProfile(p)
    setCompanyState({
      empresa: p.empresa,
      cnpj: p.cnpj,
      setor: p.setor,
      regime: p.regime,
      faturamento: p.faturamento,
      contasPagar: p.contasPagar,
      saldo: p.saldo,
    })
    setScreen('home')
  }

  function setCompany(c: Company) {
    setCompanyState(c)
  }

  function navigate(s: Screen) {
    setScreen(s)
  }

  function logout() {
    setUserName('')
    setProfile(null)
    setCompanyState(null)
    setScreen('login')
  }

  return (
    <AgentHubContext.Provider
      value={{
        userName,
        profile,
        company,
        screen,
        login,
        setCompany,
        navigate,
        logout,
      }}
    >
      {children}
    </AgentHubContext.Provider>
  )
}

export function useAgentHub() {
  const ctx = useContext(AgentHubContext)
  if (!ctx) throw new Error('useAgentHub deve ser usado dentro de AgentHubProvider')
  return ctx
}
