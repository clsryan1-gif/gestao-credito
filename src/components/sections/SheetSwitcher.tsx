'use client'

import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, ShoppingBag, PlusCircle } from 'lucide-react'

export type SheetID = 'dashboard' | 'users' | 'sales' | 'register'

interface SheetSwitcherProps {
  currentSheet: SheetID
  onSheetChange: (sheet: SheetID) => void
}

export function SheetSwitcher({ currentSheet, onSheetChange }: SheetSwitcherProps) {
  const tabs = [
    { id: 'dashboard', label: 'Resumo', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'sales', label: 'Vendas', icon: ShoppingBag },
    { id: 'register', label: 'Novo', icon: PlusCircle },
  ] as const

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 pb-safe shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSheetChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all duration-300",
              currentSheet === tab.id 
                ? "text-dourado scale-110" 
                : "text-white/30"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              currentSheet === tab.id ? "bg-dourado/10" : "bg-transparent"
            )}>
              <tab.icon className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.1em]">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
