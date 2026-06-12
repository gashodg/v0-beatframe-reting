export const COOKIE_NAME = 'bf_admin_session'
export const MAX_AGE_SECONDS = 8 * 60 * 60 // 8 hours

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'beatframe-insecure-dev-secret-change-in-prod'
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function hexToBuf(hex: string): Uint8Array {
  return new Uint8Array((hex.match(/.{1,2}/g) ?? []).map((b) => parseInt(b, 16)))
}

export async function createSessionToken(): Promise<string> {
  const payload = Date.now().toString()
  const key = await importKey(getSecret())
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${bufToHex(sig)}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dot = token.indexOf('.')
    if (dot === -1) return false
    const payload = token.slice(0, dot)
    const sigHex = token.slice(dot + 1)

    const timestamp = parseInt(payload, 10)
    if (isNaN(timestamp) || Date.now() - timestamp > MAX_AGE_SECONDS * 1000) return false

    const key = await importKey(getSecret())
    return crypto.subtle.verify('HMAC', key, hexToBuf(sigHex), new TextEncoder().encode(payload))
  } catch {
    return false
  }
}

export function checkCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? ''
  const adminPassword = process.env.ADMIN_PASSWORD ?? ''
  if (!adminEmail || !adminPassword) return false
  return email === adminEmail && password === adminPassword
}
