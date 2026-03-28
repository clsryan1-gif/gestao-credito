'use client'

import { Loan } from '@/types'
import { ExcelGrid, ExcelRow } from '../ui/ExcelGrid'
import { MessageSquare, ExternalLink } from 'lucide-react'

interface UsersSheetProps {
  loans: Loan[]
}

export function UsersSheet({ loans }: UsersSheetProps) {
  // Pegar usuários únicos (baseado no nome e whatsapp)
  const uniqueUsers = loans.reduce((acc, current) => {
    const x = acc.find(item => item.name === current.name)
    if (!x) {
      return acc.concat([current])
    } else {
      return acc
    }
  }, [] as Loan[])

  const handleWhatsApp = (phone?: string, name?: string) => {
    if (!phone) {
      alert('Número de WhatsApp não cadastrado para este usuário.')
      return
    }
    const cleanPhone = phone.replace(/\D/g, '')
    const message = encodeURIComponent(`Olá ${name}, tudo bem? Estou entrando em contato sobre sua gestão de crédito e as parcelas pendentes. Como podemos prosseguir?`)
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold italic text-white/90">Folha 02: Usuários Cadastrados</h2>
      </div>

      <ExcelGrid columns={['Nome do Cliente', 'WhatsApp', 'Total de Registros', 'Status Global', 'Ações']}>
        {uniqueUsers.map((user, idx) => {
          const userLoans = loans.filter(l => l.name === user.name)
          const allPaid = userLoans.every(l => l.status === 'pago')
          
          return (
            <ExcelRow 
              key={user.id} 
              index={idx} 
              cells={[
                <span className="font-bold text-white">{user.name}</span>,
                <span className="text-dourado/80">{user.whatsapp || 'Não informado'}</span>,
                <span className="text-center w-full">{userLoans.length} item(s)</span>,
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${allPaid ? 'bg-green-500/10 text-green-500' : 'bg-dourado/10 text-dourado'}`}>
                  {allPaid ? 'LIQUIDADO' : 'PENDENTE'}
                </span>,
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleWhatsApp(user.whatsapp, user.name)}
                    className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-md transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase"
                  >
                    <MessageSquare className="h-3 w-3" /> WhatsApp
                  </button>
                </div>
              ]}
            />
          )
        })}
        
        {uniqueUsers.length === 0 && (
          <div className="p-12 text-center text-white/20 italic">
            Nenhum usuário cadastrado ainda.
          </div>
        )}
      </ExcelGrid>
    </div>
  )
}
