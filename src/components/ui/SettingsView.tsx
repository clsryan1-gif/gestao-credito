'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  Database, 
  Trash2, 
  Save, 
  ShieldAlert,
  Key
} from 'lucide-react'
import { gStore } from '@/lib/store'
import { UserConfig } from '@/types'
import { Button } from './Button'

interface SettingsViewProps {
  onUpdate: () => void
}

export function SettingsView({ onUpdate }: SettingsViewProps) {
  const [config, setConfig] = useState<UserConfig>({
    ownerName: '',
    privacyMode: false,
    accessPin: '',
    lastBackup: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setConfig(gStore.getConfig())
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    gStore.saveConfig(config)
    setTimeout(() => {
      setIsSaving(false)
      onUpdate()
    }, 500)
  }

  const handleExport = () => gStore.exportBackup()
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (gStore.importBackup(content)) {
        alert('DADOS IMPORTADOS COM SUCESSO!')
        onUpdate()
      } else {
        alert('FALHA NA IMPORTAÇÃO. ARQUIVO INVÁLIDO.')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (confirm('ATENÇÃO: VOCÊ ESTÁ PRESTES A ZERAR O SISTEMA.\nTODOS OS CONTRATOS SERÃO APAGADOS PARA SEMPRE.\n\nDESEJA CONTINUAR?')) {
      if (confirm('TEM ABSOLUTA CERTEZA? ESTA AÇÃO NÃO PODE SER DESFEITA.')) {
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-20">
      {/* Perfil & Identidade */}
      <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-4 w-4 text-dourado" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Identidade do Gestor</h3>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="SEU NOME (EX: RYAN)"
              className="w-full bg-preto border border-white/10 rounded-xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-dourado/40 transition-all outline-none"
              value={config.ownerName}
              onChange={(e) => setConfig({...config, ownerName: e.target.value})}
            />
          </div>
        </div>
      </section>

      {/* Privacidade & Segurança */}
      <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-4 w-4 text-blue-400" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Segurança & Visibilidade</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                {config.privacyMode ? <EyeOff className="h-4 w-4 text-blue-400" /> : <Eye className="h-4 w-4 text-white/40" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-tight">Modo de Privacidade</p>
                <p className="text-[9px] text-white/20 uppercase tracking-widest">Ocultar lucros no Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setConfig({...config, privacyMode: !config.privacyMode})}
              className={`w-12 h-6 rounded-full transition-all relative ${config.privacyMode ? 'bg-dourado' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.privacyMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="relative">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-white/20">
               <Key className="h-4 w-4" />
             </div>
             <input 
              type="password"
              maxLength={4}
              placeholder="PIN DE ACESSO (4 DÍGITOS)"
              className="w-full bg-preto border border-white/10 rounded-xl pl-14 pr-6 py-4 text-xs font-bold tracking-[0.5em] text-white focus:border-blue-500/40 transition-all outline-none"
              value={config.accessPin}
              onChange={(e) => setConfig({...config, accessPin: e.target.value.replace(/\D/g, '')})}
            />
          </div>
          <p className="text-[9px] text-white/20 uppercase tracking-widest text-center">Deixe em branco para acesso livre</p>
        </div>
      </section>

      {/* Backup & Dados */}
      <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-4 w-4 text-green-400" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Gestão de Dados Brutal</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleExport} className="py-4 text-[10px] h-auto flex flex-col items-center gap-2 border-white/5 hover:border-dourado/20">
            <Download className="h-5 w-5" />
            Exportar Backup
          </Button>
          <label className="flex-1">
            <div className="w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-white/5 hover:border-blue-500/20 bg-white/5 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
              <Database className="h-5 w-5" />
              Importar Backup
            </div>
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
        </div>
      </section>

      {/* Salvar & Reset */}
      <div className="flex flex-col gap-4">
        <Button onClick={handleSave} className="w-full py-5 shadow-xl shadow-dourado/5" disabled={isSaving}>
          <Save className="h-5 w-5" />
          {isSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
        </Button>
        <button 
          onClick={handleReset}
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-bold text-red-500/20 hover:text-red-500 transition-all uppercase tracking-[0.2em]"
        >
          <ShieldAlert className="h-4 w-4" />
          Zerar Todo o Sistema
        </button>
      </div>
    </div>
  )
}
