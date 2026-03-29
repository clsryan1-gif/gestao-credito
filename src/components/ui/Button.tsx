'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  children?: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-dourado text-black hover:bg-dourado/90 shadow-lg shadow-dourado/20 active:scale-95 transition-all text-glow-dourado',
    secondary: 'bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all',
    ghost: 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 transition-all',
    outline: 'bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg',
    md: 'px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl',
    lg: 'px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-2xl',
    icon: 'p-2 rounded-lg'
  }

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
