'use client'

import { products } from '@/lib/products'
import { AdminNav } from '@/components/admin-nav'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useRef } from 'react'

interface ProductImage {
  url: string
  isMain: boolean
}

export default function EditProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const product = products.find(p => p.slug === slug)
  
  // Initialize images from product
  const initialImages: ProductImage[] = product ? [
    { url: product.image, isMain: true },
    ...product.gallery.slice(0, 4).map(url => ({ url, isMain: false }))
  ] : []
  
  const [formData, setFormData] = useState({
    pricePerDay: product?.pricePerDay || 0,
    stock: product?.stock || 0,
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
  })
  
  const [images, setImages] = useState<ProductImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Producto no encontrado</h1>
            <p className="text-muted-foreground mb-4">El producto con slug &quot;{slug}&quot; no existe.</p>
            <Link href="/admin/products" className="text-primary hover:underline">
              Volver a la lista de productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = 5 - images.length
    if (remainingSlots <= 0) {
      alert('Maximo 5 imagenes permitidas')
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    setUploading(true)

    for (const file of filesToUpload) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('productSlug', slug)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const { url } = await response.json()
          setImages(prev => [...prev, { url, isMain: prev.length === 0 }])
        } else {
          const error = await response.json()
          alert(`Error subiendo ${file.name}: ${error.error}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert(`Error subiendo ${file.name}`)
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })))
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    // If removing main image, set next one as main
    const wasMain = imageToRemove.isMain
    
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      if (wasMain && newImages.length > 0) {
        newImages[0].isMain = true
      }
      return newImages
    })

    // Try to delete from blob storage (ignore errors for original images)
    if (imageToRemove.url.includes('blob.vercel-storage.com')) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: imageToRemove.url }),
        })
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const mainImage = images.find(img => img.isMain)?.url || product.image
    const galleryImages = images.filter(img => !img.isMain).map(img => img.url)
    
    // TODO: Guardar en base de datos
    console.log('[v0] Guardando producto:', {
      slug: product.slug,
      changes: formData,
      mainImage,
      gallery: galleryImages
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const mainImage = images.find(img => img.isMain)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/admin/products" className="hover:text-foreground">
                Productos
              </Link>
              <span>/</span>
              <span>{product.category}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>
          <Link 
            href="/admin/products"
            className="text-sm text-muted-foreground hover:text-foreground border border-border px-4 py-2 rounded-lg"
          >
            Volver a lista
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Imagenes del Producto</h2>
                <p className="text-sm text-muted-foreground">Maximo 5 imagenes. Haz clic en una imagen para establecerla como principal.</p>
              </div>
              <span className="text-sm text-muted-foreground">{images.length}/5</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Existing Images */}
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    img.isMain ? 'border-primary' : 'border-border hover:border-muted-foreground'
                  }`}
                  onClick={() => setMainImage(index)}
                >
                  <img 
                    src={img.url} 
                    alt={`Producto ${index + 1}`}
                    className="w-full h-full object-contain bg-secondary"
                  />
                  
                  {/* Main badge */}
                  {img.isMain && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold"
                  >
                    X
                  </button>
                  
                  {/* Click hint */}
                  {!img.isMain && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Clic para principal
                    </div>
                  )}
                </div>
              ))}

              {/* Upload button */}
              {images.length < 5 && (
                <label 
                  className={`aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-xs text-muted-foreground">Subiendo...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-muted-foreground">Agregar</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Preview */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Vista previa</h3>
                {mainImage ? (
                  <img 
                    src={mainImage.url} 
                    alt={product.name}
                    className="w-full aspect-square object-contain bg-secondary rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="text-foreground">{product.categoryLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marca:</span>
                    <span className="text-foreground">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slug:</span>
                    <span className="text-foreground font-mono text-xs">{product.slug}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price & Stock */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Precio y Stock</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Precio por dia (EUR)
                    </label>
                    <input
                      type="number"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData({...formData, pricePerDay: Number(e.target.value)})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Stock disponible
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Descripciones</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Descripcion corta
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={150}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.shortDescription.length}/150 caracteres
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Descripcion completa
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                      rows={5}
                    />
                  </div>
                </div>
              </div>

              {/* Specifications (Read Only) */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Especificaciones</h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.specs.slice(0, 8).map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Para editar especificaciones, contacta al administrador.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between bg-card border border-border rounded-lg p-6">
                <div>
                  {saved && (
                    <span className="text-green-500 text-sm">
                      Cambios guardados correctamente
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/admin/products"
                    className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
