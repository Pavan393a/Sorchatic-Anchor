"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { saveSession } from "@/lib/history";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6E6E73]">{label}</p>
      <p className="text-[15px] text-[#1D1D1F] leading-relaxed">{value}</p>
    </div>
  );
}

export function ScreenG() {
  const { selectedTheme, projects, commitment, timebox } = useStore();
  const [copied, setCopied] = useState(false);

  const pursuedProject = projects.find((p) => p.verdict === "Pursue");
  const killedProjects = projects.filter((p) => p.verdict === "Kill");
  const parkedProjects = projects.filter((p) => p.verdict === "Park");

  useEffect(() => {
    if (selectedTheme && commitment) {
      saveSession({
        belief: selectedTheme.title,
        pursuedProject: pursuedProject?.name ?? "—",
        commitment,
        timebox: timebox ?? "—",
        killedProjects: killedProjects.map((p) => p.name),
        parkedProjects: parkedProjects.map((p) => p.name),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summaryText = [
    `THE SOCRATIC ANCHOR — Session Summary`,
    ``,
    `Your Creative Theme: ${selectedTheme?.title ?? "—"}`,
    ``,
    `Pursuing: ${pursuedProject?.name ?? "—"}`,
    parkedProjects.length > 0 ? `Parked: ${parkedProjects.map((p) => p.name).join(", ")}` : null,
    killedProjects.length > 0 ? `Killed: ${killedProjects.map((p) => p.name).join(", ")}` : null,
    ``,
    `Your Commitment: ${commitment}`,
    `When: ${timebox ?? "—"}`,
    ``,
    `— You decided this. You did the work. No AI wrote a word of this. —`,
  ]
    .filter(Boolean)
    .join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 py-8"
        >
          <div className="text-5xl">🔱</div>
          <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.03em] text-[#1D1D1F]">
            You decided.
          </h1>
          <p className="text-[17px] text-[#6E6E73] leading-relaxed max-w-sm mx-auto">
            You named the loop. You found the belief. You chose the real thing over the safe thing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#F5F5F7] rounded-2xl p-6 space-y-6"
        >
          <SummaryRow
            label="Your Creative Theme"
            value={selectedTheme?.title ?? "—"}
          />

          <div className="h-px bg-gray-200" />

          {pursuedProject && (
            <SummaryRow
              label="Pursuing"
              value={pursuedProject.name}
            />
          )}

          {parkedProjects.length > 0 && (
            <SummaryRow
              label="Parked"
              value={parkedProjects.map((p) => p.name).join(", ")}
            />
          )}

          {killedProjects.length > 0 && (
            <SummaryRow
              label="Killed"
              value={killedProjects.map((p) => p.name).join(", ")}
            />
          )}

          <div className="h-px bg-gray-200" />

          <SummaryRow label="Your Commitment" value={commitment} />
          <SummaryRow label="When" value={timebox ?? "—"} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <PrimaryButton onClick={handleCopy}>
            {copied ? "Copied to clipboard ✓" : "Export Summary →"}
          </PrimaryButton>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="text-[13px] font-semibold text-[#007AFF] hover:underline"
            >
              View your pattern history →
            </Link>
            <p className="text-[13px] text-[#6E6E73]">
              Come back when you&rsquo;re stuck again.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
