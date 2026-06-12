'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkCredentials, createSessionToken, COOKIE_NAME, MAX_AGE_SECONDS } from '@/lib/admin-auth'

export async function loginAdmin(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = (formData.get('email') as string | null) ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!checkCredentials(email, password)) {
    return { error: 'Email o contraseña incorrectos' }
  }

  const token = await createSessionToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  })

  redirect('/admin')
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin/login')
}
