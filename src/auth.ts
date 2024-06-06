import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { login } from './features/auth/api/login';
import { oauthMe } from './features/auth/api/oauth-me';
import { HOST_URI } from './config/env';

export const authConfig = {
  secret: process.env.SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn(params) {
      const { user } = params;
      if (user) {
        return true;
      }else{
        return false;
      }
    },
    async session({ session, token}:{ session: any, token: any}) {
      console.log(token);
      
      token.accessToken
      return {
        ...session,
        user: {
          name: session.user.name,
          image: session.user.image,
          department: token.department,
          uuid: token.uuid,
        }
      }
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'microsoft-entra-id') {        
        const headers = { Authorization: `Bearer ${account.access_token}` };
        const res = await fetch('https://graph.microsoft.com/v1.0/me?$select=department', { headers });
        const data = await res.json();
        token.department = data.department; // department = nullでGuestModeかAuthエラー吐くように
      }

      if ( user ) {
        const res = await oauthMe({ name: user.name, image: user.image });
        if (res.success) {
          token.uuid = res.uuid;
        }
      }
      
      token.user = user;
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      console.log('======================================');
      console.log('token', token);
      
      console.log('======================================');
      
      return token;
      
    },
  },
  providers: [
    Credentials({
      credentials: { name: { label: "name", type: "text" } },
      async authorize(credentials: Partial<Record<"name", unknown>>) {
        const res = await login({ name: credentials.name as string });
        if (res.success && res.jwt !== null) {
          return { jwt: res.jwt, uuid: res.uuid, name: res.name, image: res.image };
        } else {
          return null;
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: `${HOST_URI}/api/auth/callback/google`,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar",
        }
      }
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      authorization: {
        params: {
          redirect_uri: `${HOST_URI}/api/auth/callback/microsoft-entra-id`,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email User.Read",
        }
      }
    }),
  ],
} satisfies NextAuthConfig;


export const { handlers, auth } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
})