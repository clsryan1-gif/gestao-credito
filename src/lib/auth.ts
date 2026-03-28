'use client'

export const authService = {
  login: (password: string): boolean => {
    if (password === 'ryan123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ryan_finance_auth', 'authenticated')
      }
      return true
    }
    return false
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ryan_finance_auth')
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('ryan_finance_auth') === 'authenticated'
  }
}
