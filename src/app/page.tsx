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
  ListOrdered,
  Download,
  Database,
  ArrowLeft,
  Settings
} from 'lucide-react'
import { DebtTable } from '@/components/ui/DebtTable'
import { DebtForm } from '@/components/ui/DebtForm'
import { ActionDrawer } from '@/components/ui/ActionDrawer'
import { InstallBanner } from '@/components/ui/InstallBanner'
import { SettingsView } from '@/components/ui/SettingsView'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Zap, Key } from 'lucide-react'

export default function Dashboard() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null)
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [view, setView] = useState<'list' | 'add' | 'settings'>('list')
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [userConfig, setUserConfig] = useState(gStore.getConfig())
  const [isLocked, setIsLocked] = useState(false)
  const [pinInput, setPinInput] = useState('')

  const refreshData = () => {
    const allDebts = gStore.getDebts()
    setDebts(allDebts)
    setMetrics(gStore.getMetrics())
    const config = gStore.getConfig()
    setUserConfig(config)
    
    if (config.accessPin && !isLocked && mounted) {
      // O PIN só bloqueia no primeiro carregamento
    }
  }

  useEffect(() => {
    refreshData()
    setMounted(true)
    const config = gStore.getConfig()
    if (config.accessPin) setIsLocked(true)
  }, [])

  const handleManage = (debt: Debt) => {
    setSelectedDebt(debt)
    setIsDrawerOpen(true)
  }

  const filteredDebts = debts.filter(d => 
    d.clientName.toLowerCase().includes(search.toLowerCase()) || 
    d.itemName.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => gStore.exportBackup()
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (gStore.importBackup(content)) {
        alert('Dados importados com sucesso!')
        refreshData()
      } else {
        alert('Falha ao importar. Arquivo inválido.')
      }
    }
    reader.readAsText(file)
  }

  if (!mounted) return null

  if (isLocked) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-preto-card border border-white/5 p-10 rounded-[40px] max-w-sm w-full text-center shadow-2xl shadow-blue-500/5"
        >
          <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <Lock className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight mb-2">Acesso Restrito</h2>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Insira seu PIN G-CREDITO</p>
          
          <input 
            type="password"
            maxLength={4}
            className="w-full bg-preto border border-white/10 rounded-2xl px-6 py-5 text-center text-2xl font-bold tracking-[1em] text-white focus:border-blue-500/40 outline-none mb-6 transition-all"
            autoFocus
            value={pinInput}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '')
              setPinInput(val)
              if (val === userConfig.accessPin) {
                setIsLocked(false)
              }
            }}
          />
          <p className="text-[9px] text-white/10 uppercase tracking-widest leading-relaxed">Proteção Local Ativada</p>
        </motion.div>
      </main>
    )
  }

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
              <h1 className="font-display text-2xl font-bold tracking-tighter italic text-white group-hover:text-glow-dourado transition-all uppercase">
                {userConfig.ownerName ? `G-CREDITO DE ${userConfig.ownerName}` : 'G CREDITO'}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Private Debt Control</p>
            </div>
          </div>

          <nav className="flex bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl backdrop-blur-sm self-start md:self-center">
             {(view === 'add' || view === 'settings') && (
               <button 
                onClick={() => setView('list')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-white/30 hover:text-white mr-2 border-r border-white/5 pr-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
             )}
             <button 
              onClick={() => setView('list')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'list' ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white"
              )}
            >
              <ListOrdered className="h-4 w-4" />
              Lista
            </button>
            <button 
              onClick={() => setView('add')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                view === 'add' ? "bg-dourado text-black shadow-lg shadow-dourado/20" : "text-white/30 hover:text-white"
              )}
            >
              <Plus className="h-4 w-4" />
              Novo
            </button>
            <button 
              onClick={() => setView('settings')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ml-1",
                view === 'settings' ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white"
              )}
            >
              <Settings className="h-4 w-4" />
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
                    {userConfig.privacyMode ? 'R$ ••••••' : formatCurrency(metrics?.totalReceivable || 0)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-green-500">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-[10px] font-bold">+{userConfig.privacyMode ? '••••' : formatCurrency(metrics?.totalProfit || 0)} Lucro</span>
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
                  <div className="mb-6 flex gap-4">
                    <div className="flex-1 relative">
                       <input 
                        type="text"
                        placeholder="BUSCAR CONTRATO OU CLIENTE..."
                        className="w-full bg-preto border border-white/5 rounded-2xl pl-6 pr-4 py-4 text-[10px] font-bold uppercase tracking-widest text-white focus:border-dourado/40 focus:outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <DebtTable debts={filteredDebts} onManage={handleManage} />
                </motion.div>
              ) : view === 'add' ? (
                <motion.div 
                  key="add"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <DebtForm onAdd={() => { setView('list'); refreshData(); }} />
                </motion.div>
              ) : (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <SettingsView onUpdate={refreshData} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Seção de Privacidade / Banco de Dados Local */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-12"
            >
              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <div className="h-10 w-10 bg-dourado/10 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="h-5 w-5 text-dourado" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase mb-2">Dados Blindados</h3>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Seus dados não passam por nossos servidores. Tudo é salvo localmente no seu aparelho (IndexedDB), garantindo privacidade total.
                </p>
              </div>

              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase mb-2">Alta Performance</h3>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Por rodar direto no hardware do seu celular, o G-Credito é instantâneo, mesmo sem internet ou em redes lentas.
                </p>
              </div>

              <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <div className="h-10 w-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Database className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase mb-2">Banco Individual</h3>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Cada pessoa que acessa o link cria um banco de dados único e isolado. Suas dívidas são só suas e de mais ninguém.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <InstallBanner />

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
