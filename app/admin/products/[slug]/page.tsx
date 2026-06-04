'use client'

import { products, categories } from '@/lib/products'
import { AdminNav } from '@/components/admin-nav'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const product = products.find(p => p.slug === slug)
  
  const [formData, setFormData] = useState({
    pricePerDay: product?.pricePerDay || 0,
    stock: product?.stock || 0,
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
  })
  
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNav />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Producto no encontrado</h1>
            <p className="text-muted-foreground mb-4">El producto con slug "{slug}" no existe.</p>
            <Link href="/admin/products" className="text-primary hover:underline">
              Volver a la lista de productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Simular guardado (en produccion esto iria a la base de datos)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('[v0] Guardando producto:', {
      slug: product.slug,
      changes: formData
    })
    
    setSaving(false)
    setSaved(true)
    
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Preview */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full aspect-square object-contain bg-secondary rounded-lg mb-4"
              />
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destacado:</span>
                  <span className={product.featured ? 'text-green-500' : 'text-muted-foreground'}>
                    {product.featured ? 'Si' : 'No'}
                  </span>
                </div>
              </div>
              
              {/* Gallery */}
              {product.gallery.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Galeria ({product.gallery.length} imagenes)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {product.gallery.slice(0, 6).map((img, i) => (
                      <img 
                        key={i}
                        src={img} 
                        alt={`${product.name} ${i + 1}`}
                        className="w-full aspect-square object-contain bg-secondary rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Precio actual: {product.pricePerDay} EUR/dia
                    </p>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Stock actual: {product.stock} unidades
                    </p>
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
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px]"
                      rows={6}
                    />
                  </div>
                </div>
              </div>

              {/* Specifications (Read Only) */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Especificaciones</h2>
                <div className="grid grid-cols-2 gap-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Para editar especificaciones, contacta al administrador del sistema.
                </p>
              </div>

              {/* Includes (Read Only) */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Incluye en el alquiler</h2>
                <ul className="space-y-1">
                  {product.includes.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
