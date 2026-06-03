import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function RentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Alquiler #{id.slice(0, 8)}</h1>
          <p className="text-muted-foreground mt-1">Detalles y gestión de documentos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sistema de alquiler en desarrollo</h2>
          <p className="text-muted-foreground">Los detalles completos del alquiler estarán disponibles próximamente.</p>
        </div>
      </main>
    </div>
  )
}
