export type CalculationType = 'diario' | 'semanal' | 'mensal'

export interface Payment {
  id: string
  date: string
  amount: number
  installmentNumber: number
}

export interface Loan {
  id: string
  name: string
  amount: number
  installments: number
  interest: number
  interestType: CalculationType
  startDate: string
  paidInstallments: number
  totalAmount: number
  status: 'ativo' | 'pago' | 'atrasado'
  type?: 'emprestimo' | 'venda'
  itemName?: string
  quantity?: number
  unitPrice?: number
  downPayment?: number
  whatsapp?: string
  payments?: Payment[]
}

export interface CalculationResult {
  totalToPay: number
  installmentValue: number
  interestValue: number
}
