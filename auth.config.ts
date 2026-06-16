import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const allowedEmail = process.env.ADMIN_ALLOWED_EMAIL

      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const userEmail = auth?.user?.email
        return !!userEmail && userEmail === allowedEmail
      }

      return true
    },
  },
} satisfies NextAuthConfig
