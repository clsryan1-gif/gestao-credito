import { Debt, DebtStatus, GlobalMetrics, PaymentEntry } from '@/types'

const STORAGE_KEY = 'g_credito_db_v2'

export const gStore = {
  getDebts: (): Debt[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveDebt: (debt: Debt) => {
    const debts = gStore.getDebts()
    debts.push(debt)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debts))
  },

  updateDebt: (updated: Debt) => {
    const debts = gStore.getDebts()
    const index = debts.findIndex(d => d.id === updated.id)
    if (index !== -1) {
      debts[index] = { ...updated, updatedAt: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(debts))
    }
  },

  deleteDebt: (id: string) => {
    const debts = gStore.getDebts()
    const filtered = debts.filter(d => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },

  liquidateInstallment: (debtId: string) => {
    const debts = gStore.getDebts()
    const index = debts.findIndex(d => d.id === debtId)
    if (index !== -1) {
      const debt = debts[index]
      if (debt.paidCount >= debt.installmentsCount) return debt

      const nextIndex = debt.paidCount + 1
      const installmentValue = debt.totalToPay / debt.installmentsCount
      
      const newPayment: PaymentEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount: parseFloat(installmentValue.toFixed(2)),
        installmentIndex: nextIndex
      }

      const updated: Debt = {
        ...debt,
        paidCount: nextIndex,
        payments: [...(debt.payments || []), newPayment],
        status: nextIndex >= debt.installmentsCount ? 'liquidado' : debt.status,
        updatedAt: new Date().toISOString()
      }

      debts[index] = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(debts))
      return updated
    }
    return null
  },

  getMetrics: (): GlobalMetrics => {
    const debts = gStore.getDebts()
    const metrics: GlobalMetrics = {
      totalReceivable: 0,
      totalOriginal: 0,
      totalProfit: 0,
      activeDebts: 0,
      overdueDebts: 0
    }

    debts.forEach(d => {
      metrics.totalReceivable += d.totalToPay
      metrics.totalOriginal += d.originalAmount
      
      if (d.status === 'ativo') metrics.activeDebts++
      if (d.status === 'atrasado') {
        metrics.activeDebts++
        metrics.overdueDebts++
      }
    })

    metrics.totalProfit = metrics.totalReceivable - metrics.totalOriginal
    return metrics
  }
}

// Utilitários de Cálculo
export function calculateDebt(
  amount: number,
  installments: number,
  interest: number,
  mode: 'crediario' | 'juros' = 'crediario'
) {
  if (mode === 'crediario') {
    const totalToPay = amount * (1 + interest / 100)
    return {
      totalToPay: parseFloat(totalToPay.toFixed(2)),
      installmentValue: parseFloat((totalToPay / installments).toFixed(2)),
      profit: parseFloat((totalToPay - amount).toFixed(2))
    }
  }
  
  // Juros Simples
  const totalToPay = amount + (amount * (interest / 100) * installments)
  return {
    totalToPay: parseFloat(totalToPay.toFixed(2)),
    installmentValue: parseFloat((totalToPay / installments).toFixed(2)),
    profit: parseFloat((totalToPay - amount).toFixed(2))
  }
}
