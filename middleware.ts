import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const allowedEmail = process.env.ADMIN_ALLOWED_EMAIL

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const userEmail = req.auth?.user?.email
    if (!userEmail || userEmail !== allowedEmail) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
