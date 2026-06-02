import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminWelcomeEmail(email: string, adminName: string) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@beatframe.rentals',
      to: email,
      subject: 'Bienvenido al panel de administración de Beatframe Rentals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Bienvenido, ${adminName}!</h2>
          <p>Tu cuenta de administrador ha sido creada exitosamente.</p>
          <h3>Accede al panel de control:</h3>
          <p>
            <a href="${process.env.BETTER_AUTH_URL || 'https://beatframe.rentals'}/admin" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ir al Panel de Admin
            </a>
          </p>
          <h3>Funcionalidades disponibles:</h3>
          <ul>
            <li>Gestionar productos y precios</li>
            <li>Ver y gestionar alquileres</li>
            <li>Revisar documentos y firmas</li>
            <li>Procesar pagos</li>
            <li>Ver reportes y estadísticas</li>
            <li>Enviar emails a clientes</li>
          </ul>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Si no creaste esta cuenta, por favor contacta al administrador principal.
          </p>
        </div>
      `,
    })
    return result
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}
