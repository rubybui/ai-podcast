import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { AppConfig } from "@/config";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: AppConfig.googleClientId || "",
      clientSecret: AppConfig.googleClientSecret || "",
    }),
  ],
  callbacks: {},
  events: {
    async signIn({ user }) {
      if (!user) return;

      try {
        await fetch(`${AppConfig.apiUrl}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        });
      } catch (error) {
        throw error;
      }
    },
  },
});
