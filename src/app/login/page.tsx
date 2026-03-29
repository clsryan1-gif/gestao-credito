'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('E-MAIL OU SENHA INVÁLIDOS. TENTE NOVAMENTE.')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message.toUpperCase())
      setLoading(false)
    } else {
      alert('REVISAR E-MAIL: ENVIAMOS UM LINK DE CONFIRMAÇÃO.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-dourado/30">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="h-20 w-20 bg-dourado rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-dourado/20">
            <ShieldCheck className="h-10 w-10 text-black stroke-[2.5px]" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tighter italic text-white uppercase italic">
            G CREDITO
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 mt-2">Private Access Only</p>
        </div>

        <form onSubmit={handleSignIn} className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 md:p-10 backdrop-blur-xl space-y-6">
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-[10px] font-bold text-red-500 text-center uppercase tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-dourado transition-colors" />
              <input 
                type="email"
                placeholder="E-MAIL"
                required
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold tracking-widest text-white focus:border-dourado/40 outline-none transition-all placeholder:text-white/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-dourado transition-colors" />
              <input 
                type="password"
                placeholder="SENHA"
                required
                className="w-full bg-preto border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold tracking-[0.3em] text-white focus:border-dourado/40 outline-none transition-all placeholder:text-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full py-6 rounded-2xl text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-dourado/10">
            Acessar Sistema
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <div className="flex items-center gap-4 pt-4">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest whitespace-nowrap">Primeiro Acesso?</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <button 
            type="button"
            onClick={handleSignUp}
            className="w-full py-4 text-[10px] font-bold text-white/30 hover:text-white transition-all uppercase tracking-[0.2em]"
          >
            Cadastrar Novo Gestor
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] text-white/10 uppercase tracking-[0.4em] leading-relaxed">
          Cloud Synchronization Active<br/>
          Secure End-to-End Encryption
        </p>
      </motion.div>
    </main>
  )
}
