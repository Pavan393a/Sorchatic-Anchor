export interface SessionRecord {
  id: string;
  date: string;
  belief: string;
  pursuedProject: string;
  commitment: string;
  timebox: string;
  killedProjects: string[];
  parkedProjects: string[];
  commitmentDone: boolean;
}

const KEY = "socratic_anchor_sessions";

export function saveSession(record: Omit<SessionRecord, "id" | "date" | "commitmentDone">): void {
  if (typeof window === "undefined") return;
  const sessions = loadSessions();
  const newRecord: SessionRecord = {
    ...record,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    commitmentDone: false,
  };
  sessions.unshift(newRecord);
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function loadSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function markCommitmentDone(id: string, done: boolean): void {
  if (typeof window === "undefined") return;
  const sessions = loadSessions().map((s) =>
    s.id === id ? { ...s, commitmentDone: done } : s
  );
  localStorage.setItem(KEY, JSON.stringify(sessions));
}
