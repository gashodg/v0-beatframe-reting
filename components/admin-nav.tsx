'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/app/actions/admin-auth'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Productos' },
  { href: '/admin/rentals', label: 'Alquileres' },
  { href: '/admin/documents', label: 'Documentos' },
  { href: '/admin/emails', label: 'Emails' },
  { href: '/admin/stats', label: 'Estadísticas' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/admin/login" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            BeatFrame Admin
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Sitio
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="font-mono text-xs text-muted-foreground hover:text-red-400 transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
