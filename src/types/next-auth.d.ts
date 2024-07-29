// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      emailVerified: string | null;
      image: string;
      createdAt: string;
      updatedAt: string;
    } & DefaultSession["user"];
    iat: number;
    exp: number;
    jti: string;
  }

  interface User extends DefaultUser {
    id: number;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
  }
}

declare module "next-auth/react" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    image: string;
    emailVerified: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface Session {
    name: string;
    email: string;
    picture: string;
    sub: string;
    user: User;
    iat: number;
    exp: number;
    jti: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    name: string;
    email: string;
    picture: string;
    sub: string;
    user: User;
    iat: number;
    exp: number;
    jti: string;
  }
}
