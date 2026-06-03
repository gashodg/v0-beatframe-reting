import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function MisAlquileresPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Mis alquileres</h1>
          <p className="text-muted-foreground mt-1">Sistema de gestión de alquileres</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Bienvenido</h2>
          <p className="text-muted-foreground">El sistema de alquileres estará disponible próximamente.</p>
        </div>
      </main>
    </div>
  )
}
