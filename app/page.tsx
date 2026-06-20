import { AgentHubProvider } from '@/components/agenthub-context'
import { AgentHubApp } from '@/components/agenthub-app'

export default function Page() {
  return (
    <AgentHubProvider>
      <AgentHubApp />
    </AgentHubProvider>
  )
}
