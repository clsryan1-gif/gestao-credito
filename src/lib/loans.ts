import { CalculationResult, CalculationType, Loan } from '../types'

export function calculateLoan(
  amount: number,
  installments: number,
  interest: number,
  interestType: CalculationType
): CalculationResult {
  // Para amigos, geralmente é juros simples por período
  // Mas vamos aplicar uma lógica de juros compostos por período para ser mais "gestão de crédito"
  // F = P * (1 + i)^n
  const i = interest / 100
  const n = installments
  
  const totalToPay = amount * Math.pow(1 + i, n)
  const installmentValue = totalToPay / installments
  const interestValue = totalToPay - amount

  return {
    totalToPay: parseFloat(totalToPay.toFixed(2)),
    installmentValue: parseFloat(installmentValue.toFixed(2)),
    interestValue: parseFloat(interestValue.toFixed(2)),
  }
}

export const loanService = {
  getLoans: (): Loan[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('gestao_credito_loans')
    return data ? JSON.parse(data) : []
  },

  saveLoan: (loan: Loan) => {
    const loans = loanService.getLoans()
    loans.push(loan)
    localStorage.setItem('gestao_credito_loans', JSON.stringify(loans))
  },

  deleteLoan: (id: string) => {
    const loans = loanService.getLoans()
    const filtered = loans.filter((l) => l.id !== id)
    localStorage.setItem('gestao_credito_loans', JSON.stringify(filtered))
  },

  updateLoan: (loan: Loan) => {
    const loans = loanService.getLoans()
    const index = loans.findIndex((l) => l.id === loan.id)
    if (index !== -1) {
      loans[index] = loan
      localStorage.setItem('gestao_credito_loans', JSON.stringify(loans))
    }
  },

  addPayment: (loanId: string, amount: number) => {
    const loans = loanService.getLoans()
    const index = loans.findIndex((l) => l.id === loanId)
    if (index !== -1) {
      const loan = loans[index]
      const newPayment = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount: amount,
        installmentNumber: (loan.paidInstallments || 0) + 1
      }
      
      const updatedLoan: Loan = {
        ...loan,
        paidInstallments: (loan.paidInstallments || 0) + 1,
        payments: [...(loan.payments || []), newPayment],
        status: (loan.paidInstallments + 1 >= loan.installments) ? 'pago' : 'ativo'
      }
      
      loans[index] = updatedLoan
      localStorage.setItem('gestao_credito_loans', JSON.stringify(loans))
      return updatedLoan
    }
    return null
  }
}
