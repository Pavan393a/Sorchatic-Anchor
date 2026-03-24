"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SessionRecord, loadSessions, markCommitmentDone } from "@/lib/history";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function daysSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function BeliefMirror({ sessions }: { sessions: SessionRecord[] }) {
  const beliefs = sessions.map((s) => s.belief);
  const beliefCount: Record<string, number> = {};
  beliefs.forEach((b) => { beliefCount[b] = (beliefCount[b] ?? 0) + 1; });
  const recurring = Object.entries(beliefCount).filter(([, count]) => count > 1);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#6E6E73]">Belief Mirror</p>
        <p className="text-[17px] font-semibold text-[#1D1D1F]">Are you actually changing?</p>
      </div>

      {recurring.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          <p className="text-[12px] font-semibold tracking-widest uppercase text-amber-700">Pattern alert</p>
          {recurring.map(([belief, count]) => (
            <p key={belief} className="text-[14px] text-amber-900 leading-relaxed">
              &ldquo;{belief}&rdquo; has appeared <strong>{count} times</strong>.
              The work isn&rsquo;t in reflection anymore — it&rsquo;s in following through.
            </p>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s, i) => (
          <div key={s.id} className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-[#007AFF] shrink-0" />
            <div>
              <p className="text-[14px] font-medium text-[#1D1D1F] leading-snug">{s.belief}</p>
              <p className="text-[12px] text-[#6E6E73]">
                Session {sessions.length - i} · {formatDate(s.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommitmentLedger({
  sessions,
  onToggle,
}: {
  sessions: SessionRecord[];
  onToggle: (id: string, done: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#6E6E73]">Commitment Ledger</p>
        <p className="text-[17px] font-semibold text-[#1D1D1F]">Did you actually do it?</p>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`rounded-xl p-4 border transition-colors ${
              s.commitmentDone
                ? "bg-green-50 border-green-200"
                : "bg-[#F5F5F7] border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggle(s.id, !s.commitmentDone)}
                className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                  s.commitmentDone
                    ? "bg-[#34C759] border-[#34C759]"
                    : "border-gray-300 hover:border-[#007AFF]"
                }`}
              >
                {s.commitmentDone && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] leading-relaxed ${s.commitmentDone ? "line-through text-[#6E6E73]" : "text-[#1D1D1F] font-medium"}`}>
                  {s.commitment}
                </p>
                <p className="text-[12px] text-[#6E6E73] mt-1">
                  {s.timebox} · {daysSince(s.date)}
                  {!s.commitmentDone && " · not done yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KillList({ sessions }: { sessions: SessionRecord[] }) {
  const allKilled = sessions.flatMap((s) =>
    s.killedProjects.map((p) => ({ project: p, date: s.date, belief: s.belief }))
  );

  if (allKilled.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#6E6E73]">The Kill List</p>
        <p className="text-[17px] font-semibold text-[#1D1D1F]">
          {allKilled.length} project{allKilled.length !== 1 ? "s" : ""} you chose not to hide behind
        </p>
        <p className="text-[13px] text-[#6E6E73]">
          Every kill is proof you picked the real thing over the safe one.
        </p>
      </div>

      <div className="space-y-2">
        {allKilled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <span className="text-[#FF3B30] font-bold text-[14px]">✕</span>
            <div>
              <p className="text-[14px] text-[#1D1D1F] font-medium">{item.project}</p>
              <p className="text-[12px] text-[#6E6E73]">{formatDate(item.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardClient() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setLoaded(true);
  }, []);

  function handleToggle(id: string, done: boolean) {
    markCommitmentDone(id, done);
    setSessions(loadSessions());
  }

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em] text-[#1D1D1F] hover:text-[#007AFF] transition-colors">
            ← The Socratic Anchor
          </Link>
          <Link
            href="/session"
            className="text-[14px] font-semibold text-[#007AFF] hover:text-[#0066D6] transition-colors"
          >
            New session →
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-[960px] mx-auto space-y-10">

          {/* Header */}
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
              Pattern History
            </p>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
              Are you actually changing?
            </h1>
            <p className="text-[15px] text-[#6E6E73]">
              {sessions.length === 0
                ? "No sessions yet. Complete a session to see your pattern history."
                : `${sessions.length} session${sessions.length !== 1 ? "s" : ""} completed. Here's what the data says about your behavior.`}
            </p>
          </div>

          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4"
            >
              <p className="text-[17px] font-medium text-[#1D1D1F]">No sessions recorded yet</p>
              <p className="text-[15px] text-[#6E6E73]">
                Complete your first session to start tracking whether your behavior is changing.
              </p>
              <Link
                href="/session"
                className="inline-flex items-center justify-center bg-[#007AFF] text-white font-semibold text-[15px] px-8 py-4 rounded-2xl hover:bg-[#0066D6] transition-colors mt-4"
              >
                Start your first session →
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <BeliefMirror sessions={sessions} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <CommitmentLedger sessions={sessions} onToggle={handleToggle} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
                <KillList sessions={sessions} />
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
