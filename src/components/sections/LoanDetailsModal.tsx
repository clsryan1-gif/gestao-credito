'use client'

import { Loan } from '@/types'
import { Modal } from '../ui/Modal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  Trash2, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Calendar,
  User,
  Package,
  TrendingUp,
  History
} from 'lucide-react'
import { loanService } from '@/lib/loans'
import { useState } from 'react'

interface LoanDetailsModalProps {
  loan: Loan | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function LoanDetailsModal({ loan, isOpen, onClose, onUpdate }: LoanDetailsModalProps) {
  if (!loan) return null

  const handleAddPayment = () => {
    loanService.addPayment(loan.id, loan.totalAmount / loan.installments)
    onUpdate()
  }

  const toggleOverdue = () => {
    const newStatus = loan.status === 'atrasado' ? 'ativo' : 'atrasado'
    loanService.updateLoan({ ...loan, status: newStatus })
    onUpdate()
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este registro permanentemente?')) {
      loanService.deleteLoan(loan.id)
      onUpdate()
      onClose()
    }
  }

  const handleWhatsAppCharge = () => {
    if (!loan.whatsapp) {
      alert('WhatsApp não cadastrado para este cliente.')
      return
    }
    const cleanPhone = loan.whatsapp.replace(/\D/g, '')
    const nextInstallment = (loan.paidInstallments || 0) + 1
    const installmentValue = loan.totalAmount / loan.installments
    
    const message = encodeURIComponent(
      `Prezado(a) ${loan.name}, notifico sobre o vencimento da parcela ${nextInstallment}/${loan.installments} ` +
      `referente ao item "${loan.itemName || 'Crédito'}" no valor de ${formatCurrency(installmentValue)}. ` +
      `Solicito a regularização imediata deste débito hoje mesmo.`
    )
    
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank')
  }

  const remainingInstallments = loan.installments - (loan.paidInstallments || 0)
  const isPaid = loan.status === 'pago'

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Gerenciar Contrato"
      className="max-w-xl"
    >
      <div className="space-y-8">
        {/* Info Cabeçalho */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-white/40">
              <User className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Cliente</span>
            </div>
            <p className="font-bold text-white uppercase">{loan.name}</p>
            <p className="text-xs text-dourado/60 mt-0.5">{loan.whatsapp || 'Sem WhatsApp'}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-white/40">
              <Package className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Item/Serviço</span>
            </div>
            <p className="font-bold text-white uppercase">{loan.itemName || 'Empréstimo'}</p>
            <div className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${isPaid ? 'bg-green-500/10 text-green-500' : loan.status === 'atrasado' ? 'bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-dourado/10 text-dourado'}`}>
              {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {isPaid ? 'Liquidado' : loan.status === 'atrasado' ? 'Atrasado' : 'Ativo'}
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-dourado/5 rounded-3xl p-6 border border-dourado/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-bold text-dourado/60 uppercase tracking-widest mb-1">Total do Contrato</p>
                <p className="text-4xl font-display font-bold text-white italic">{formatCurrency(loan.totalAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Progresso</p>
                <p className="text-xl font-display font-bold text-white">{loan.paidInstallments}/{loan.installments}</p>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-dourado transition-all duration-500" 
                style={{ width: `${(loan.paidInstallments / loan.installments) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Valor Original</p>
                <p className="text-sm font-bold text-white/80">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Lucro Estimado</p>
                <p className="text-sm font-bold text-green-500">+{formatCurrency(loan.totalAmount - loan.amount)}</p>
              </div>
            </div>
          </div>
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] h-40 w-40 text-dourado/5 -rotate-12" />
        </div>

        {/* Ações Principais */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddPayment}
            disabled={isPaid}
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
              isPaid 
              ? 'bg-white/5 text-white/20 cursor-not-allowed' 
              : 'bg-dourado hover:bg-dourado/80 text-black shadow-lg shadow-dourado/20 active:scale-95'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Liquidar Parcela
          </button>
          
          <button
            onClick={handleWhatsAppCharge}
            disabled={isPaid}
            className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border transition-all ${
              isPaid
              ? 'border-white/5 text-white/20 cursor-not-allowed'
              : 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-500 active:scale-95'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Cobrar WhatsApp
          </button>
        </div>

        {/* Ajuste de Status */}
        <div className="flex gap-2">
           <button
            onClick={toggleOverdue}
            disabled={isPaid}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all ${
              loan.status === 'atrasado'
              ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
              : 'border-white/10 text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="h-3 w-3" />
            {loan.status === 'atrasado' ? 'Marcar como Em Dia' : 'Marcar como Atrasado'}
          </button>
        </div>

        {/* Histórico Simples */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-2">
            <History className="h-4 w-4 text-white/40" />
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Histórico Recente</h3>
          </div>
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
            {loan.payments && loan.payments.length > 0 ? (
              loan.payments.slice().reverse().map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Parcela {payment.installmentNumber} Paga</p>
                      <p className="text-[9px] text-white/40">{formatDate(payment.date)}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-green-500">{formatCurrency(payment.amount)}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-white/20 italic text-xs bg-white/[0.02] rounded-xl border border-dashed border-white/5">
                Nenhum pagamento registrado ainda.
              </div>
            )}
          </div>
        </div>

        {/* Perigo */}
        <div className="pt-4 mt-4 border-t border-white/5 flex justify-center">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-[9px] font-bold text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Excluir Registro Permanente
          </button>
        </div>
      </div>
    </Modal>
  )
}
