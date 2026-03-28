'use client'

import { useRouter } from 'next/navigation'
import { Loan } from '@/types'
import { loanService } from '@/lib/loans'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn } from '@/components/ui/FadeIn'
import { LoanForm } from '@/components/sections/LoanForm'
import { Simulator } from '@/components/sections/Simulator'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RegistrarPage() {
  const router = useRouter()

  const handleAddLoan = (loan: Loan) => {
    loanService.saveLoan(loan)
    router.push('/')
  }

  return (
    <main className="min-h-screen pb-20 pt-32">
      <div className="mx-auto max-w-[1200px] px-5">
        <FadeIn>
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-dourado/60">Voltar ao Painel</span>
          </div>

          <SectionHeader 
            label="CENTRAL DE REGISTROS"
            title="Nova Venda ou Empréstimo"
            subtitle="Cadastre novos ativos com precisão. O sistema aplicará as regras de juros e parcelamento automaticamente."
            align="left"
          />
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <FadeIn delay={0.2}>
              <LoanForm onAdd={handleAddLoan} />
            </FadeIn>
          </div>
          <div className="lg:col-span-5">
            <FadeIn delay={0.3}>
              <Simulator />
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  )
}
