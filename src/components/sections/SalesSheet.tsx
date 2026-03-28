'use client'

import { Loan } from '@/types'
import { ExcelGrid, ExcelRow } from '../ui/ExcelGrid'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, Wallet, CheckCircle2, Clock } from 'lucide-react'

interface SalesSheetProps {
  loans: Loan[]
  onManage: (loan: Loan) => void
}

export function SalesSheet({ loans, onManage }: SalesSheetProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold italic text-white/90">Folha 03: Carnês e Contratos</h2>
      </div>

      <ExcelGrid columns={['Tipo', 'Item/Contrato', 'Cliente', 'Parcelas', 'Status', 'Total', 'Ações']}>
        {loans.map((loan, idx) => (
          <ExcelRow 
            key={loan.id} 
            index={idx} 
            cells={[
              <div className="flex items-center gap-2">
                {loan.type === 'venda' ? <Package className="h-3 w-3 text-dourado" /> : <Wallet className="h-3 w-3 text-blue-500" />}
                <span className="text-[10px] uppercase font-bold text-white/40">{loan.type || 'empréstimo'}</span>
              </div>,
              <span className="font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{loan.itemName || 'Crédito Amigo'}</span>,
              <span className="text-white/60">{loan.name}</span>,
              <span className="text-white/50 text-center w-full font-mono">{loan.paidInstallments}/{loan.installments}</span>,
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase text-center w-full ${
                loan.status === 'pago' 
                  ? 'bg-green-500/10 text-green-500' 
                  : loan.status === 'atrasado'
                  ? 'bg-red-500/10 text-red-500 animate-pulse border border-red-500/20'
                  : 'bg-dourado/10 text-dourado'
              }`}>
                {loan.status === 'pago' ? 'PAGO' : loan.status === 'atrasado' ? 'ATRASADO' : 'ATIVO'}
              </span>,
              <span className="font-bold text-dourado text-right w-full">{formatCurrency(loan.totalAmount)}</span>,
              <div className="flex justify-end pr-2">
                <button 
                  onClick={() => onManage(loan)}
                  className="p-1 px-3 bg-white/5 border border-white/10 hover:bg-dourado/10 hover:border-dourado/30 text-white/60 hover:text-dourado rounded-md transition-all text-[10px] font-bold uppercase"
                >
                  Gerenciar
                </button>
              </div>
            ]}
          />
        ))}

        {loans.length === 0 && (
          <div className="p-12 text-center text-white/20 italic">
            Nenhuma venda ou empréstimo registrado ainda.
          </div>
        )}
      </ExcelGrid>
    </div>
  )
}
