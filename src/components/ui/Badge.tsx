import { cn } from '@/lib/utils'
import { DebtStatus } from '@/types'

interface BadgeProps {
  status: DebtStatus
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const styles = {
    ativo: 'bg-dourado/10 text-dourado border-dourado/20',
    atrasado: 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    liquidado: 'bg-green-500/10 text-green-500 border-green-500/20'
  }

  const labels = {
    ativo: 'Em Dia',
    atrasado: 'Inadimplente',
    liquidado: 'Liquidado'
  }

  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border',
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  )
}
