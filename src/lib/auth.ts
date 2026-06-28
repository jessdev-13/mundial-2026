import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          })
        }
        return true
      } catch (error) {
        console.error("SignIn error:", error)
        return true
      }
    },
    async session({ session }) {
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}