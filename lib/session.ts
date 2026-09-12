import { randomUUID } from "crypto";
import type { Session } from "@/lib/types";

/*
 * In-memory session store. Nothing persists past a redeploy — that is the
 * intent. Routes record answers and the inferred profile here so a refresh
 * mid-demo can still be reasoned about server-side.
 */
const sessions = new Map<string, Session>();

export function createSession(): Session {
  const session: Session = {
    id: randomUUID(),
    answers: [],
    profile: null,
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}
