import { Resend } from 'resend'

const FROM = 'BeatFrame <noreply@beatframe.rentals>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

// ─── Order confirmation (multi-item) ────────────────────────────────────────

export type OrderItem = {
  name: string
  quantity: number
  days: number
  total: number
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  refCode,
  pickupDate,
  returnDate,
  items,
  totalWithIVA,
}: {
  to: string
  customerName: string
  refCode: string
  pickupDate: string
  returnDate: string
  items: OrderItem[]
  totalWithIVA: number
}) {
  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #222;">${i.name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;text-align:center;white-space:nowrap;">${i.quantity}× · ${i.days}d</td>
          <td style="padding:10px 0;border-bottom:1px solid #222;text-align:right;font-family:monospace;">${i.total.toFixed(2)}€</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="background:#0a0a0a;color:#e5e5e5;font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;">
      <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#666;margin:0 0 32px;">BeatFrame · Alquiler audiovisual · Barcelona</p>

      <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;line-height:1.2;">Reserva confirmada</h1>
      <p style="color:#888;margin:0 0 32px;font-family:monospace;font-size:12px;">Ref. ${refCode}</p>

      <p style="margin:0 0 24px;">Hola ${customerName || 'cliente'},<br>
      Tu pago ha sido procesado con éxito. Aquí tienes el resumen de tu reserva:</p>

      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <thead>
          <tr>
            <th style="text-align:left;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#666;padding-bottom:8px;border-bottom:1px solid #333;">Equipo</th>
            <th style="text-align:center;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#666;padding-bottom:8px;border-bottom:1px solid #333;">Qty · días</th>
            <th style="text-align:right;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#666;padding-bottom:8px;border-bottom:1px solid #333;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 0 0;font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#666;">Total (IVA incl.)</td>
            <td style="padding:12px 0 0;text-align:right;font-family:monospace;font-size:18px;font-weight:700;color:#fff;">${totalWithIVA.toFixed(2)}€</td>
          </tr>
        </tfoot>
      </table>

      <div style="background:#141414;border:1px solid #222;border-radius:4px;padding:16px 20px;margin:0 0 32px;">
        <p style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#666;margin:0 0 12px;">Fechas</p>
        <p style="margin:0;font-size:14px;">📦 <strong>Recogida:</strong> ${pickupDate}</p>
        <p style="margin:8px 0 0;font-size:14px;">🔄 <strong>Devolución:</strong> ${returnDate}</p>
        <p style="margin:16px 0 0;font-size:13px;color:#888;">Dirección: Joan de Àustria 68, Poblenou, Barcelona.<br>Trae tu DNI o NIE para la recogida.</p>
      </div>

      <p style="font-size:13px;color:#888;margin:0 0 24px;">
        Nuestro equipo revisará tu reserva y te contactará para confirmar los detalles logísticos. Si tienes cualquier duda, escríbenos a <a href="mailto:hola@beatframe.rentals" style="color:#d4b483;text-decoration:none;">hola@beatframe.rentals</a>.
      </p>

      <p style="font-family:monospace;font-size:10px;color:#444;margin:0;border-top:1px solid #1a1a1a;padding-top:24px;">
        BeatFrame · Joan de Àustria 68, 08018 Barcelona · beatframe.rentals
      </p>
    </div>
  `

  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Reserva confirmada · ${refCode} · BeatFrame`,
    html,
  })
}

// ─── Status update email (admin → client) ───────────────────────────────────

export async function sendStatusUpdateEmail({
  to,
  customerName,
  refCode,
  newStatus,
  pickupDate,
}: {
  to: string
  customerName: string
  refCode: string
  newStatus: string
  pickupDate: string
}) {
  const statusMessages: Record<string, { subject: string; headline: string; body: string }> = {
    confirmed: {
      subject: `Reserva confirmada · ${refCode}`,
      headline: 'Tu reserva ha sido confirmada',
      body: 'Hemos revisado tu pedido y todo está en orden. Nos pondremos en contacto contigo para cerrar los detalles de la recogida.',
    },
    ready: {
      subject: `Equipo listo para recoger · ${refCode}`,
      headline: '¡Tu equipo está listo!',
      body: `El equipo está preparado y puedes pasar a recogerlo el <strong>${pickupDate}</strong> en Joan de Àustria 68, Poblenou, Barcelona. Recuerda traer tu DNI.`,
    },
    picked: {
      subject: `Equipo recogido · ${refCode}`,
      headline: '¡Que salga todo bien!',
      body: 'Hemos registrado la recogida del equipo. Mucha suerte con tu producción.',
    },
    returned: {
      subject: `Devolución completada · ${refCode}`,
      headline: 'Devolución completada',
      body: 'Hemos recibido el equipo en perfecto estado. ¡Gracias por confiar en BeatFrame!',
    },
  }

  const msg = statusMessages[newStatus]
  if (!msg) return

  const html = `
    <div style="background:#0a0a0a;color:#e5e5e5;font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;">
      <p style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#666;margin:0 0 32px;">BeatFrame · ${refCode}</p>
      <h1 style="font-size:24px;font-weight:700;margin:0 0 16px;">${msg.headline}</h1>
      <p style="color:#aaa;margin:0 0 24px;">Hola ${customerName || 'cliente'},</p>
      <p style="margin:0 0 32px;" >${msg.body}</p>
      <p style="font-family:monospace;font-size:10px;color:#444;margin:0;border-top:1px solid #1a1a1a;padding-top:24px;">
        BeatFrame · Joan de Àustria 68, 08018 Barcelona · beatframe.rentals
      </p>
    </div>
  `

  return getResend().emails.send({
    from: FROM,
    to,
    subject: msg.subject,
    html,
  })
}

// ─── Legacy helpers (kept for backward compat) ──────────────────────────────

export async function sendConfirmationEmail(
  email: string,
  rentalId: string,
  productName: string,
  startDate: string,
  endDate: string
) {
  return sendOrderConfirmationEmail({
    to: email,
    customerName: '',
    refCode: `BF-${rentalId.slice(0, 8).toUpperCase()}`,
    pickupDate: startDate,
    returnDate: endDate,
    items: [{ name: productName, quantity: 1, days: 1, total: 0 }],
    totalWithIVA: 0,
  })
}
