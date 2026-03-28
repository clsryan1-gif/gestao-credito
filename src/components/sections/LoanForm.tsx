'use client'

import { useState } from 'react'
import { PlusCircle, Wallet, Percent, Clock } from 'lucide-react'
import { Button } from '../ui/Button'
import { calculateLoan } from '@/lib/loans'
import { CalculationType, Loan } from '@/types'
import { formatCurrency, cn } from '@/lib/utils'

interface LoanFormProps {
  onAdd: (loan: Loan) => void
}

export function LoanForm({ onAdd }: LoanFormProps) {
  const [type, setType] = useState<'emprestimo' | 'venda'>('emprestimo')
  const [formData, setFormData] = useState({
    name: '',
    itemName: '',
    unitPrice: '',
    quantity: '1',
    downPayment: '0',
    amount: '',
    installments: '1',
    interest: '0',
    interestType: 'mensal' as CalculationType,
    whatsapp: ''
  })

  // Cálculo automático do valor original para vendas
  const unitPriceNum = parseFloat(formData.unitPrice) || 0
  const quantityNum = parseInt(formData.quantity) || 0
  const downPaymentNum = parseFloat(formData.downPayment) || 0
  
  const calculatedAmount = type === 'venda' 
    ? (unitPriceNum * quantityNum) - downPaymentNum 
    : parseFloat(formData.amount) || 0

  const installmentsNum = parseInt(formData.installments) || 1
  const interestNum = parseFloat(formData.interest) || 0
  
  const result = calculateLoan(calculatedAmount, installmentsNum, interestNum, formData.interestType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || (type === 'emprestimo' && !formData.amount) || (type === 'venda' && !formData.itemName)) return

    const newLoan: Loan = {
      id: crypto.randomUUID(),
      name: formData.name,
      amount: calculatedAmount,
      installments: installmentsNum,
      interest: interestNum,
      interestType: formData.interestType,
      startDate: new Date().toISOString(),
      paidInstallments: 0,
      totalAmount: result.totalToPay,
      status: 'ativo',
      type: type,
      itemName: type === 'venda' ? formData.itemName : undefined,
      quantity: type === 'venda' ? quantityNum : undefined,
      unitPrice: type === 'venda' ? unitPriceNum : undefined,
      downPayment: type === 'venda' ? downPaymentNum : undefined,
      whatsapp: formData.whatsapp
    }

    onAdd(newLoan)
    setFormData({
      name: '',
      itemName: '',
      unitPrice: '',
      quantity: '1',
      downPayment: '0',
      amount: '',
      installments: '1',
      interest: '0',
      interestType: 'mensal',
      whatsapp: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-preto-card rounded-2xl p-8 border border-white/5 shadow-dark relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-dourado/10 flex items-center justify-center border border-dourado/20">
            <PlusCircle className="h-5 w-5 text-dourado" />
          </div>
          <h2 className="font-display text-2xl font-bold italic text-white">Novo Registro</h2>
        </div>
        
        {/* Toggle Tipo */}
        <div className="flex bg-preto border border-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setType('emprestimo')}
            className={cn(
              "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
              type === 'emprestimo' ? "bg-dourado text-black" : "text-white/40 hover:text-white"
            )}
          >
            Empréstimo
          </button>
          <button
            type="button"
            onClick={() => setType('venda')}
            className={cn(
              "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
              type === 'venda' ? "bg-dourado text-black" : "text-white/40 hover:text-white"
            )}
          >
            Venda
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">
            {type === 'venda' ? 'Nome do Comprador' : 'Nome do Amigo'}
          </label>
          <input 
            type="text"
            placeholder="Ex: João Silva"
            className="w-full bg-preto border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-dourado/50 focus:outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">WhatsApp (Somente números)</label>
          <input 
            type="text"
            placeholder="Ex: 11999999999"
            className="w-full bg-preto border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-dourado/50 focus:outline-none transition-all"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
          />
        </div>

        {type === 'venda' ? (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Item / Produto</label>
            <input 
              type="text"
              placeholder="Ex: iPhone 13"
              className="w-full bg-preto border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-dourado/50 focus:outline-none transition-all"
              value={formData.itemName}
              onChange={(e) => setFormData({...formData, itemName: e.target.value})}
              required
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Valor do Empréstimo</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="number"
                placeholder="0,00"
                className="w-full bg-preto border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:border-dourado/50 focus:outline-none transition-all"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>
        )}

        {type === 'venda' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Preço Unit.</label>
                <input 
                  type="number"
                  placeholder="0,00"
                  className="w-full bg-preto border border-white/10 rounded-lg px-4 py-3 text-white focus:border-dourado/50 focus:outline-none transition-all"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Qtd</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full bg-preto border border-white/10 rounded-lg px-4 py-3 text-white focus:border-dourado/50 focus:outline-none transition-all"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Entrada (Cash)</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input 
                  type="number"
                  placeholder="0,00"
                  className="w-full bg-preto border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/20 focus:border-dourado/50 focus:outline-none transition-all"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({...formData, downPayment: e.target.value})}
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Parcelas</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input 
              type="number"
              min="1"
              className="w-full bg-preto border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-dourado/50 focus:outline-none transition-all"
              value={formData.installments}
              onChange={(e) => setFormData({...formData, installments: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Juros %</label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input 
                type="number"
                step="0.1"
                className="w-full bg-preto border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-dourado/50 focus:outline-none transition-all"
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-dourado-claro/70 ml-1">Base</label>
            <select 
              className="w-full bg-preto border border-white/10 rounded-lg px-4 py-3 text-white focus:border-dourado/50 focus:outline-none transition-all appearance-none cursor-pointer"
              value={formData.interestType}
              onChange={(e) => setFormData({...formData, interestType: e.target.value as CalculationType})}
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-dourado/5 rounded-xl border border-dourado/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-dourado/60">
            {type === 'venda' ? 'Valor a Financiar' : 'Resumo do Retorno'}
          </p>
          <p className="text-2xl font-display font-bold text-white">
            {formatCurrency(result.totalToPay)}
            <span className="text-sm font-sans font-normal text-dourado-claro/60 ml-2">
              ({formatCurrency(result.installmentValue)} / parc)
            </span>
          </p>
          {type === 'venda' && calculatedAmount > 0 && (
            <p className="text-[10px] text-white/40 mt-1 italic">
              Base: {formatCurrency(calculatedAmount)} ({formData.quantity}x {formatCurrency(unitPriceNum)})
            </p>
          )}
        </div>
        <Button variant="primary" size="lg" type="submit" className="w-full sm:w-auto">
          {type === 'venda' ? 'Registrar Venda' : 'Adicionar Dívida'}
        </Button>
      </div>

      <div className="absolute top-0 right-0 h-64 w-64 bg-dourado/5 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
    </form>
  )
}
