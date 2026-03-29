'use client'

import { useState } from 'react'
import { PlusCircle, Wallet, Percent, Clock, Package, UserCircle2, Phone } from 'lucide-react'
import { Button } from './Button'
import { calculateDebt } from '@/lib/store'
import { Debt } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'
import { gStore } from '@/lib/store'

interface DebtFormProps {
  onAdd: () => void
}

export function DebtForm({ onAdd }: DebtFormProps) {
  const [mode, setMode] = useState<'juros' | 'crediario'>('crediario')
  const [formData, setFormData] = useState({
    clientName: '',
    itemName: '',
    amount: '',
    installments: '5',
    interest: '30',
    whatsapp: ''
  })

  const amountNum = parseFloat(formData.amount) || 0
  const installmentsNum = parseInt(formData.installments) || 1
  const interestNum = parseFloat(formData.interest) || 0
  
  const result = calculateDebt(amountNum, installmentsNum, interestNum, mode)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName || !amountNum || !formData.itemName) return

    const newDebt: Debt = {
      id: crypto.randomUUID(),
      clientName: formData.clientName,
      whatsapp: formData.whatsapp,
      itemName: formData.itemName,
      originalAmount: amountNum,
      totalToPay: result.totalToPay,
      installmentsCount: installmentsNum,
      interestRate: interestNum,
      mode: mode,
      paidCount: 0,
      startDate: new Date().toISOString(),
      status: 'ativo',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    gStore.saveDebt(newDebt)
    onAdd()
    setFormData({
      clientName: '',
      itemName: '',
      amount: '',
      installments: '5',
      interest: mode === 'crediario' ? '30' : '5',
      whatsapp: ''
    })
  }

  return (
    <div className="bg-preto-card border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-10 w-10 rounded-xl bg-dourado/10 flex items-center justify-center border border-dourado/20">
          <PlusCircle className="h-5 w-5 text-dourado shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
        </div>
        <h2 className="font-display text-xl font-bold italic tracking-tight text-white uppercase underline decoration-dourado/20 underline-offset-8">
          Novo Contrato G-Credito
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome e Zap */}
          <div className="space-y-4">
            <div className="relative">
              <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text"
                placeholder="NOME DO CLIENTE"
                className="w-full bg-preto border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 focus:outline-none transition-all"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text"
                placeholder="WHATSAPP (NÚMEROS)"
                className="w-full bg-preto border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 focus:outline-none transition-all"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
          </div>

          {/* Item e Valor */}
          <div className="space-y-4">
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="text"
                placeholder="DESCRIÇÃO DO ITEM"
                className="w-full bg-preto border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 focus:outline-none transition-all"
                value={formData.itemName}
                onChange={(e) => setFormData({...formData, itemName: e.target.value})}
              />
            </div>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="number"
                placeholder="VALOR ORIGINAL"
                className="w-full bg-preto border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs font-bold tracking-widest text-white focus:border-dourado/40 focus:outline-none transition-all"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Configuração Técnica */}
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Configuração Técnica</span>
            <div className="flex bg-preto p-1 rounded-lg border border-white/5">
              <button 
                type="button"
                onClick={() => { setMode('crediario'); setFormData({...formData, interest: '30'}) }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all",
                  mode === 'crediario' ? "bg-dourado text-black" : "text-white/40"
                )}
              >
                Crediário 30%
              </button>
              <button 
                type="button"
                onClick={() => { setMode('juros'); setFormData({...formData, interest: '5'}) }}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all",
                  mode === 'juros' ? "bg-white/20 text-white" : "text-white/40"
                )}
              >
                Juros Variável
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="number"
                placeholder="PARCELAS"
                className="w-full bg-preto border border-white/10 rounded-lg pl-12 pr-4 py-3 text-xs font-bold text-white focus:border-dourado/40 focus:outline-none transition-all"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: e.target.value})}
              />
            </div>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="number"
                placeholder="TAXA (%)"
                className="w-full bg-preto border border-white/10 rounded-lg pl-12 pr-4 py-3 text-xs font-bold text-white focus:border-dourado/40 focus:outline-none transition-all"
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Resumo Final */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Total Final a Receber</p>
            <p className="text-3xl font-display font-bold text-white italic tracking-tight">
              {formatCurrency(result.totalToPay)}
              <span className="text-sm font-sans font-normal text-dourado/60 ml-3">({formatCurrency(result.installmentValue)}/p)</span>
            </p>
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px]">
            Emitir Contrato
          </Button>
          <button 
            type="button"
            onClick={onAdd}
            className="w-full sm:w-auto px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all underline decoration-white/10 underline-offset-8"
          >
            Cancelar e Voltar
          </button>
        </div>
      </form>
      
      <div className="absolute top-0 right-0 h-40 w-40 bg-dourado/5 blur-[60px] pointer-events-none rounded-full" />
    </div>
  )
}
