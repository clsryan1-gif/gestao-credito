'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, 
  MessageSquare, 
  History,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  Zap
} from 'lucide-react'
import { Contract } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { gStore } from '@/lib/store'
import { Button } from './Button'

interface ActionDrawerProps {
  contract: Contract | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function ActionDrawer({ contract, isOpen, onClose, onUpdate }: ActionDrawerProps) {
  if (!contract) return null

  const handleLiquidate = async () => {
    await gStore.liquidateInstallment(contract.id)
    onUpdate()
  }

  const handleRemoveLatest = async () => {
    if (!contract || contract.paidInstallments === 0) return
    if (confirm('Deseja realmente remover o último pagamento registrado?')) {
      await gStore.removeLatestPayment(contract.id)
      onUpdate()
    }
  }

  const handleStatusToggle = async () => {
    const newStatus = contract.status === 'atrasado' ? 'ativo' : 'atrasado'
    await gStore.saveContract({ ...contract, status: (newStatus as any) })
    onUpdate()
  }

  const handleDelete = async () => {
    if (confirm('REMOVER REGISTRO? ESTA AÇÃO É IRREVERSÍVEL.')) {
      await gStore.deleteContract(contract.id)
      onUpdate()
      onClose()
    }
  }

  const sendCharge = () => {
    if (!contract.whatsapp) return
    const nextVal = contract.totalToPay / contract.installmentsCount
    const cleanPhone = contract.whatsapp.replace(/\D/g, '')
    const message = encodeURIComponent(
      `Prezado(a) ${contract.clientName}, notifico sobre o vencimento da parcela ${contract.paidInstallments + 1}/${contract.installmentsCount} ` +
      `referente ao item "${contract.itemDescription}" no valor de ${formatCurrency(nextVal)}. ` +
      `Solicito a regularização imediata deste débito hoje mesmo.`
    )
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank')
  }

  const isLiquidated = contract.status === 'liquidado'

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
              {/* Header Técnico */}
              <div className="flex items-center justify-between mb-12">
                <button 
                  onClick={onClose}
                  className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase hover:text-white transition-all group"
                >
                  <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                  Voltar
                </button>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${isLiquidated ? 'bg-green-500/20 text-green-500' : 'bg-dourado/20 text-dourado'}`}>
                  {contract.status}
                </div>
              </div>

              <div className="space-y-10">
                {/* Protocolo do Contrato */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck className="h-4 w-4 text-dourado/40" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">Protocolo de Crédito</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white uppercase leading-tight mb-2">{contract.clientName}</h3>
                    <p className="text-sm text-dourado/60 font-medium italic mb-12">{contract.itemDescription}</p>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Liquidação Progressiva</p>
                        <p className="text-4xl font-display font-bold text-white italic tracking-tighter">{contract.paidInstallments}/{contract.installmentsCount}</p>
                      </div>
                      <div className="h-14 w-14 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
                        <History className="h-6 w-6 text-white/20" />
                      </div>
                    </div>

                    <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(contract.paidInstallments / contract.installmentsCount) * 100}%` }}
                        className="h-full bg-dourado shadow-[0_0_20px_rgba(201,168,76,0.5)]" 
                      />
                    </div>
                  </div>
                </div>

                {/* Ações de Comando */}
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={handleLiquidate} 
                    disabled={isLiquidated}
                    variant={isLiquidated ? 'secondary' : 'primary'}
                    className="w-full py-6 text-[11px] font-bold uppercase tracking-[0.3em] shadow-lg shadow-dourado/10"
                  >
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5px]" />
                    Baixar Próxima Parcela
                  </Button>

                  <Button 
                    onClick={sendCharge} 
                    disabled={isLiquidated || !contract.whatsapp}
                    variant="outline"
                    className="w-full py-5 border-green-500/10 text-green-500 hover:bg-green-500/5 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Envio Formal (Zap)
                  </Button>

                  <button 
                    onClick={handleStatusToggle} 
                    disabled={isLiquidated}
                    className={`w-full py-4 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${
                      contract.status === 'atrasado' 
                        ? 'border-red-500/40 bg-red-500/5 text-red-500' 
                        : 'border-white/5 bg-white/5 text-white/30 hover:text-white'
                    }`}
                  >
                    {contract.status === 'atrasado' ? 'Retirar Alerta de Atraso' : 'Marcar Inadimplência'}
                  </button>
                </div>

                {/* Log de Pagamentos */}
                <div>
                  <div className="flex items-center gap-3 mb-8 px-2">
                    <Zap className="h-3 w-3 text-white/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Histórico de Transações SQL</span>
                  </div>
                  <div className="space-y-4">
                    {contract.paymentsLog?.length > 0 ? (
                      contract.paymentsLog.slice().reverse().map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-[24px] group/item transition-all hover:bg-white/[0.04]">
                          <div className="flex items-center gap-6">
                            <div className="h-10 w-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xs font-bold text-green-500 font-mono">
                              #{p.installmentIndex}
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-white uppercase tracking-tighter">Parcela Liquidada</p>
                              <p className="text-[10px] text-white/20 font-mono italic">{formatDate(p.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-sm font-bold text-white font-mono">{formatCurrency(p.amount)}</span>
                            {idx === 0 && (
                              <button 
                                onClick={handleRemoveLatest}
                                className="p-2.5 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100"
                                title="Desfazer Pagamento"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center opacity-10">
                        <History className="h-10 w-10 mb-4" />
                        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">Sem registros</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Zona de Risco */}
              <div className="pt-16 mt-16 border-t border-white/5 flex justify-center">
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-3 text-[10px] font-bold text-red-500/20 hover:text-red-500 transition-colors uppercase tracking-[0.3em]"
                >
                  <Trash2 className="h-4 w-4" />
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
