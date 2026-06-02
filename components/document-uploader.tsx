"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { addRentalDocument } from "@/app/actions/rentals"
import { Button } from "@/components/ui/button"
import { Upload, X, CheckCircle, Loader2, FileImage } from "lucide-react"

interface DocumentUploaderProps {
  rentalId: string
  documentType: string
}

export function DocumentUploader({ rentalId, documentType }: DocumentUploaderProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setError(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
      setError(null)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("rentalId", rentalId)
        formData.append("documentType", documentType)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Error al subir el archivo")
        }

        const { pathname } = await response.json()

        await addRentalDocument({
          rentalId,
          documentType,
          documentUrl: pathname,
        })
      }

      setUploaded(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir")
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <p className="text-green-600 font-medium">Documento subido correctamente</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*,.pdf"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">
            Arrastra archivos aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG o PDF (máx. 10MB)
          </p>
        </label>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileImage className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <Button onClick={handleUpload} disabled={uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Subir {files.length} archivo{files.length > 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}
    </div>
  )
}
