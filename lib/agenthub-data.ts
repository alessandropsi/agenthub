// AgentHub — dados de perfil, validação de CNPJ e lógica de projeção.
// Tudo é determinístico e calculado no frontend. Zero chamadas de rede.

export type Profile = {
  id: number
  empresa: string
  setor: string
  setorKey: 'varejo' | 'servicos' | 'comercio'
  regime: 'Simples Nacional' | 'Lucro Presumido'
  faturamento: number
  contasPagar: number
  saldo: number
  cnpj: string
  complianceScore: number
}

export const PROFILES: Profile[] = [
  {
    id: 0,
    empresa: 'Loja Estação Norte',
    setor: 'E-commerce / Varejo',
    setorKey: 'varejo',
    regime: 'Simples Nacional',
    faturamento: 45000,
    contasPagar: 32000,
    saldo: 18000,
    cnpj: '11.222.333/0001-81',
    complianceScore: 74,
  },
  {
    id: 1,
    empresa: 'Espaço Bela Vista',
    setor: 'Serviços / Salão',
    setorKey: 'servicos',
    regime: 'Simples Nacional',
    faturamento: 28000,
    contasPagar: 19000,
    saldo: 22000,
    cnpj: '22.333.444/0001-81',
    complianceScore: 81,
  },
  {
    id: 2,
    empresa: 'Ferragens Lopes',
    setor: 'Comércio físico',
    setorKey: 'comercio',
    regime: 'Lucro Presumido',
    faturamento: 62000,
    contasPagar: 48000,
    saldo: 12000,
    cnpj: '33.444.555/0001-81',
    complianceScore: 68,
  },
]

// Escolhe perfil de forma determinística a partir do nome.
export function profileFromName(name: string): Profile {
  const sum = name
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return PROFILES[sum % 3]
}

// Formata valores em Real brasileiro.
export function brl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

// Validação de CNPJ pelo algoritmo módulo 11 (função pura, sem rede).
export function isValidCNPJ(raw: string): boolean {
  const cnpj = raw.replace(/[^\d]/g, '')
  if (cnpj.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  const calcDigit = (base: string, weights: number[]) => {
    const sum = base
      .split('')
      .reduce((acc, num, i) => acc + Number(num) * weights[i], 0)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const d1 = calcDigit(cnpj.slice(0, 12), w1)
  const d2 = calcDigit(cnpj.slice(0, 12) + d1, w2)
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13])
}

// Máscara progressiva de CNPJ.
export function maskCNPJ(raw: string): string {
  const d = raw.replace(/[^\d]/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

// Ruído fixo e determinístico (±8%) — não usa Math.random.
const NOISE = [1.04, 0.96, 1.07, 0.93, 1.05, 0.97, 1.02, 0.94, 1.06, 0.95, 1.03, 0.98]

// Incremento percentual da Reforma Tributária por semana.
function reformaRate(week: number): number {
  if (week <= 4) return 0.005
  if (week <= 8) return 0.012
  return 0.021
}

export type ProjectionInput = {
  saldo: number
  faturamento: number
  contasPagar: number
  reforma?: boolean
  perdaCliente?: number // 0 a 0.3
  atrasoFornecedor?: number // 0 a 15 dias
}

export type WeekPoint = {
  week: number
  label: string
  saldo: number
  saldoBase: number
  data: string
}

const HOJE = new Date(2026, 6, 13) // 13/jul/2026 — base fixa da demonstração

function addWeeks(base: Date, weeks: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + weeks * 7)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function projectCashflow(input: ProjectionInput): {
  points: WeekPoint[]
  firstNegative: WeekPoint | null
} {
  const {
    saldo,
    faturamento,
    contasPagar,
    reforma = false,
    perdaCliente = 0,
    atrasoFornecedor = 0,
  } = input

  const entradaSemanal = (faturamento / 4.3) * (1 - perdaCliente)
  const saidaSemanal = contasPagar / 4.3

  const points: WeekPoint[] = []
  let acc = saldo
  let accBase = saldo
  let firstNegative: WeekPoint | null = null

  for (let i = 1; i <= 12; i++) {
    const noise = NOISE[i - 1]
    const entrada = entradaSemanal * noise
    // Atraso de fornecedor adia parte da saída nas primeiras semanas.
    const atrasoFator =
      atrasoFornecedor > 0 && i <= Math.ceil(atrasoFornecedor / 7) ? 0.5 : 1
    const saida = saidaSemanal * atrasoFator
    const custoReforma = reforma ? entrada * reformaRate(i) : 0

    accBase = accBase + entradaSemanal * noise - saidaSemanal
    acc = acc + entrada - saida - custoReforma

    const point: WeekPoint = {
      week: i,
      label: `S${i}`,
      saldo: Math.round(acc),
      saldoBase: Math.round(accBase),
      data: addWeeks(HOJE, i),
    }
    points.push(point)
    if (firstNegative === null && acc < 0) firstNegative = point
  }

  return { points, firstNegative }
}

export function recommendation(
  input: ProjectionInput,
): { tone: 'risk' | 'positive'; text: string } {
  const { points, firstNegative } = projectCashflow(input)
  if (!firstNegative) {
    return {
      tone: 'positive',
      text: 'Seu caixa está saudável para os próximos 90 dias. Continue monitorando semanalmente.',
    }
  }
  const entrada = input.faturamento / 4.3
  const saida = input.contasPagar / 4.3
  const diff = Math.abs(entrada - saida) / saida
  if (diff < 0.15) {
    return {
      tone: 'risk',
      text: `Negocie prazo adicional de 5 a 7 dias com fornecedores para aliviar o caixa em ${firstNegative.data}.`,
    }
  }
  return {
    tone: 'risk',
    text: `Considere antecipar recebíveis ou acessar capital de giro antes de ${firstNegative.data}.`,
  }
  void points
}

// Fornecedores por setor.
export type Fornecedor = { nome: string; valor: number; prazo: number }

export const FORNECEDORES: Record<Profile['setorKey'], Fornecedor[]> = {
  varejo: [
    { nome: 'Distribuidora Alpha', valor: 8200, prazo: 30 },
    { nome: 'Logística Beta', valor: 3400, prazo: 15 },
    { nome: 'Embalagens Gama', valor: 1800, prazo: 7 },
  ],
  servicos: [
    { nome: 'Produtos Profissionais Delta', valor: 4100, prazo: 30 },
    { nome: 'Equipamentos Ômega', valor: 2900, prazo: 15 },
    { nome: 'Materiais Sigma', valor: 1200, prazo: 7 },
  ],
  comercio: [
    { nome: 'Atacado Central', valor: 18000, prazo: 21 },
    { nome: 'Ferramentas Pro', valor: 6500, prazo: 30 },
    { nome: 'Transporte Rápido', valor: 2800, prazo: 7 },
  ],
}

export function negotiationPotential(valor: number): 'Alto' | 'Médio' | 'Baixo' {
  if (valor > 5000) return 'Alto'
  if (valor >= 2000) return 'Médio'
  return 'Baixo'
}

// Calendário fiscal por regime.
export type Obrigacao = { nome: string; data: string; diasRestantes: number }

export function fiscalCalendar(regime: Profile['regime']): Obrigacao[] {
  const ref = HOJE
  const mk = (nome: string, dias: number): Obrigacao => {
    const d = new Date(ref)
    d.setDate(d.getDate() + dias)
    return {
      nome,
      data: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      diasRestantes: dias,
    }
  }
  if (regime === 'Simples Nacional') {
    return [
      mk('DAS — Documento de Arrecadação do Simples', 7),
      mk('PGDAS-D — Declaração mensal', 7),
      mk('DAS (competência seguinte)', 38),
      mk('DEFIS — Declaração anual', 84),
    ]
  }
  return [
    mk('DCTF — Declaração de Débitos e Créditos', 2),
    mk('PIS/Cofins', 12),
    mk('DARF IRPJ/CSLL (trimestral)', 26),
    mk('DCTF (competência seguinte)', 33),
  ]
}
