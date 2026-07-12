import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Use inside Server Components, Server Actions, or API routes where you need
 * the *verified* session (middleware only checks cookie presence, not validity).
 */
export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}
