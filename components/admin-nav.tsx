'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
          <Link href="/admin/login" className="font-bold text-lg text-foreground hover:text-primary">
            BeatFrame Admin
          </Link>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Volver al sitio
          </Link>
        </div>
      </div>
    </nav>
  )
}
