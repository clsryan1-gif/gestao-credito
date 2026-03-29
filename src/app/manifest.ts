import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'G-CREDITO | Private Debt Control',
    short_name: 'G-Credito',
    description: 'Sistema Ultra-Premium de Gestão de Crédito Digital',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#C9A84C',
    icons: [
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
