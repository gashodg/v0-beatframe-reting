## Backend Beatframe Rentals - Guía Completa

Has construido un sistema completo de alquiler de equipo de video con autenticación, pagos, gestión de documentos y email. Aquí está la estructura:

### 1. AUTENTICACIÓN Y BASE DE DATOS

**Archivos creados:**
- `lib/auth.ts` - Configuración de Better Auth
- `lib/auth-client.ts` - Cliente React para auth
- `lib/db/index.ts` - Cliente Drizzle ORM
- `lib/db/schema.ts` - Esquema de BD con tablas de Better Auth + app
- `app/api/auth/[...all]/route.ts` - Montaje de Better Auth

**Tablas en Neon:**
- `user` - Usuarios del sistema (admin y clientes)
- `session` - Sesiones activas
- `account` - Cuentas de oauth (si aplica)
- `verification` - Verificación de email
- `rentals` - Alquileres (relación usuario-producto)
- `rental_documents` - DNI, pasaporte, etc.
- `rental_agreements` - Contratos y firmas
- `product_edits` - Historial de cambios de productos
- `stock_log` - Historial de stock
- `email_logs` - Registro de emails enviados

### 2. ADMIN DASHBOARD

**Rutas admin:**
- `/admin/login` - Login con Better Auth
- `/admin` - Dashboard con estadísticas
- `/admin/rentals` - Ver todos los alquileres
- `/admin/rentals/[id]` - Detalle de alquiler + acciones
- `/admin/products` - Gestionar catálogo
- `/admin/products/[slug]` - Editar precio, nombre, stock
- `/admin/documents` - Ver documentos subidos
- `/admin/emails` - Ver historial de emails
- `/admin/stats` - Estadísticas y reportes

**Componentes:**
- `components/admin/admin-sidebar.tsx` - Navegación admin
- `components/admin/admin-login-form.tsx` - Formulario login
- `components/admin/product-edit-form.tsx` - Editar producto
- `components/admin/rental-status-actions.tsx` - Cambiar estado alquiler

### 3. FLUJO DE ALQUILER PARA CLIENTES

**Rutas cliente:**
- `/checkout` - Carrito de alquiler + Stripe Checkout
- `/checkout/success` - Confirmación post-pago
- `/mis-alquileres` - Ver mis alquileres
- `/mis-alquileres/[id]` - Detalle: subir DNI, firmar, ver estado

**Componentes:**
- `components/rental-checkout.tsx` - Stripe Embedded Checkout
- `components/document-uploader.tsx` - Upload de documentos (privado en Blob)
- `components/signature-canvas.tsx` - Canvas para firmar

### 4. PAGOS CON STRIPE

**Archivos:**
- `lib/stripe.ts` - Cliente Stripe
- `app/actions/stripe.ts` - Server action para crear sesión checkout
- `components/rental-checkout-page.tsx` - Página de checkout
- `app/api/webhook/stripe/route.ts` - Webhook para confirmar pagos

**Flujo:**
1. Usuario selecciona producto y fechas
2. Clic en "Alquilar" → crea sesión Stripe
3. Pago en Stripe → webhook actualiza `paymentStatus: "completed"`
4. Email de confirmación con link a `/mis-alquileres/[id]`

### 5. DOCUMENTOS Y FIRMAS

**Archivos:**
- `app/api/upload/route.ts` - Upload con Vercel Blob (privado)
- `app/api/file/route.ts` - Descarga segura de documentos privados
- `components/document-uploader.tsx` - UI para subir DNI
- `components/signature-canvas.tsx` - Canvas de firma

**Workflow:**
1. Cliente sube DNI → guardado privado en Blob
2. Cliente firma acuerdo → firma guardada en Blob
3. Admin ve todo en `/admin/documents` con links seguros

### 6. EMAIL CON RESEND

**Archivos:**
- `lib/email-templates.ts` - Templates de emails transaccionales
- `lib/admin-emails.ts` - Emails para admin
- `lib/email.ts` - Servicio base de emails

**Emails enviados automáticamente:**
- Confirmación de alquiler
- Confirmación de pago
- Recordatorios de documentos faltantes
- Notificación cuando está listo para recoger
- Recordatorio de devolución

### 7. SERVER ACTIONS

**`app/actions/rentals.ts`:**
- `createRental()` - Crear nuevo alquiler
- `getRentals()` - Ver alquileres del usuario
- `updateRentalStatus()` - Admin cambia estado
- `uploadDocument()` - Subir DNI/documentos
- `signAgreement()` - Firmar acuerdo

**`app/actions/admin.ts`:**
- `updateProductPrice()` - Cambiar precio
- `updateProductStock()` - Cambiar stock
- `updateProductDescription()` - Editar descripción
- `getRentalsList()` - Ver todos los alquileres
- `getSystemStats()` - Estadísticas

### 8. VARIABLES DE ENTORNO NECESARIAS

```
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=generated-with-openssl
BETTER_AUTH_URL=https://tu-dominio.com (opcional)

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (emails)
RESEND_API_KEY=re_...

# Blob (documentos)
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

### 9. FLUJOS PRINCIPALES

#### Flujo de Cliente:
```
Browse productos → Seleccionar + fechas → Checkout (Stripe) 
→ Pago confirmado → Email → Mi alquiler → Subir DNI 
→ Firmar acuerdo → Admin revisa → Listo para recoger 
→ Email de recogida
```

#### Flujo de Admin:
```
Dashboard → Ver alquileres → Click en alquiler 
→ Ver documentos/firma → Cambiar estado (confirmed/ready/picked) 
→ Email automático a cliente
```

#### Gestión de Productos:
```
Admin → Productos → Click producto → Editar precio/stock/descripción 
→ Editar foto → Guardar → Histórico de cambios guardado
```

### 10. PRÓXIMOS PASOS RECOMENDADOS

1. Testear el flujo completo en local con Stripe test keys
2. Configurar dominio real en Vercel
3. Reemplazar BETTER_AUTH_URL cuando tengas dominio
4. Configurar cuenta Stripe Live
5. Reemplazar RESEND_API_KEY con key real (https://resend.com)
6. Agregar más tipos de documentos según necesites
7. Implementar SMS de recordatorios (opcional)
8. Agregar multi-idioma (español/inglés)

### 11. SEGURIDAD

- Todos los documentos se guardan privados en Vercel Blob
- Las queries están scopeadas por userId con Drizzle
- Better Auth maneja las sesiones de forma segura
- Stripe webhook verifica firmas
- No hay precios guardados en cliente

---

**¡Tu backend está listo para deployar a Vercel! Todos los cambios se guardan automáticamente en la BD y se syncan con Git.**
