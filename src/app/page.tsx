'use client'

import { useState, useEffect } from 'react'
import { Loan } from '@/types'
import { loanService } from '@/lib/loans'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SheetSwitcher, SheetID } from '@/components/sections/SheetSwitcher'
import { UsersSheet } from '@/components/sections/UsersSheet'
import { SalesSheet } from '@/components/sections/SalesSheet'
import { LoanForm } from '@/components/sections/LoanForm'
import { RevenueChart } from '@/components/ui/RevenueChart'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, Users2, LineChart as ChartIcon } from 'lucide-react'

export default function Dashboard() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [mounted, setMounted] = useState(false)
  const [currentSheet, setCurrentSheet] = useState<SheetID>('sales')

  useEffect(() => {
    setLoans(loanService.getLoans())
    setMounted(true)
  }, [])

  const handleAddLoan = (loan: Loan) => {
    loanService.saveLoan(loan)
    setLoans([...loans, loan])
    setCurrentSheet('sales') // Ir para a planilha de vendas após adicionar
  }

  const handleDeleteLoan = (id: string) => {
    loanService.deleteLoan(id)
    setLoans(loans.filter(l => l.id !== id))
  }

  const totalToReceive = loans.reduce((acc, curr) => acc + curr.totalAmount, 0)
  const totalOriginal = loans.reduce((acc, curr) => acc + curr.amount, 0)
  const totalProfit = totalToReceive - totalOriginal
  const activeLoans = loans.filter(l => l.status === 'ativo').length

  if (!mounted) return null

  return (
    <main className="min-h-screen pb-32">
      <div className="mx-auto max-w-[1200px] px-2 pt-20">
        <FadeIn>
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 bg-dourado rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">R</span>
            </div>
            <h1 className="font-display text-lg font-bold italic text-white tracking-tight">Ryan Finance Excel</h1>
          </div>
        </FadeIn>

        {/* Conteúdo Dinâmico Baseado na Aba */}
        <div className="mt-8">
          {currentSheet === 'dashboard' && (
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-preto-card border border-white/5 p-6 rounded-2xl shadow-dark relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-dourado/10 flex items-center justify-center border border-dourado/20">
                      <TrendingUp className="h-5 w-5 text-dourado" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-dourado/60">Fluxo de Caixa</p>
                  </div>
                  <p className="text-3xl font-display font-bold text-white italic">{formatCurrency(totalToReceive)}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Total a Receber</p>
                </div>

                <div className="bg-preto-card border border-white/5 p-6 rounded-2xl shadow-dark relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <ChartIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Lucro Projetado</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-green-500">+{formatCurrency(totalProfit)}</p>
                </div>

                <div className="bg-preto-card border border-white/5 p-6 rounded-2xl shadow-dark relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Users2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Contatos Ativos</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-white leading-none">{activeLoans}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Clientes com Carnê</p>
                </div>
              </div>
              
              {loans.length > 0 && <RevenueChart loans={loans} />}
            </FadeIn>
          )}

          {currentSheet === 'users' && (
            <FadeIn>
              <UsersSheet loans={loans} />
            </FadeIn>
          )}

          {currentSheet === 'sales' && (
            <FadeIn>
              <SalesSheet loans={loans} onDelete={handleDeleteLoan} />
            </FadeIn>
          )}

          {currentSheet === 'register' && (
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <LoanForm onAdd={handleAddLoan} />
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      {/* Seletor de Sheets no Estilo Excel */}
      <SheetSwitcher currentSheet={currentSheet} onSheetChange={setCurrentSheet} />
    </main>
  )
}
