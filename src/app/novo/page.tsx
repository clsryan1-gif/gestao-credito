'use client'

import { useEffect } from 'react'
import { ContractForm } from '@/components/ui/ContractForm'
import { Shell } from '@/components/ui/Shell'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NovoContratoPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkUser()
  }, [])

  return (
    <Shell>
      <div className="max-w-[1000px] mx-auto animate-in fade-in duration-700">
        <div className="mb-12 px-2">
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tighter uppercase mb-2">Novo Contrato</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Emissão de Crédito Direto PostgreSQL</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ContractForm onAdd={() => router.push('/lista')} />
        </motion.div>
      </div>
    </Shell>
  )
}
