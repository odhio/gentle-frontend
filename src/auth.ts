import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
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
      if (!user.name || !user.image) return false;
      const body = { name: user.name, image: user.image };
      const res = await oauthMe(body);
      if (res.success) {
        return true;
      }else{
        return false;
      }
    },
    async session({ session, token }:{ session: any, token: any }) {
      token.accessToken
      
      return {
        ...session,
        user: {
          ...session.user,
          uuid: token.uuid,
        },
        accessToken: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        }
      }
    },
    async jwt({ token, user, account }) {
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
  ],
} satisfies NextAuthConfig;


export const { handlers, auth } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
})