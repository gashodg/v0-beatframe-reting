'use client'

import { useActionState } from 'react'
import { loginAdmin } from '@/app/actions/admin-auth'

const initialState = { error: '' }

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(loginAdmin, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Área restringida
          </p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">BeatFrame Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceso exclusivo para administradores</p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@beatframe.com"
              className="w-full h-11 rounded-sm border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full h-11 rounded-sm border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400 font-mono">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-sm bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Verificando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground/50">
          <a href="/" className="hover:text-muted-foreground transition-colors">← Volver al sitio público</a>
        </p>
      </div>
    </div>
  )
}
