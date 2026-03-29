'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, 
  MessageSquare, 
  History,
  ArrowLeft,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react'
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

  const handleLiquidate = () => {
    gStore.liquidateInstallment(debt.id)
    onUpdate()
  }

  const handleRemoveLatest = () => {
    if (!debt || debt.paidCount === 0) return
    if (confirm('Deseja realmente remover o último pagamento registrado?')) {
      gStore.removeLatestPayment(debt.id)
      onUpdate()
    }
  }

  const handleStatusToggle = () => {
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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-preto-card border-l border-white/5 z-[110] shadow-2xl overflow-y-auto custom-scrollbar"
          >
            <div className="p-8 pb-32">
              {/* Header com Botão Voltar */}
              <div className="flex items-center justify-between mb-10">
                <button 
                  onClick={onClose}
                  className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase hover:text-white transition-all group"
                >
                  <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                  Voltar
                </button>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${isLiquidated ? 'bg-green-500/20 text-green-500' : 'bg-dourado/20 text-dourado'}`}>
                  {debt.status}
                </div>
              </div>

              <div className="space-y-8">
                {/* Card do Cliente */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Cliente / Item</p>
                    <h3 className="text-xl font-bold text-white uppercase leading-tight mb-1">{debt.clientName}</h3>
                    <p className="text-xs text-dourado/60 font-medium italic">{debt.itemName}</p>
                    
                    <div className="mt-8 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Pagamentos</p>
                        <p className="text-3xl font-display font-bold text-white italic">{debt.paidCount}/{debt.installmentsCount}</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <History className="h-5 w-5 text-white/40" />
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(debt.paidCount / debt.installmentsCount) * 100}%` }}
                        className="h-full bg-dourado shadow-[0_0_15px_rgba(201,168,76,0.4)]" 
                      />
                    </div>
                  </div>
                </div>

                {/* Ações Técnicas */}
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={handleLiquidate} 
                    disabled={isLiquidated}
                    variant={isLiquidated ? 'secondary' : 'primary'}
                    className="w-full py-5 text-xs font-bold uppercase tracking-widest"
                  >
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5px]" />
                    Baixar Próxima Parcela
                  </Button>

                  <Button 
                    onClick={sendCharge} 
                    disabled={isLiquidated || !debt.whatsapp}
                    variant="outline"
                    className="w-full py-5 border-green-500/10 text-green-500 hover:bg-green-500/5 text-xs font-bold uppercase tracking-widest"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Envio Formal (Zap)
                  </Button>

                  <button 
                    onClick={handleStatusToggle} 
                    disabled={isLiquidated}
                    className={`w-full py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                      debt.status === 'atrasado' 
                        ? 'border-red-500/40 bg-red-500/5 text-red-500' 
                        : 'border-white/5 bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    {debt.status === 'atrasado' ? 'Retirar Alerta de Atraso' : 'Marcar Inadimplência'}
                  </button>
                </div>

                {/* Histórico com Undo */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <History className="h-3 w-3 text-white/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Extrato de Pagamentos</span>
                  </div>
                  <div className="space-y-3">
                    {debt.payments?.length > 0 ? (
                      debt.payments.slice().reverse().map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl group">
                          <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[11px] font-bold text-green-500 font-mono">
                              #{p.installmentIndex}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-white uppercase tracking-tight">Parcela Liquidada</p>
                              <p className="text-[9px] text-white/20 font-mono italic">{formatDate(p.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-white">{formatCurrency(p.amount)}</span>
                            {idx === 0 && (
                              <button 
                                onClick={handleRemoveLatest}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500/40 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center opacity-20">
                        <History className="h-8 w-8 mb-2" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Sem histórico</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Zona de Exclusão */}
              <div className="pt-12 mt-12 border-t border-white/5 flex justify-center">
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-[9px] font-bold text-red-500/20 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar Este Contrato
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
