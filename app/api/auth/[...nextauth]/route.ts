import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const demoUsers: Record<string, { id: string; role: string; name: string }> = {
  "admin@school.ug": { id: "1", role: "ADMIN", name: "Admin User" },
  "teacher@school.ug": { id: "2", role: "TEACHER", name: "Teacher User" },
  "accountant@school.ug": { id: "3", role: "ACCOUNTANT", name: "Accountant User" },
  "parent@school.ug": { id: "4", role: "PARENT", name: "Parent User" },
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const demoUser = demoUsers[credentials.email]
        if (demoUser && credentials.password === "password123") {
          return {
            id: demoUser.id,
            email: credentials.email,
            name: demoUser.name,
            role: demoUser.role
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }