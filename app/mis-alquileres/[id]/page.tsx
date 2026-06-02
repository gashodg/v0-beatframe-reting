import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { getRentalById, getRentalDocuments, getRentalAgreement } from "@/app/actions/rentals"
import { getProductBySlug } from "@/lib/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocumentUploader } from "@/components/document-uploader"
import { SignatureCanvas } from "@/components/signature-canvas"
import Link from "next/link"
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default async function RentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect(`/admin/login?redirect=/mis-alquileres/${id}`)
  }

  const rental = await getRentalById(id)
  if (!rental) {
    notFound()
  }

  const [documents, agreement] = await Promise.all([
    getRentalDocuments(id),
    getRentalAgreement(id),
  ])

  const product = getProductBySlug(rental.productId)
  const hasDNI = documents.some((d) => d.documentType === "dni")
  const isSigned = agreement?.status === "signed"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/mis-alquileres">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Alquiler #{rental.id.slice(0, 8)}
              </h1>
              <p className="text-muted-foreground">
                {product?.name || rental.productId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de la reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 flex-wrap">
                  <StatusBadge status={rental.status} />
                  <PaymentBadge status={rental.paymentStatus || "pending"} />
                </div>
                
                {/* Progress Steps */}
                <div className="mt-6 space-y-4">
                  <ProgressStep
                    title="Pago completado"
                    description="Tu pago ha sido procesado"
                    completed={rental.paymentStatus === "paid"}
                  />
                  <ProgressStep
                    title="DNI subido"
                    description="Sube una foto de tu DNI por ambas caras"
                    completed={hasDNI}
                    action={!hasDNI}
                  />
                  <ProgressStep
                    title="Contrato firmado"
                    description="Firma el contrato de alquiler"
                    completed={isSigned}
                    action={hasDNI && !isSigned}
                  />
                  <ProgressStep
                    title="Listo para recoger"
                    description="Recoge el equipo en la fecha indicada"
                    completed={rental.status === "confirmed" || rental.status === "active"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            {!hasDNI && rental.paymentStatus === "paid" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Subir DNI
                  </CardTitle>
                  <CardDescription>
                    Sube una foto clara de tu DNI por ambas caras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentUploader rentalId={rental.id} documentType="dni" />
                </CardContent>
              </Card>
            )}

            {/* Signature */}
            {hasDNI && !isSigned && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Firmar contrato
                  </CardTitle>
                  <CardDescription>
                    Firma el contrato de alquiler para completar tu reserva
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignatureCanvas rentalId={rental.id} />
                </CardContent>
              </Card>
            )}

            {/* Uploaded Documents */}
            {documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documentos subidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.documentType.toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(doc.uploadedAt).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            doc.status === "approved"
                              ? "default"
                              : doc.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {doc.status === "approved"
                            ? "Aprobado"
                            : doc.status === "rejected"
                            ? "Rechazado"
                            : "En revisión"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Producto</p>
                  <p className="font-medium">{product?.name || rental.productId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cantidad</p>
                  <p className="font-medium">{rental.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fechas</p>
                    <p className="font-medium">
                      {rental.startDate} - {rental.endDate}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{rental.totalPrice}€</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Si tienes alguna duda sobre tu reserva, contacta con nosotros:
                </p>
                <p className="font-medium mt-2">info@beatframe.es</p>
              </CardContent>
            </Card>
          </div>
        </div>
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
  return <Badge variant="secondary">Pago pendiente</Badge>
}

function ProgressStep({
  title,
  description,
  completed,
  action,
}: {
  title: string
  description: string
  completed: boolean
  action?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        {completed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : action ? (
          <AlertCircle className="h-5 w-5 text-yellow-500" />
        ) : (
          <Clock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div>
        <p className={`font-medium ${completed ? "text-foreground" : "text-muted-foreground"}`}>
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
