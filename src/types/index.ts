export type DebtStatus = 'ativo' | 'atrasado' | 'liquidado'
export type CalculationMode = 'crediario' | 'juros'

export interface PaymentEntry {
  id: string
  date: string
  amount: number
  installmentIndex: number
}

export interface Contract {
  id: string
  clientName: string
  whatsapp: string
  itemDescription: string
  originalValue: number
  totalToPay: number
  installmentsCount: number
  interestRate: number
  status: 'ativo' | 'atrasado' | 'liquidado'
  paidInstallments: number
  paymentsLog: PaymentEntry[]
  startDate: string
  createdAt: string
  updatedAt: string
}

export type ContractStatus = 'ativo' | 'atrasado' | 'liquidado'

export interface GlobalMetrics {
  totalReceivable: number
  totalOriginal: number
  totalProfit: number
  activeDebts: number
  overdueDebts: number
}

export interface UserConfig {
  ownerName: string
  privacyMode: boolean
  accessPin: string
  lastBackup: string
}
