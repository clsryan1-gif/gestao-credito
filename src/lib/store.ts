import { Contract, GlobalMetrics, PaymentEntry, UserConfig } from '@/types'
import { supabase } from './supabase'

const STORAGE_KEY = 'g_credito_contracts_v3'
const CONFIG_KEY = 'g_credito_config'

// G-Store 3.0: Engine Profissional Cloud + Local
export const gStore = {
  // --- SYNC ENGINE ---
  
  // Sincronizar dados locais com a nuvem (PostgreSQL)
  syncFromCloud: async (): Promise<Contract[]> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return gStore.getContractsLocal()

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao sincronizar:', error)
      return gStore.getContractsLocal()
    }

    // Mapeamento: snake_case (SQL) -> camelCase (App)
    const cloudContracts: Contract[] = data.map(d => ({
      id: d.id,
      clientName: d.client_name,
      whatsapp: d.whatsapp,
      itemDescription: d.item_description,
      originalValue: parseFloat(d.original_value),
      totalToPay: parseFloat(d.total_to_pay),
      installmentsCount: d.installments_count,
      interestRate: parseFloat(d.interest_rate),
      status: d.status,
      paidInstallments: d.paid_installments,
      paymentsLog: d.payments_log || [],
      startDate: d.start_date,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudContracts))
    return cloudContracts
  },

  // Salvar/Atualizar no Cloud (PostgreSQL)
  saveContract: async (contract: Contract) => {
    const { data: { session } } = await supabase.auth.getSession()
    
    // Interface para o Supabase (snake_case)
    const payload = {
      id: contract.id,
      user_id: session?.user.id,
      client_name: contract.clientName,
      whatsapp: contract.whatsapp,
      item_description: contract.itemDescription,
      original_value: contract.originalValue,
      total_to_pay: contract.totalToPay,
      installments_count: contract.installmentsCount,
      paid_installments: contract.paidInstallments,
      interest_rate: contract.interestRate,
      status: contract.status,
      payments_log: contract.paymentsLog,
      updated_at: new Date().toISOString()
    }

    // Local First
    const contracts = gStore.getContractsLocal()
    const index = contracts.findIndex(c => c.id === contract.id)
    if (index !== -1) {
      contracts[index] = contract
    } else {
      contracts.push(contract)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts))

    // Cloud Second
    if (session) {
      const { error } = await supabase.from('contracts').upsert(payload)
      if (error) console.error('Erro saving cloud:', error)
    }
  },

  deleteContract: async (id: string) => {
    // Local
    const contracts = gStore.getContractsLocal()
    const filtered = contracts.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))

    // Cloud
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('contracts').delete().eq('id', id)
    }
  },

  getContractsLocal: (): Contract[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  // Liquidar parcelas
  liquidateInstallment: async (id: string) => {
    const contracts = gStore.getContractsLocal()
    const index = contracts.findIndex(c => c.id === id)
    if (index !== -1) {
      const contract = contracts[index]
      if (contract.paidInstallments >= contract.installmentsCount) return contract

      const nextIndex = contract.paidInstallments + 1
      const installmentValue = contract.totalToPay / contract.installmentsCount
      
      const newPayment: PaymentEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount: parseFloat(installmentValue.toFixed(2)),
        installmentIndex: nextIndex
      }

      const updated: Contract = {
        ...contract,
        paidInstallments: nextIndex,
        paymentsLog: [...(contract.paymentsLog || []), newPayment],
        status: nextIndex >= contract.installmentsCount ? 'liquidado' : contract.status,
        updatedAt: new Date().toISOString()
      }

      await gStore.saveContract(updated)
      return updated
    }
    return null
  },

  removeLatestPayment: async (id: string) => {
    const contracts = gStore.getContractsLocal()
    const index = contracts.findIndex(c => c.id === id)
    if (index !== -1) {
      const contract = contracts[index]
      if (contract.paidInstallments === 0) return contract

      const log = [...(contract.paymentsLog || [])]
      log.pop()

      const updated: Contract = {
        ...contract,
        paidInstallments: contract.paidInstallments - 1,
        paymentsLog: log,
        status: (contract.paidInstallments - 1) === 0 ? 'ativo' : contract.status,
        updatedAt: new Date().toISOString()
      }

      await gStore.saveContract(updated)
      return updated
    }
    return null
  },

  // Monitor de Métricas Global
  getMetrics: (): GlobalMetrics => {
    const contracts = gStore.getContractsLocal()
    const metrics: GlobalMetrics = {
      totalReceivable: 0,
      totalOriginal: 0,
      totalProfit: 0,
      activeDebts: 0,
      overdueDebts: 0
    }

    contracts.forEach(c => {
      metrics.totalReceivable += c.totalToPay
      metrics.totalOriginal += c.originalValue
      
      if (c.status === 'ativo') metrics.activeDebts++
      if (c.status === 'atrasado') {
        metrics.activeDebts++
        metrics.overdueDebts++
      }
    })

    metrics.totalProfit = metrics.totalReceivable - metrics.totalOriginal
    return metrics
  },

  // --- CONFIGURAÇÕES ---
  getConfig: (): UserConfig => {
    if (typeof window === 'undefined') return { ownerName: '', privacyMode: false, accessPin: '', lastBackup: '' }
    const data = localStorage.getItem(CONFIG_KEY)
    return data ? JSON.parse(data) : { ownerName: '', privacyMode: false, accessPin: '', lastBackup: '' }
  },

  saveConfig: (config: UserConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  },

  exportBackup: () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `backup_g_credito_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  },

  importBackup: (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent)
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, jsonContent)
        return true
      }
      return false
    } catch (e) {
      return false
    }
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
  
  const totalToPay = amount + (amount * (interest / 100) * installments)
  return {
    totalToPay: parseFloat(totalToPay.toFixed(2)),
    installmentValue: parseFloat((totalToPay / installments).toFixed(2)),
    profit: parseFloat((totalToPay - amount).toFixed(2))
  }
}
