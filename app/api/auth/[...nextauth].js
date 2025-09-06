import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
  

    CredentialsProvider({
      id: "xion-abstraction", 
      name: "Abstraction Login",
      credentials: {
        access_token: { label: "Access Token", type: "text" },
        user_id: { label: "User Id", type: "text" },
        refresh_token: { label: "Refresh Token", type: "text", optional: true },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials.access_token) {
            throw new Error("Missing Google credentials");
          }

          const user = {
            user_id: credentials.user_id,
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token,
            
          };
          console.log(user)

          return user; // Will be available in session
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt", // Storing session as a JWT
    maxAge: 6 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token
      if (user) {
        token.accessToken = user.access_token;
        token.id = user.user_id;
        token.username = user.username;
        token.xion_address = user.xion_address
        token.email = user.email
        token.refresh_token = user.refresh_token
      }
      return token;
    },
    async session({ session, token }) {
      // Make token data available in session
      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        userId: token.id,
        xionAddress: token.xion_address,
        username: token.username,
        email: token.email
      };
      return session;
    },
  },
});
