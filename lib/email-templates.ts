import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(email: string, rentalId: string, productName: string, startDate: string, endDate: string) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@beatframe.rentals',
      to: email,
      subject: `Confirmación de alquiler: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Confirmación de tu alquiler</h2>
          <p>Hola,</p>
          <p>Tu alquiler ha sido confirmado exitosamente.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Producto:</strong> ${productName}</p>
            <p><strong>Fecha de inicio:</strong> ${startDate}</p>
            <p><strong>Fecha de fin:</strong> ${endDate}</p>
            <p><strong>ID del alquiler:</strong> ${rentalId}</p>
          </div>
          <p>Por favor, completa los siguientes pasos:</p>
          <ol>
            <li>Sube tu documento de identidad (DNI/Pasaporte)</li>
            <li>Revisa y firma el acuerdo de alquiler</li>
            <li>Realiza el pago si aún no lo has hecho</li>
          </ol>
          <p>
            <a href="${process.env.BETTER_AUTH_URL || 'https://beatframe.rentals'}/mis-alquileres/${rentalId}" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ver detalles del alquiler
            </a>
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Si no realizaste este alquiler, por favor ignora este email.
          </p>
        </div>
      `,
    })
    return result
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    throw error
  }
}

export async function sendPaymentConfirmedEmail(email: string, rentalId: string, productName: string, totalPrice: number) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@beatframe.rentals',
      to: email,
      subject: `Pago confirmado: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Pago confirmado ✓</h2>
          <p>Hola,</p>
          <p>Tu pago ha sido procesado exitosamente.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Producto:</strong> ${productName}</p>
            <p><strong>Monto:</strong> €${totalPrice.toFixed(2)}</p>
            <p><strong>ID del alquiler:</strong> ${rentalId}</p>
          </div>
          <p>Tu alquiler está confirmado. Por favor, completa la carga de documentos y la firma del acuerdo.</p>
          <p>
            <a href="${process.env.BETTER_AUTH_URL || 'https://beatframe.rentals'}/mis-alquileres/${rentalId}" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Continuar con el proceso
            </a>
          </p>
        </div>
      `,
    })
    return result
  } catch (error) {
    console.error('Error sending payment confirmation email:', error)
    throw error
  }
}

export async function sendReminderEmail(email: string, rentalId: string, productName: string, missingDocs: string[]) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@beatframe.rentals',
      to: email,
      subject: `Recordatorio: Completa tu alquiler`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff9800;">Recordatorio: Pasos pendientes</h2>
          <p>Hola,</p>
          <p>Te recordamos que faltan pasos por completar en tu alquiler de <strong>${productName}</strong>.</p>
          <p>Documentos pendientes:</p>
          <ul>
            ${missingDocs.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
          <p>Por favor, completa estos pasos cuanto antes para confirmar tu alquiler.</p>
          <p>
            <a href="${process.env.BETTER_AUTH_URL || 'https://beatframe.rentals'}/mis-alquileres/${rentalId}" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Completar proceso
            </a>
          </p>
        </div>
      `,
    })
    return result
  } catch (error) {
    console.error('Error sending reminder email:', error)
    throw error
  }
}

export async function sendRentalReadyEmail(email: string, rentalId: string, productName: string, pickupDate: string) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@beatframe.rentals',
      to: email,
      subject: `Alquiler listo para recoger: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">¡Alquiler listo! 📦</h2>
          <p>Hola,</p>
          <p>Tu alquiler está completamente procesado y listo para recoger.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Producto:</strong> ${productName}</p>
            <p><strong>Fecha de recogida:</strong> ${pickupDate}</p>
            <p><strong>ID del alquiler:</strong> ${rentalId}</p>
          </div>
          <p>Lugar de recogida: Calle Principal 123, Madrid</p>
          <p>Horario: Lunes a Viernes, 10:00 - 18:00</p>
          <p>Por favor, trae tu documento de identidad al recoger el equipo.</p>
        </div>
      `,
    })
    return result
  } catch (error) {
    console.error('Error sending ready email:', error)
    throw error
  }
}

export async function sendReturnReminderEmail(email: string, rentalId: string, productName: string, returnDate: string) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@beatframe.rentals',
      to: email,
      subject: `Recordatorio: Devolución de ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff9800;">Recordatorio de devolución</h2>
          <p>Hola,</p>
          <p>Te recordamos que tu alquiler de <strong>${productName}</strong> vence el <strong>${returnDate}</strong>.</p>
          <p>Por favor, devuelve el equipo en las mismas condiciones en que lo recibiste.</p>
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Importante:</strong> Los cargos por demora son de €10 por día.</p>
          </div>
          <p>
            <a href="${process.env.BETTER_AUTH_URL || 'https://beatframe.rentals'}/mis-alquileres/${rentalId}" 
               style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ver detalles
            </a>
          </p>
        </div>
      `,
    })
    return result
  } catch (error) {
    console.error('Error sending return reminder email:', error)
    throw error
  }
}
