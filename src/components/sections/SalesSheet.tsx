'use client'

import { Loan } from '@/types'
import { ExcelGrid, ExcelRow } from '../ui/ExcelGrid'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, Wallet, CheckCircle2, Clock } from 'lucide-react'

interface SalesSheetProps {
  loans: Loan[]
  onDelete?: (id: string) => void
}

export function SalesSheet({ loans, onDelete }: SalesSheetProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold italic text-white/90">Folha 03: Carnês e Contratos</h2>
      </div>

      <ExcelGrid columns={['Tipo', 'Item/Contrato', 'Cliente', 'Valor Original', 'Parcelas', 'Status', 'Total']}>
        {loans.map((loan, idx) => (
          <ExcelRow 
            key={loan.id} 
            index={idx} 
            cells={[
              <div className="flex items-center gap-2">
                {loan.type === 'venda' ? <Package className="h-3 w-3 text-dourado" /> : <Wallet className="h-3 w-3 text-blue-500" />}
                <span className="text-[10px] uppercase font-bold text-white/40">{loan.type || 'empréstimo'}</span>
              </div>,
              <span className="font-bold text-white">{loan.itemName || 'Crédito Amigo'}</span>,
              <span className="text-white/60">{loan.name}</span>,
              <span className="text-white/80">{formatCurrency(loan.amount)}</span>,
              <span className="text-white/50">{loan.paidInstallments}/{loan.installments}</span>,
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${loan.status === 'pago' ? 'bg-green-500/10 text-green-500' : 'bg-dourado/10 text-dourado'}`}>
                {loan.status === 'pago' ? 'PAGO' : 'ATIVO'}
              </span>,
              <span className="font-bold text-dourado">{formatCurrency(loan.totalAmount)}</span>
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
