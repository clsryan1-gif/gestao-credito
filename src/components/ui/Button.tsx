import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans text-[13px] font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-dourado text-black hover:bg-dourado-claro hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-transparent text-white border border-white/35 hover:border-dourado/60 hover:text-dourado',
        ghost:
          'bg-transparent text-dourado-escuro border border-dourado hover:bg-dourado hover:text-black',
        danger:
          'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-7 py-3 text-[13px]',
        lg: 'px-9 py-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  showArrow?: boolean
}

export function Button({
  className,
  variant,
  size,
  showArrow = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), 'rounded-lg', className)

  return (
    <button className={classes} {...props}>
      {children}
      {showArrow && <ArrowUpRight className="h-4 w-4" />}
    </button>
  )
}
