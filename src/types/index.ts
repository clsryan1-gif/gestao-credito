export type DebtStatus = 'ativo' | 'atrasado' | 'liquidado'
export type CalculationMode = 'crediario' | 'juros'

export interface PaymentEntry {
  id: string
  date: string
  amount: number
  installmentIndex: number
}

export interface Debt {
  id: string
  clientName: string
  whatsapp: string
  itemName: string
  
  // Financeiro
  originalAmount: number
  totalToPay: number
  installmentsCount: number
  interestRate: number
  mode: CalculationMode
  
  // Progresso
  paidCount: number
  startDate: string
  status: DebtStatus
  
  // Metadados
  payments: PaymentEntry[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface GlobalMetrics {
  totalReceivable: number
  totalOriginal: number
  totalProfit: number
  activeDebts: number
  overdueDebts: number
}
