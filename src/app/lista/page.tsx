'use client'

import { useState, useEffect } from 'react'
import { Contract } from '@/types'
import { gStore } from '@/lib/store'
import { 
  ListOrdered, 
  Search, 
  RefreshCw 
} from 'lucide-react'
import { ContractTable } from '@/components/ui/ContractTable'
import { ActionDrawer } from '@/components/ui/ActionDrawer'
import { Shell } from '@/components/ui/Shell'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ListaPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const router = useRouter()

  const refreshData = async () => {
    setIsSyncing(true)
    const all = await gStore.syncFromCloud()
    setContracts(all)
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

  const handleManage = (contract: Contract) => {
    setSelectedContract(contract)
    setIsDrawerOpen(true)
  }

  const filtered = contracts.filter(c => 
    c.clientName.toLowerCase().includes(search.toLowerCase()) || 
    c.itemDescription.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Shell>
      <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div>
            <h1 className="text-3xl font-display font-bold text-white italic tracking-tighter uppercase mb-1">Lista Técnica</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Gestão de Contratos de Crédito</p>
          </div>
          
          <div className="flex items-center gap-4">
             {isSyncing && (
               <div className="flex items-center gap-2 text-dourado animate-pulse">
                 <RefreshCw className="h-4 w-4 animate-spin" />
                 <span className="text-[9px] font-bold uppercase tracking-widest">Sincronizando PostgreSQL...</span>
               </div>
             )}
          </div>
        </div>

        <div className="bg-preto-card border border-white/5 p-2 rounded-3xl flex items-center group focus-within:border-dourado/20 transition-all shadow-xl shadow-dourado/5">
           <div className="h-12 w-12 flex items-center justify-center text-white/20 group-focus-within:text-dourado">
             <Search className="h-5 w-5" />
           </div>
           <input 
            type="text"
            placeholder="BUSCAR POR CLIENTE OU DESCRIÇÃO DO ITEM..."
            className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-bold uppercase tracking-widest py-4 px-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ContractTable contracts={filtered} onManage={handleManage} />

        <ActionDrawer 
          contract={selectedContract}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onUpdate={refreshData}
        />
      </div>
    </Shell>
  )
}
