'use client'

import { useState, useEffect } from 'react'
import { Contract } from '@/types'
import { gStore } from '@/lib/store'
import { 
  History, 
  Search, 
  CheckCircle2,
  Calendar,
  Package,
  ArrowRight
} from 'lucide-react'
import { Shell } from '@/components/ui/Shell'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function HistoricoPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        const all = await gStore.syncFromCloud()
        setContracts(all.filter(d => d.status === 'liquidado'))
      }
    }
    checkUser()
  }, [])

  const filtered = contracts.filter(c => 
    c.clientName.toLowerCase().includes(search.toLowerCase()) || 
    c.itemDescription.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Shell>
      <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-700">
        <div className="px-2">
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tighter uppercase mb-2">Arquivo Histórico</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Consolidado de Contratos Liquidados no PostgreSQL</p>
        </div>

        <div className="bg-preto-card border border-white/5 p-2 rounded-3xl flex items-center group focus-within:border-dourado/20 transition-all shadow-xl shadow-dourado/5">
           <div className="h-12 w-12 flex items-center justify-center text-white/20 group-focus-within:text-dourado">
             <Search className="h-5 w-5" />
           </div>
           <input 
            type="text"
            placeholder="PESQUISAR NO ARQUIVO DE QUITAÇÃO..."
            className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-bold uppercase tracking-widest py-4 px-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((contract) => (
              <motion.div 
                key={contract.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] group hover:border-green-500/20 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20 shadow-lg shadow-green-500/10">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-green-500 transition-colors">{contract.clientName}</h3>
                      <p className="text-[9px] text-white/20 font-mono tracking-widest mt-0.5">ID: {contract.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-white/20 uppercase tracking-widest">Item Vendido</span>
                      <span className="text-white/60 uppercase">{contract.itemDescription}</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-white/20 uppercase tracking-widest">Total Liquidado</span>
                      <span className="text-white font-display italic text-lg">{formatCurrency(contract.totalToPay)}</span>
                   </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono uppercase">
                    <Calendar className="h-3 w-3" />
                    {formatDate(contract.startDate)}
                  </div>
                  <span className="text-[9px] font-bold text-green-500/60 uppercase tracking-[0.2em] bg-green-500/5 px-3 py-1 rounded-full border border-green-500/10">
                    #{contract.installmentsCount} Parcelas
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 border border-dashed border-white/5 rounded-[60px] flex flex-col items-center justify-center opacity-20">
              <History className="h-16 w-16 mb-6" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Nenhum contrato arquivado no sistema</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}
