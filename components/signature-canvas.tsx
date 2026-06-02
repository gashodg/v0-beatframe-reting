"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signAgreement } from "@/app/actions/rentals"
import { Button } from "@/components/ui/button"
import { Eraser, Check, Loader2 } from "lucide-react"

interface SignatureCanvasProps {
  rentalId: string
}

export function SignatureCanvas({ rentalId }: SignatureCanvasProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Set drawing style
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Fill with white background
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, rect.width, rect.height)
  }, [])

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    setHasSignature(true)
    
    const pos = getPosition(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const pos = getPosition(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, rect.width, rect.height)
    setHasSignature(false)
  }

  const handleSubmit = async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    setSubmitting(true)
    setError(null)

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Failed to create blob"))
        }, "image/png")
      })

      // Upload signature
      const formData = new FormData()
      formData.append("file", blob, "signature.png")
      formData.append("rentalId", rentalId)
      formData.append("documentType", "signature")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir la firma")
      }

      const { pathname } = await response.json()

      // Update agreement
      await signAgreement(rentalId, pathname)

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la firma")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg">
        <Check className="h-5 w-5 text-green-500" />
        <p className="text-green-600 font-medium">Contrato firmado correctamente</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Agreement Text */}
      <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground max-h-40 overflow-y-auto">
        <p className="font-medium text-foreground mb-2">
          Contrato de alquiler de equipo audiovisual
        </p>
        <p className="mb-2">
          Al firmar este contrato, acepto las siguientes condiciones:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Me comprometo a devolver el equipo en las mismas condiciones en que lo recibí.</li>
          <li>Soy responsable de cualquier daño o pérdida del equipo durante el período de alquiler.</li>
          <li>Acepto pagar los cargos adicionales en caso de retraso en la devolución.</li>
          <li>No subarrendaré ni prestaré el equipo a terceros.</li>
          <li>Presentaré mi DNI al recoger el equipo.</li>
        </ul>
      </div>

      {/* Signature Canvas */}
      <div className="border border-border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-40 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Dibuja tu firma arriba usando el ratón o el dedo
      </p>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={clearCanvas}
          disabled={!hasSignature || submitting}
          className="gap-2"
        >
          <Eraser className="h-4 w-4" />
          Borrar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!hasSignature || submitting}
          className="flex-1 gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Firmar contrato
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
