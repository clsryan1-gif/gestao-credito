'use client'

import { Loan } from '@/types'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { Trash2, Calendar, CheckCircle2, Share2, MessageCircle, Package, ShoppingBag } from 'lucide-react'
import { Button } from './Button'

import { loanService } from '@/lib/loans'

interface CardLoanProps {
  loan: Loan
  onDelete: (id: string) => void
  onUpdate?: (loan: Loan) => void
}

export function CardLoan({ loan, onDelete, onUpdate }: CardLoanProps) {
  const isPaid = loan.paidInstallments >= loan.installments
  const isSale = loan.type === 'venda'

  const handleAddPayment = () => {
    if (isPaid) return
    const amount = loan.totalAmount / loan.installments
    const updated = loanService.addPayment(loan.id, amount)
    if (updated && onUpdate) {
      onUpdate(updated)
    }
  }
  
  const handleShareWhatsApp = () => {
    const title = isSale ? `Venda de ${loan.itemName}` : 'Empréstimo'
    const itemDetail = isSale ? `Item: ${loan.itemName} (${loan.quantity}x)\nValor Unit: ${formatCurrency(loan.unitPrice || 0)}\n${loan.downPayment ? `Entrada: ${formatCurrency(loan.downPayment)}\n` : ''}` : ''
    
    const message = `Olá ${loan.name}! Segue o resumo do nosso acerto (${title}):\n${itemDetail}VALOR FINANCIADO: ${formatCurrency(loan.amount)}\nDATA: ${formatDate(loan.startDate)}\nPARCELAS: ${loan.paidInstallments}/${loan.installments}\nTOTAL A RECEBER: ${formatCurrency(loan.totalAmount)}\nStatus: ${isPaid ? 'CONCLUÍDO' : 'EM ABERTO'}`
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-preto-card p-6',
        'border border-[var(--color-dourado-borda)] shadow-dark',
        'hover:border-dourado/40 transition-all duration-300 ease-out',
        isPaid && 'opacity-60 grayscale-[0.5]'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            {isSale ? (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-dourado/10 border border-dourado/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-dourado">
                <Package className="h-2.5 w-2.5" /> Venda
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-blue-500">
                <ShoppingBag className="h-2.5 w-2.5" /> Empréstimo
              </span>
            )}
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold italic text-white flex items-center gap-2">
            {isSale ? loan.itemName : loan.name}
            {isPaid && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          </h3>
          <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
            <span className="font-bold text-white/80">{isSale ? `Comprador: ${loan.name}` : `Amigo: ${loan.name}`}</span>
            <span className="mx-1">•</span>
            <Calendar className="h-3.5 w-3.5" /> {formatDate(loan.startDate)}
          </p>
        </div>
        <div className="flex gap-2 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 border-white/5 hover:border-dourado/40"
            onClick={handleShareWhatsApp}
          >
            <MessageCircle className="h-4 w-4 text-green-500" />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              if (confirm('Deseja excluir este registro?')) {
                onDelete(loan.id)
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="space-y-1">
          <p className="text-dourado text-[10px] font-bold uppercase tracking-wider">Total a Receber</p>
          <p className="text-xl font-display font-semibold text-white">{formatCurrency(loan.totalAmount)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-dourado text-[10px] font-bold uppercase tracking-wider">Juros ({loan.interestType})</p>
          <p className="text-xl font-display font-semibold text-dourado-claro">+{loan.interest}%</p>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-white/40">
          <span>Parcelas {loan.paidInstallments}/{loan.installments}</span>
          <span>{Math.round((loan.paidInstallments / (loan.installments || 1)) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-dourado transition-all duration-500" 
            style={{ width: `${(loan.paidInstallments / (loan.installments || 1)) * 100}%` }}
          />
        </div>
        {isSale && (
          <p className="text-[10px] text-white/30 italic mt-2">
            Detalhes: {loan.quantity}x {formatCurrency(loan.unitPrice || 0)} 
            {loan.downPayment ? ` (-${formatCurrency(loan.downPayment)} entrada)` : ''}
          </p>
        )}
      </div>

      {!isPaid && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full mt-6 bg-white/[0.02] border-white/5 hover:border-dourado/40 group/btn"
          onClick={handleAddPayment}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-dourado/40 group-hover/btn:text-dourado transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Liquidar Parcela</span>
          </div>
        </Button>
      )}

      {/* Luxo: Glow Effect Dinâmico */}
      <div className={cn(
        "absolute -bottom-10 -right-10 h-32 w-32 blur-[40px] rounded-full pointer-events-none transition-colors",
        isPaid ? "bg-green-500/5" : "bg-dourado/10"
      )} />
    </div>
  )
}
