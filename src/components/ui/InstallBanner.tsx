'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share, PlusSquare, X, Download, ShieldCheck } from 'lucide-react'
import { Button } from './Button'

export function InstallBanner() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Verificar se já está em modo standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) return

    // Detectar iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(ios)

    // Handler para Android/Chrome
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Mostrar após 3 segundos para não ser invasivo logo de cara
      setTimeout(() => setShow(true), 3000)
    }

    if (ios) {
      // Mostrar para iOS após 4 segundos
      setTimeout(() => setShow(true), 4000)
    } else {
      window.addEventListener('beforeinstallprompt', handler)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShow(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[200] max-w-md mx-auto"
        >
          <div className="bg-[#0A0A0A] border border-dourado/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(201,168,76,0.15)] backdrop-blur-xl relative overflow-hidden">
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 bg-dourado rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-dourado/20">
                <ShieldCheck className="h-7 w-7 text-black" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Instalar G-CREDITO</h3>
                <p className="text-[11px] text-white/40 leading-relaxed mt-1">
                  Adicione à sua tela de início para acesso rápido, seguro e offline aos seus dados.
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500/20 p-1.5 rounded-lg">
                      <Share className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-bold text-white/60 uppercase">1. Toque no ícone de Compartilhar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-1.5 rounded-lg">
                      <PlusSquare className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-white/60 uppercase">2. Selecione "Adicionar à Tela de Início"</span>
                  </div>
                </div>
                <p className="text-[9px] text-center text-dourado/40 font-bold uppercase tracking-widest">Experiência Ultra-Premium Ativada</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button 
                  onClick={handleAndroidInstall}
                  className="flex-1 py-4 shadow-dourado/10"
                >
                  <Download className="h-4 w-4" />
                  Instalar Agora
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShow(false)}
                  className="flex-1 py-4"
                >
                  Talvez Depois
                </Button>
              </div>
            )}

            {/* Shine FX */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dourado/50 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
