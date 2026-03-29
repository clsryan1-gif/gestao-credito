'use client'

import { useState, useEffect } from 'react'
import { Contract, GlobalMetrics } from '@/types'
import { gStore } from '@/lib/store'
import { formatCurrency, cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Users2, 
  Clock, 
  BarChart3, 
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Shell } from '@/components/ui/Shell'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null)
  const [userConfig, setUserConfig] = useState(gStore.getConfig())
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  const refreshData = async () => {
    setIsSyncing(true)
    const all = await gStore.syncFromCloud()
    setContracts(all)
    setMetrics(gStore.getMetrics())
    setUserConfig(gStore.getConfig())
    setIsSyncing(false)
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        refreshData()
      }
    }
    checkUser()
  }, [])

  return (
    <Shell>
      <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <h1 className="text-4xl font-display font-bold text-white italic tracking-tighter uppercase mb-2">Painel de Controle</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
              {userConfig.ownerName ? `Gestão Privada: ${userConfig.ownerName}` : 'Monitoramento de Crédito Ativo'}
            </p>
          </div>
          <div className="flex bg-white/[0.03] border border-white/5 p-4 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Conexão PostgreSQL Blindada</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-preto-card border border-white/5 p-8 rounded-[40px] relative overflow-hidden group hover:border-dourado/20 transition-all duration-500 shadow-2xl shadow-dourado/5">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Capital em Giro</p>
                <p className="text-4xl font-display font-bold text-white italic tracking-tighter">
                  {userConfig.privacyMode ? 'R$ ••••••' : formatCurrency(metrics?.totalReceivable || 0)}
                </p>
                <div className="flex items-center gap-2 mt-4 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-bold font-mono">+{userConfig.privacyMode ? '••••' : formatCurrency(metrics?.totalProfit || 0)}</span>
                  <span className="text-[9px] font-bold uppercase text-white/20">Lucro Estimado</span>
                </div>
              </div>
              <BarChart3 className="absolute right-[-20px] bottom-[-20px] h-40 w-40 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
           </div>

           <div className="bg-preto-card border border-white/5 p-8 rounded-[40px] relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Contratos Ativos</p>
              <div className="flex items-end justify-between">
                <p className="text-5xl font-display font-bold text-white italic">{metrics?.activeDebts || 0}</p>
                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                  <Users2 className="h-4 w-4 text-blue-400" />
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Clientes</span>
                </div>
              </div>
           </div>

           <div className={cn(
             "p-8 rounded-[40px] border transition-all duration-500",
             (metrics?.overdueDebts || 0) > 0 
              ? "bg-red-500/5 border-red-500/20 shadow-xl shadow-red-500/5" 
              : "bg-preto-card border-white/5 opacity-40 grayscale"
           )}>
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] mb-4",
                (metrics?.overdueDebts || 0) > 0 ? "text-red-500" : "text-white/20"
              )}>Alertas Incríveis</p>
              <div className="flex items-center gap-6">
                <p className="text-5xl font-display font-bold text-white italic">{metrics?.overdueDebts || 0}</p>
                <div className={cn("h-10 w-10 flex items-center justify-center rounded-2xl", (metrics?.overdueDebts || 0) > 0 ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-white/5 text-white/20")}>
                  <Clock className="h-5 w-5" />
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 flex gap-6 items-start">
              <div className="h-12 w-12 bg-dourado/10 rounded-2xl flex items-center justify-center border border-dourado/20 flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-dourado" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase mb-2">Segurança Bancária</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  Criptografia de ponta a ponta e Row Level Security ativada. Seus contratos de venda e crédito estão protegidos pela infraestrutura PostgreSQL.
                </p>
              </div>
           </div>
           
           <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 flex gap-6 items-start">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase mb-2">Motor de Juros Pro</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  Cálculos automáticos de amortização e lucro bruto. Gerencie sua carteira de clientes com a precisão de um banco digital.
                </p>
              </div>
           </div>
        </div>

        <div className="pt-8">
           <button 
            onClick={() => router.push('/lista')}
            className="flex items-center gap-3 text-dourado font-bold text-[10px] uppercase tracking-[0.3em] hover:gap-6 transition-all duration-300 group"
          >
            Acessar Lista Técnica Completa
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </Shell>
  )
}
