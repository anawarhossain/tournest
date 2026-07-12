import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Re-exported for convenience across the app:
// const { data: session, isPending } = useSession();
export const { useSession, signIn, signUp, signOut } = authClient;
