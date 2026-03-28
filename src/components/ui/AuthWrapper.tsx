'use client'

import { useState, useEffect } from 'react'
import { authService } from '@/lib/auth'
import { FadeIn } from './FadeIn'
import { Button } from './Button'
import { Lock, Landmark, ShieldAlert } from 'lucide-react'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (authService.login(password)) {
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (isLoading) return <div className="min-h-screen bg-preto" />

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-preto flex items-center justify-center p-5 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-dourado/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-dourado/5 blur-[100px] rounded-full" />
        </div>

        <FadeIn>
          <div className="w-full max-w-[400px] relative z-10">
            <div className="text-center mb-10">
              <div className="mx-auto h-16 w-16 bg-dourado rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <Landmark className="h-8 w-8 text-black" />
              </div>
              <h1 className="font-display text-3xl font-bold italic text-white tracking-tight mb-2">Ryan Finance</h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Acesso Administrativo Premium</p>
            </div>

            <form onSubmit={handleLogin} className="bg-preto-card border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative group">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dourado/60 ml-1">Senha de Acesso</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input 
                      type="password"
                      placeholder="••••••••"
                      className={`w-full bg-preto border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/10 focus:border-dourado/50 focus:outline-none transition-all`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <Button variant="primary" size="lg" type="submit" className="w-full py-4 text-sm font-bold uppercase tracking-widest">
                  Entrar no Sistema
                </Button>

                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-500 text-[11px] font-bold uppercase tracking-wider animate-shake">
                    <ShieldAlert className="h-3.5 w-3.5" /> Senha Incorreta
                  </div>
                )}
              </div>
              
              {/* Decorative border glow */}
              <div className="absolute inset-0 border border-white/5 rounded-3xl group-hover:border-dourado/20 transition-colors pointer-events-none" />
            </form>
            
            <p className="text-center mt-12 text-[10px] text-white/20 font-bold uppercase tracking-widest">
              &copy; 2026 Ryan Finance • Proteção de Nível Bancário
            </p>
          </div>
        </FadeIn>
      </div>
    )
  }

  return <>{children}</>
}
