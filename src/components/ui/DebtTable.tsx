'use client'

import { Debt } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from './Badge'
import { TrendingUp, Package, Wallet, UserCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DebtTableProps {
  debts: Debt[]
  onManage: (debt: Debt) => void
}

export function DebtTable({ debts, onManage }: DebtTableProps) {
  return (
    <div className="w-full bg-preto-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">ID / Referência</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Cliente</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Valor Total</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-center">Progresso</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {debts.map((debt, idx) => (
              <tr 
                key={debt.id} 
                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => onManage(debt)}
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center border",
                      debt.mode === 'crediario' ? "bg-dourado/10 border-dourado/20" : "bg-blue-500/10 border-blue-500/20"
                    )}>
                      {debt.mode === 'crediario' ? <Package className="h-4 w-4 text-dourado" /> : <Wallet className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-white/40 uppercase">#{(idx + 1).toString().padStart(3, '0')}</p>
                      <p className="text-[11px] font-bold text-white max-w-[120px] truncate">{debt.itemName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                   <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-white/20" />
                    <span className="text-xs font-bold text-white uppercase tracking-tight">{debt.clientName}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <p className="text-xs font-bold text-white">{formatCurrency(debt.totalToPay)}</p>
                  <p className="text-[9px] text-green-500 font-bold">+{formatCurrency(debt.totalToPay - debt.originalAmount)}</p>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex justify-between w-20 text-[9px] font-bold text-white/40 font-mono">
                      <span>{debt.paidCount}</span>
                      <span>{debt.installmentsCount}</span>
                    </div>
                    <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-dourado transition-all duration-700" 
                        style={{ width: `${(debt.paidCount / debt.installmentsCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Badge status={debt.status} />
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-white/20 hover:text-dourado transition-all group-hover:translate-x-1">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {debts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <TrendingUp className="h-12 w-12" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Ambiente G-Credito Pronto</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
