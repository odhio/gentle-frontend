import { DefaultSession, JWT } from "next-auth";


declare module "next-auth" {
  // eslint-disable-next-line
  interface Session extends DefaultSession{
    accessToken?: JWT["accessToken"];
    user: {
      name: string;
      email?: string;
      image: string;
      jwt?: string;
      uuid?: string;
    }
    error?: string;
  }
}

declare module "next-auth" {
  // eslint-disable-next-line
  interface User {
    name: string;
    email?: string;
    image: string;
    jwt?: string;
    uuid?: string;
  }
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare module "next-auth" {
  // eslint-disable-next-line
  interface JWT{
    accessToken?: Tokens
    user: DefaultSession["user"];
  }
}

declare module "next-auth" {
  // eslint-disable-next-line
  interface Account{
    accessToken?: Tokens
    refreshToken?: Tokens
  }
}
