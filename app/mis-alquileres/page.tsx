import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getRentals } from "@/app/actions/rentals"
import { getProductBySlug } from "@/lib/products"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, ArrowRight, Package } from "lucide-react"

export default async function MisAlquileresPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/admin/login?redirect=/mis-alquileres")
  }

  const rentals = await getRentals()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Mis alquileres</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus reservas y documentación
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {rentals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No tienes alquileres
              </h2>
              <p className="text-muted-foreground mb-6">
                Explora nuestro catálogo y reserva tu primer equipo
              </p>
              <Button asChild>
                <Link href="/catalogo">Ver catálogo</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => {
              const product = getProductBySlug(rental.productId)
              return (
                <Card key={rental.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">
                            {product?.name || rental.productId}
                          </h3>
                          <StatusBadge status={rental.status} />
                          <PaymentBadge status={rental.paymentStatus || "pending"} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-mono">#{rental.id.slice(0, 8)}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {rental.startDate} - {rental.endDate}
                          </span>
                          <span className="font-medium text-foreground">
                            {rental.totalPrice}€
                          </span>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="gap-2">
                        <Link href={`/mis-alquileres/${rental.id}`}>
                          Ver detalles
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    confirmed: "default",
    active: "default",
    completed: "outline",
    cancelled: "destructive",
  }

  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    active: "Activo",
    completed: "Completado",
    cancelled: "Cancelado",
  }

  return (
    <Badge variant={variants[status] || "secondary"}>
      {labels[status] || status}
    </Badge>
  )
}

function PaymentBadge({ status }: { status: string }) {
  if (status === "paid") {
    return <Badge variant="outline" className="text-green-600 border-green-600">Pagado</Badge>
  }
  return null
}
