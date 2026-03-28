import { cn } from '@/lib/utils'
import { SectionLabel } from './SectionLabel'

interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  variant?: 'dark' | 'light'
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeader({
  label,
  title,
  subtitle,
  variant = 'dark',
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        className
      )}
    >
      <SectionLabel variant={variant}>{label}</SectionLabel>

      <h2
        className={cn(
          'font-display text-3xl md:text-[44px] font-bold italic leading-[1.08] mt-4',
          variant === 'dark' ? 'text-white' : 'text-preto'
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'mt-5 max-w-2xl font-sans text-base md:text-lg leading-relaxed',
            variant === 'dark' ? 'text-white/70' : 'text-preto/60'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
