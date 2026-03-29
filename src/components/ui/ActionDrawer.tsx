'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, CheckCircle2, TrendingUp, History, Trash2, Clock } from 'lucide-react'
import { Debt } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { gStore } from '@/lib/store'
import { Button } from './Button'

interface ActionDrawerProps {
  debt: Debt | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ActionDrawer({ debt, isOpen, onClose, onUpdate }: ActionDrawerProps) {
  if (!debt) return null

  const handlePayment = () => {
    gStore.liquidateInstallment(debt.id)
    onUpdate()
  }

  const toggleStatus = () => {
    const newStatus = debt.status === 'atrasado' ? 'ativo' : 'atrasado'
    gStore.updateDebt({ ...debt, status: newStatus })
    onUpdate()
  }

  const handleDelete = () => {
    if (confirm('REMOVER REGISTRO? ESTA AÇÃO É IRREVERSÍVEL.')) {
      gStore.deleteDebt(debt.id)
      onUpdate()
      onClose()
    }
  }

  const sendCharge = () => {
    if (!debt.whatsapp) return
    const nextVal = debt.totalToPay / debt.installmentsCount
    const cleanPhone = debt.whatsapp.replace(/\D/g, '')
    const message = encodeURIComponent(
      `Prezado(a) ${debt.clientName}, notifico sobre o vencimento da parcela ${debt.paidCount + 1}/${debt.installmentsCount} ` +
      `referente ao item "${debt.itemName}" no valor de ${formatCurrency(nextVal)}. ` +
      `Solicito a regularização imediata deste débito hoje mesmo.`
    )
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank')
  }

  const isLiquidated = debt.status === 'liquidado'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-preto-card border-l border-white/5 z-[110] shadow-2xl p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-xl font-bold italic tracking-tight text-white uppercase underline decoration-dourado/40 underline-offset-8">
                Controle de Contrato
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Resumo Rápido */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Cliente</label>
                    <p className="text-lg font-bold text-white uppercase">{debt.clientName}</p>
                    <p className="text-xs text-dourado/60">{debt.itemName}</p>
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">Progresso</label>
                    <p className="text-2xl font-display font-bold text-white">{debt.paidCount}/{debt.installmentsCount}</p>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(debt.paidCount / debt.installmentsCount) * 100}%` }}
                    className="h-full bg-dourado shadow-[0_0_10px_rgba(201,168,76,0.3)]" 
                  />
                </div>
              </div>

              {/* Ações de Comando */}
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handlePayment} 
                  disabled={isLiquidated}
                  variant={isLiquidated ? 'secondary' : 'primary'}
                  className="w-full py-5 text-sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Baixar Próxima Parcela
                </Button>

                <Button 
                  onClick={sendCharge} 
                  disabled={isLiquidated || !debt.whatsapp}
                  variant="outline"
                  className="w-full py-5 border-green-500/20 text-green-500 hover:bg-green-500/5"
                >
                  <MessageSquare className="h-5 w-5" />
                  Notificação Formal (Zap)
                </Button>

                <Button 
                  onClick={toggleStatus} 
                  disabled={isLiquidated}
                  variant="outline"
                  className={debt.status === 'atrasado' ? 'border-red-500 text-red-500' : ''}
                >
                  <Clock className="h-4 w-4" />
                  {debt.status === 'atrasado' ? 'Retirar de Atraso' : 'Marcar Inadimplência'}
                </Button>
              </div>

              {/* Histórico Técnico */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-4 w-4 text-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Log de Eventos</span>
                </div>
                <div className="space-y-2">
                  {debt.payments?.length > 0 ? (
                    debt.payments.slice().reverse().map(p => (
                      <div key={p.id} className="flex justify-between items-center p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span className="text-[11px] text-white/60">Parcela {p.installmentIndex}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-white">{formatCurrency(p.amount)}</p>
                          <p className="text-[9px] text-white/20 font-mono uppercase">{formatDate(p.date)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-10 text-[10px] text-white/10 uppercase tracking-widest italic border border-dashed border-white/5 rounded-xl">
                      Aguardando primeiro evento...
                    </p>
                  )}
                </div>
              </div>

              {/* Zona Perigosa */}
              <div className="pt-10 mt-10 border-t border-white/5 flex justify-center">
                 <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-[9px] font-bold text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar Registro
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
