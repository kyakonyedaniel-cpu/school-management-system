import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

interface User {
  id: string
  email: string
  password: string
  name: string
  role: string
}

// Demo users - In production, these come from database
const demoUsers: User[] = [
  { id: "1", email: "admin@school.ug", password: "password123", name: "Admin User", role: "ADMIN" },
  { id: "2", email: "teacher@school.ug", password: "password123", name: "Teacher User", role: "TEACHER" },
  { id: "3", email: "accountant@school.ug", password: "password123", name: "Accountant User", role: "ACCOUNTANT" },
  { id: "4", email: "parent@school.ug", password: "password123", name: "Parent User", role: "PARENT" },
]

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

        // Find user by email (demo)
        const user = demoUsers.find(u => u.email === credentials.email)
        
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
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
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }