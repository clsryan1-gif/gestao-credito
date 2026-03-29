'use client'

import { useState } from 'react'
import { PlusCircle, Wallet, Percent, Clock, Package, UserCircle2, Phone } from 'lucide-react'
import { Button } from './Button'
import { calculateDebt } from '@/lib/store'
import { Contract } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'
import { gStore } from '@/lib/store'

interface ContractFormProps {
  onAdd: () => void
}

export function ContractForm({ onAdd }: ContractFormProps) {
  const [mode, setMode] = useState<'juros' | 'crediario'>('crediario')
  const [formData, setFormData] = useState({
    clientName: '',
    itemDescription: '',
    originalValue: '',
    installments: '5',
    interest: '30',
    whatsapp: ''
  })

  const amountNum = parseFloat(formData.originalValue) || 0
  const installmentsNum = parseInt(formData.installments) || 1
  const interestNum = parseFloat(formData.interest) || 0
  
  const result = calculateDebt(amountNum, installmentsNum, interestNum, mode)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName || !amountNum || !formData.itemDescription) return

    const newContract: Contract = {
      id: crypto.randomUUID(),
      clientName: formData.clientName,
      whatsapp: formData.whatsapp,
      itemDescription: formData.itemDescription,
      originalValue: amountNum,
      totalToPay: result.totalToPay,
      installmentsCount: installmentsNum,
      interestRate: interestNum,
      status: 'ativo',
      paidInstallments: 0,
      paymentsLog: [],
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await gStore.saveContract(newContract)
    onAdd()
    setFormData({
      clientName: '',
      itemDescription: '',
      originalValue: '',
      installments: '5',
      interest: mode === 'crediario' ? '30' : '5',
      whatsapp: ''
    })
  }

  return (
    <div className="bg-preto-card border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden group shadow-2xl shadow-dourado/5">
      <div className="flex items-center gap-6 mb-12">
        <div className="h-14 w-14 rounded-3xl bg-dourado/10 flex items-center justify-center border border-dourado/20">
          <PlusCircle className="h-7 w-7 text-dourado shadow-[0_0_20px_rgba(201,168,76,0.3)]" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold italic tracking-tight text-white uppercase italic">
            Emissão de Contrato Pro
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-1">Configuração de Crédito Direto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Cliente & Contato */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 ml-2">Dados do Cliente</label>
            <div className="relative group/field">
              <UserCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within/field:text-dourado transition-colors" />
              <input 
                type="text"
                placeholder="NOME COMPLETO DO CLIENTE"
                required
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 outline-none transition-all"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div className="relative group/field">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within/field:text-dourado transition-colors" />
              <input 
                type="text"
                placeholder="WHATSAPP (DDD + NÚMERO)"
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 outline-none transition-all"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
          </div>

          {/* Operação */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 ml-2">Detalhes da Operação</label>
            <div className="relative group/field">
              <Package className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within/field:text-dourado transition-colors" />
              <input 
                type="text"
                placeholder="DESCRIÇÃO DO ITEM / SERVIÇO"
                required
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 outline-none transition-all"
                value={formData.itemDescription}
                onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
              />
            </div>
            <div className="relative group/field">
              <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within/field:text-dourado transition-colors" />
              <input 
                type="number"
                placeholder="VALOR ORIGINAL (CUSTO)"
                required
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-bold tracking-widest text-white focus:border-dourado/40 outline-none transition-all"
                value={formData.originalValue}
                onChange={(e) => setFormData({...formData, originalValue: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Parâmetros Financeiros */}
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
               <Percent className="h-4 w-4 text-dourado" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Parâmetros de Cálculo PostgreSQL Pro</span>
            </div>
            <div className="flex bg-preto p-1.5 rounded-2xl border border-white/5 shadow-inner">
              <button 
                type="button"
                onClick={() => { setMode('crediario'); setFormData({...formData, interest: '30'}) }}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  mode === 'crediario' ? "bg-dourado text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                Crediário 30%
              </button>
              <button 
                type="button"
                onClick={() => { setMode('juros'); setFormData({...formData, interest: '5'}) }}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  mode === 'juros' ? "bg-white/20 text-white shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                Juros Variável
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="relative">
              <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              <input 
                type="number"
                placeholder="N DE PARCELAS"
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-xs font-bold text-white focus:border-dourado/40 outline-none transition-all"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: e.target.value})}
              />
            </div>
            <div className="relative">
              <Percent className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              <input 
                type="number"
                placeholder="TAXA DE JUROS (%)"
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-xs font-bold text-white focus:border-dourado/40 outline-none transition-all"
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Rodapé Dinâmico */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-2">Total Bruto a Receber</p>
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-display font-bold text-white italic tracking-tighter">
                {formatCurrency(result.totalToPay)}
              </p>
              <span className="text-sm font-sans font-bold text-dourado/60">
                ({formatCurrency(result.installmentValue)} por parcela)
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <Button type="submit" size="lg" className="sm:min-w-[240px] py-6 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-dourado/10">
              Emitir Contrato
            </Button>
            <button 
              type="button" 
              onClick={onAdd}
              className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all underline decoration-white/10 underline-offset-8"
            >
              Cancelar e Voltar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
