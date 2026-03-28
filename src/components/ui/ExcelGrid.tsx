'use client'

import React from 'react'

interface ExcelTableProps {
  children: React.ReactNode
  columns: string[]
}

export function ExcelGrid({ children, columns }: ExcelTableProps) {
  return (
    <div className="w-full overflow-x-auto border-2 border-white/20 rounded-lg bg-black/90 shadow-2xl font-mono relative">
      <div className="min-w-max">
        {/* Header (A, B, C...) */}
        <div className="flex border-b-2 border-white/20 bg-zinc-900 select-none sticky top-0 z-20">
          <div className="w-12 h-8 border-r border-white/10 flex items-center justify-center text-[10px] font-bold text-white/30 bg-black/80 sticky left-0 z-30">
            #
          </div>
          {columns.map((col, i) => (
            <div 
              key={i} 
              className="px-4 h-8 min-w-[150px] border-r border-white/20 flex items-center justify-center text-[11px] font-bold tracking-widest text-dourado/80 uppercase"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        
        {/* Sub-Header (Labels) */}
        <div className="flex border-b-2 border-white/20 bg-zinc-800 select-none sticky top-8 z-20">
          <div className="w-12 h-10 border-r border-white/20 bg-zinc-700 sticky left-0 z-30 flex items-center justify-center"></div>
          {columns.map((col, i) => (
            <div 
              key={i} 
              className="px-4 h-10 min-w-[150px] border-r border-white/20 flex items-center font-bold text-[10px] text-white/90 bg-zinc-800"
            >
              {col}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ExcelRowProps {
  index: number
  cells: React.ReactNode[]
  onClick?: () => void
}

export function ExcelRow({ index, cells, onClick }: ExcelRowProps) {
  return (
    <div 
      onClick={onClick}
      className="flex border-b border-white/20 hover:bg-dourado/5 transition-colors group cursor-pointer"
    >
      <div className="w-12 h-12 border-r border-white/20 flex items-center justify-center text-[10px] font-bold text-white/40 bg-zinc-900 sticky left-0 z-10 group-hover:text-dourado/60 transition-all">
        {index + 1}
      </div>
      {cells.map((cell, i) => (
        <div 
          key={i} 
          className="px-4 h-12 min-w-[150px] border-r border-white/20 flex items-center text-sm text-white/80"
        >
          {cell}
        </div>
      ))}
    </div>
  )
}
