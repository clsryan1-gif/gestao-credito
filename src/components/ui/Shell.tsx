'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ListOrdered, 
  PlusCircle, 
  History, 
  Settings, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface ShellProps {
  children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Lista Técnica', href: '/lista', icon: ListOrdered },
    { name: 'Novo Contrato', href: '/novo', icon: PlusCircle },
    { name: 'Histórico', href: '/historico', icon: History },
    { name: 'Configurações', href: '/config', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-preto-card sticky top-0 h-screen p-8 z-[50]">
        <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => router.push('/dashboard')}>
          <div className="h-10 w-10 bg-dourado rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-dourado/20">
            <ShieldCheck className="text-black h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tighter italic text-white uppercase italic">G CREDITO</h1>
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">Private Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all group",
                  isActive 
                    ? "bg-white/10 text-white shadow-xl border border-white/5" 
                    : "text-white/30 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={cn("h-4 w-4", isActive ? "text-dourado" : "text-white/20 group-hover:text-white/40")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-3 w-3 text-dourado" />}
              </Link>
            )
          })}
        </nav>

        <div className="pt-8 mt-8 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen pb-32 md:pb-0 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-dourado rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-black h-5 w-5" />
             </div>
             <span className="font-display font-bold text-white uppercase italic tracking-tighter">G-CREDITO</span>
          </div>
          {pathname !== '/dashboard' && (
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          )}
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 md:p-12 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-preto-card/90 backdrop-blur-xl border-t border-white/5 px-4 py-3 z-[100] flex justify-around items-center rounded-t-[32px] shadow-2xl shadow-dourado/10">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all",
                isActive ? "text-dourado" : "text-white/20"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className="text-[7px] font-bold uppercase tracking-widest">{item.name.split(' ')[0]}</span>
            </Link>
          )
        })}
        <Link 
          href="/config" 
          className={cn(
            "flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all",
            pathname === '/config' ? "text-dourado" : "text-white/20"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[7px] font-bold uppercase tracking-widest">Ajustes</span>
        </Link>
      </nav>
    </div>
  )
}
