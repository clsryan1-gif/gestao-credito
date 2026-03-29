'use client'

import { useState, useEffect } from 'react'
import { Debt, GlobalMetrics } from '@/types'
import { gStore } from '@/lib/store'
import { formatCurrency, cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Users2, 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  Plus, 
  ListOrdered
} from 'lucide-react'
import { DebtTable } from '@/components/ui/DebtTable'
import { DebtForm } from '@/components/ui/DebtForm'
import { ActionDrawer } from '@/components/ui/ActionDrawer'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null)
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [view, setView] = useState<'list' | 'add'>('list')
  const [mounted, setMounted] = useState(false)

  const refreshData = () => {
    const allDebts = gStore.getDebts()
    setDebts(allDebts)
    setMetrics(gStore.getMetrics())
  }

  useEffect(() => {
    refreshData()
    setMounted(true)
  }, [])

  const handleManage = (debt: Debt) => {
    setSelectedDebt(debt)
    setIsDrawerOpen(true)
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black text-white selection:bg-dourado/30 relative">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        
        {/* Header G-Credito */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-2">
          <div className="flex items-center gap-4 group">
            <div className="h-12 w-12 bg-dourado rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-dourado/20">
              <ShieldCheck className="text-black h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tighter italic text-white group-hover:text-glow-dourado transition-all uppercase">G CREDITO</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Private Debt Control</p>
            </div>
          </div>

          <nav className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl backdrop-blur-sm self-start md:self-center">
             <button 
              onClick={() => setView('list')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'list' ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white"
              )}
            >
              <ListOrdered className="h-4 w-4" />
              Lista Técnica
            </button>
            <button 
              onClick={() => setView('add')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'add' ? "bg-dourado text-black shadow-lg shadow-dourado/20" : "text-white/30 hover:text-white"
              )}
            >
              <Plus className="h-4 w-4" />
              Novo Contrato
            </button>
          </nav>
        </div>

        {/* Dash Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Métricas */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-preto-card border border-white/5 p-7 rounded-3xl relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Capital em Giro</p>
                  <p className="text-3xl font-display font-bold text-white italic tracking-tighter">
                    {formatCurrency(metrics?.totalReceivable || 0)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-green-500">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-[10px] font-bold">+{formatCurrency(metrics?.totalProfit || 0)} Lucro</span>
                  </div>
                </div>
                <BarChart3 className="absolute right-[-20px] bottom-[-20px] h-32 w-32 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
             </div>

             <div className="bg-preto-card border border-white/5 p-7 rounded-3xl relative overflow-hidden group">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Contratos Ativos</p>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-display font-bold text-white italic">{metrics?.activeDebts || 0}</p>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Users2 className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-[10px] font-bold text-white/60">Clientes</span>
                  </div>
                </div>
             </div>

             <div className={cn(
               "p-7 rounded-3xl border transition-all duration-500",
               (metrics?.overdueDebts || 0) > 0 
                ? "bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/10" 
                : "bg-preto-card border-white/5 opacity-40 grayscale"
             )}>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.3em] mb-4",
                  (metrics?.overdueDebts || 0) > 0 ? "text-red-500" : "text-white/20"
                )}>Saldo Inadimplente</p>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-display font-bold text-white italic">{metrics?.overdueDebts || 0}</p>
                  <Clock className={cn("h-5 w-5", (metrics?.overdueDebts || 0) > 0 ? "text-red-500 animate-pulse" : "text-white/20")} />
                </div>
             </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {view === 'list' ? (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <DebtTable debts={debts} onManage={handleManage} />
                </motion.div>
              ) : (
                <motion.div 
                  key="add"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <DebtForm onAdd={() => { setView('list'); refreshData(); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Drawer Técnico */}
      <ActionDrawer 
        debt={selectedDebt}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={() => { 
          refreshData();
          if (selectedDebt) {
            const updated = gStore.getDebts().find(d => d.id === selectedDebt.id);
            setSelectedDebt(updated || null);
          }
        }}
      />
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-dourado/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>
    </main>
  )
}
