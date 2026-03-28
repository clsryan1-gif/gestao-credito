'use client'

import { useState, useEffect } from 'react'
import { Loan } from '@/types'
import { loanService } from '@/lib/loans'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn } from '@/components/ui/FadeIn'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Package,
  Wallet
} from 'lucide-react'

export default function ListaDevedores() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'pago'>('todos')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLoans(loanService.getLoans())
    setMounted(true)
  }, [])

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (loan.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    const matchesStatus = filterStatus === 'todos' || loan.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (!mounted) return null

  return (
    <main className="min-h-screen pb-20 pt-32">
      <div className="mx-auto max-w-[1200px] px-5">
        <FadeIn>
          <SectionHeader 
            label="CONTROLE CENTRAL DE ATIVOS"
            title="Lista de Devedores"
            subtitle="Visualize o andamento completo de todas as dívidas e vendas parceladas em uma interface de alta densidade."
            align="left"
          />
        </FadeIn>

        {/* Filtros e Busca */}
        <div className="mt-12 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input 
              type="text"
              placeholder="Buscar por nome ou item..."
              className="w-full bg-preto-card border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/20 focus:border-dourado/50 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-preto-card border border-white/10 rounded-xl p-1 w-full md:w-auto">
            {(['todos', 'ativo', 'pago'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  filterStatus === status ? "bg-dourado text-black" : "text-white/40 hover:text-white"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Luxo */}
        <div className="bg-preto-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dourado/60">Cliente / Item</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dourado/60">Valor Original</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dourado/60">Parcelas</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dourado/60">Progresso</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dourado/60">Total a Receber</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-dourado/60 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-white/20 italic font-sans">
                      Nenhum registro encontrado para os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan, idx) => {
                    const progress = (loan.paidInstallments / (loan.installments || 1)) * 100
                    const isPaid = loan.paidInstallments >= loan.installments

                    return (
                      <tr key={loan.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center border",
                              loan.type === 'venda' ? "bg-dourado/5 border-dourado/20 text-dourado" : "bg-blue-500/5 border-blue-500/20 text-blue-500"
                            )}>
                              {loan.type === 'venda' ? <Package className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-display font-bold text-white text-base tracking-tight">{loan.name}</p>
                              <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mt-0.5">
                                {loan.type === 'venda' ? `Venda: ${loan.itemName}` : 'Empréstimo Simples'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-white/80">{formatCurrency(loan.amount)}</p>
                          <p className="text-[9px] text-white/20 mt-1 uppercase font-bold tracking-tighter">Início: {formatDate(loan.startDate)}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{loan.paidInstallments}</span>
                            <span className="text-white/20 text-xs">/ {loan.installments}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-32">
                            <div className="flex justify-between text-[9px] mb-1 font-bold text-white/40 uppercase">
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full transition-all duration-1000", isPaid ? "bg-green-500" : "bg-dourado")}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-white">{formatCurrency(loan.totalAmount)}</p>
                          <p className="text-[9px] text-dourado/40 font-bold uppercase tracking-wider">+{loan.interest}% {loan.interestType}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                            isPaid 
                              ? "bg-green-500/10 border-green-500/20 text-green-500" 
                              : "bg-dourado/10 border-dourado/20 text-dourado"
                          )}>
                            {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {isPaid ? 'Liquidado' : 'Em Aberto'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sumário rápido inferior */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-preto-card border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Pendente</span>
            <span className="text-xl font-display font-bold text-dourado">
              {formatCurrency(filteredLoans.filter(l => l.status !== 'pago').reduce((acc, curr) => acc + curr.totalAmount, 0))}
            </span>
          </div>
          <div className="bg-preto-card border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Itens Vendidos</span>
            <span className="text-xl font-display font-bold text-white">
              {filteredLoans.filter(l => l.type === 'venda').length} Unidades
            </span>
          </div>
          <div className="bg-preto-card border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Taxa de Liquidação</span>
            <span className="text-xl font-display font-bold text-green-500">
              {loans.length > 0 ? Math.round((loans.filter(l => l.paidInstallments >= l.installments).length / loans.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
