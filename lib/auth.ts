// Placeholder auth — real auth (Better Auth) can be wired here later.
// All guest checkout flows bypass this entirely.
export const auth = {
  api: {
    getSession: async (_opts: { headers: Headers }): Promise<{ user: { id: string; email: string } } | null> => {
      return null
    },
  },
}
