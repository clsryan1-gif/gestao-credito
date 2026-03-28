import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  variant?: 'dark' | 'light'
  className?: string
}

export function SectionLabel({
  children,
  variant = 'dark',
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.20em] mb-3.5',
        variant === 'dark' && 'text-dourado border border-dourado/35',
        variant === 'light' && 'text-dourado-escuro border border-dourado-escuro/30',
        className
      )}
    >
      {children}
    </span>
  )
}
