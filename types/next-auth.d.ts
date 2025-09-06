import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      userName?: string | null;
      userId?: string | null;
      xionAddress?: string | null;
      accessToken?: string ;
    };
  }
}
