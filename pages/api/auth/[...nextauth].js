import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { kv } from '@vercel/kv';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Here you should check the credentials against your Vercel KV storage
        const user = await kv.get(`user:${credentials.username}`);
        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.username, email: user.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});