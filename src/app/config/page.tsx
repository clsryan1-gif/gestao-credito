'use client'

import { useState, useEffect } from 'react'
import { SettingsView } from '@/components/ui/SettingsView'
import { Shell } from '@/components/ui/Shell'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ConfigPage() {
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
      <div className="max-w-[800px] mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tighter uppercase mb-1">Configurações</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Gestão de Perfil, Backup e Segurança</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <SettingsView onUpdate={() => {}} />
        </motion.div>
      </div>
    </Shell>
  )
}
