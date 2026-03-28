'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign } from 'lucide-react'
import { Button } from '../ui/Button'
import { calculateLoan } from '@/lib/loans'
import { CalculationType } from '@/types'
import { formatCurrency } from '@/lib/utils'

export function Simulator() {
  const [data, setData] = useState({
    amount: '1000',
    installments: '12',
    interest: '5',
    interestType: 'mensal' as CalculationType
  })

  const amountNum = parseFloat(data.amount) || 0
  const installmentsNum = parseInt(data.installments) || 1
  const interestNum = parseFloat(data.interest) || 0
  
  const result = calculateLoan(amountNum, installmentsNum, interestNum, data.interestType)

  return (
    <div className="bg-preto-card rounded-2xl p-8 border border-dourado/10 shadow-dark relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-dourado/10 flex items-center justify-center border border-dourado/20">
          <Calculator className="h-5 w-5 text-dourado" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold italic text-white">Simulador de Luxo</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Teste seus ganhos potenciais</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dourado-claro/50 ml-1">Capital Emprestado</label>
            <input 
              type="number"
              className="w-full bg-preto border border-white/5 rounded-lg px-4 py-3 text-white focus:border-dourado/30 focus:outline-none transition-all"
              value={data.amount}
              onChange={(e) => setData({...data, amount: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dourado-claro/50 ml-1">Tempo (Parcelas)</label>
            <input 
              type="number"
              className="w-full bg-preto border border-white/5 rounded-lg px-4 py-3 text-white focus:border-dourado/30 focus:outline-none transition-all"
              value={data.installments}
              onChange={(e) => setData({...data, installments: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dourado-claro/50 ml-1">Taxa de Juros %</label>
            <input 
              type="number"
              className="w-full bg-preto border border-white/5 rounded-lg px-4 py-3 text-white focus:border-dourado/30 focus:outline-none transition-all"
              value={data.interest}
              onChange={(e) => setData({...data, interest: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dourado-claro/50 ml-1">Base de Tempo</label>
            <select 
              className="w-full bg-preto border border-white/5 rounded-lg px-4 py-3 text-white focus:border-dourado/30 focus:outline-none cursor-pointer appearance-none"
              value={data.interestType}
              onChange={(e) => setData({...data, interestType: e.target.value as CalculationType})}
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-8 text-center sm:text-left">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center justify-center sm:justify-start gap-1">
            <DollarSign className="h-3 w-3" /> Lucro Total
          </p>
          <p className="text-3xl font-display font-bold text-green-500">+{formatCurrency(result.interestValue)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center justify-center sm:justify-start gap-1">
            <TrendingUp className="h-3 w-3" /> Retorno Total
          </p>
          <p className="text-3xl font-display font-bold text-white">{formatCurrency(result.totalToPay)}</p>
        </div>
      </div>

      <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-dourado/5 blur-[100px] rounded-full group-hover:bg-dourado/10 transition-colors pointer-events-none" />
    </div>
  )
}
