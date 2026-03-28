'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Loan } from '@/types'

interface RevenueChartProps {
  loans: Loan[]
}

export function RevenueChart({ loans }: RevenueChartProps) {
  const data = loans.map(loan => ({
    name: loan.name,
    original: loan.amount,
    total: loan.totalAmount,
    profit: loan.totalAmount - loan.amount
  }))

  if (loans.length === 0) return null

  return (
    <div className="bg-preto-card rounded-2xl p-8 border border-white/5 shadow-dark h-[400px]">
      <div className="mb-6">
        <h3 className="font-display text-xl font-bold italic text-white">Análise de Rentabilidade</h3>
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Projeção por amigo</p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#ffffff40" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#ffffff05' }}
            contentStyle={{ 
              backgroundColor: '#1A1A1A', 
              border: '1px solid rgba(201,168,76,0.20)',
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="original" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Original" />
          <Bar dataKey="total" fill="#C9A84C" radius={[4, 4, 0, 0]} name="Total c/ Juros" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
