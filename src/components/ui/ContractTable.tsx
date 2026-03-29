'use client'

import { Contract } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { 
  ChevronRight, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical
} from 'lucide-react'

interface ContractTableProps {
  contracts: Contract[]
  onManage: (contract: Contract) => void
}

export function ContractTable({ contracts, onManage }: ContractTableProps) {
  return (
    <div className="overflow-x-auto -mx-6 px-6 pb-20">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
            <th className="px-6 py-4 font-bold">Protocolo / Cliente</th>
            <th className="px-6 py-4 font-bold">Descrição do Item</th>
            <th className="px-6 py-4 font-bold text-center">Progresso</th>
            <th className="px-6 py-4 font-bold text-right">Saldo Final</th>
            <th className="px-6 py-4 font-bold text-right">Status</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="space-y-4">
          {contracts.map((contract) => {
            const progress = (contract.paidInstallments / contract.installmentsCount) * 100
            const isLiquidated = contract.status === 'liquidado'
            const isOverdue = contract.status === 'atrasado'

            return (
              <tr 
                key={contract.id}
                onClick={() => onManage(contract)}
                className="group cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-3xl transition-all duration-300"
              >
                <td className="px-6 py-6 rounded-l-[24px]">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center border transition-all",
                      isLiquidated ? "bg-green-500/10 border-green-500/20 text-green-500" :
                      isOverdue ? "bg-red-500/10 border-red-500/20 text-red-500 animate-pulse" :
                      "bg-dourado/10 border-dourado/20 text-dourado"
                    )}>
                      {isLiquidated ? <CheckCircle2 className="h-5 w-5" /> : 
                       isOverdue ? <AlertCircle className="h-5 w-5" /> : 
                       <Clock className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm uppercase tracking-tight group-hover:text-dourado transition-colors">{contract.clientName}</p>
                      <p className="text-[9px] text-white/30 font-mono italic">ID: {contract.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-6 border-y border-white/5">
                  <p className="text-xs text-white/60 font-medium uppercase tracking-widest">{contract.itemDescription}</p>
                </td>

                <td className="px-6 py-6 border-y border-white/5">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                       <span className="text-[11px] font-bold text-white font-mono">{contract.paidInstallments}/{contract.installmentsCount}</span>
                       <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Pc.</span>
                    </div>
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full", isLiquidated ? "bg-green-500" : "bg-dourado")}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-6 py-6 border-y border-white/5 text-right">
                  <p className="text-sm font-display font-bold text-white italic">{formatCurrency(contract.totalToPay)}</p>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Bruto</p>
                </td>

                <td className="px-6 py-6 border-y border-white/5 text-right">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block",
                    isLiquidated ? "bg-green-500/10 text-green-500" :
                    isOverdue ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                    "bg-white/5 text-white/40 border border-white/10"
                  )}>
                    {contract.status}
                  </span>
                </td>

                <td className="px-6 py-6 rounded-r-[24px] border-r border-y border-white/5 text-right">
                  <ChevronRight className="h-5 w-5 text-white/10 group-hover:text-dourado group-hover:translate-x-1 transition-all inline-block" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
