'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Landmark, LayoutDashboard, List, LogOut } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { authService } from '@/lib/auth'

export function Navbar() {
  const pathname = usePathname()

  const handleLogout = () => {
    authService.logout()
    window.location.reload()
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-preto/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-[1200px] px-5 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-dourado rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <Landmark className="h-5 w-5 text-black" />
            </div>
            <span className="font-display text-xl font-bold italic tracking-tight">Ryan Finance</span>
          </Link>

        </div>

        <div className="flex items-center gap-6">
          <span className="hidden sm:block text-white/20 text-[10px] font-bold uppercase tracking-widest">
            {formatDate(new Date().toISOString())}
          </span>
          <button 
            onClick={handleLogout}
            className="h-8 w-8 rounded-lg border border-white/5 flex items-center justify-center text-white/40 hover:text-red-500 hover:border-red-500/50 transition-all"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
