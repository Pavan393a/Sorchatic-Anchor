"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Textarea } from "@/components/ui/textarea";
import { suggestCommitment } from "@/app/actions";

const TIMEBOX_OPTIONS = ["Tonight", "Tomorrow morning"] as const;

export function ScreenF() {
  const {
    selectedTheme,
    projects,
    commitment,
    timebox,
    setCommitment,
    setTimebox,
    advance,
  } = useStore();

  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggested, setSuggested] = useState(false);

  const pursuedProject = projects.find((p) => p.verdict === "Pursue");
  const projectName = pursuedProject?.name ?? selectedTheme?.title ?? "your project";

  useEffect(() => {
    if (!commitment && selectedTheme && !suggested) {
      setLoadingSuggestion(true);
      setSuggested(true);
      suggestCommitment(projectName, selectedTheme)
        .then((r) => setCommitment(r.suggestion))
        .catch(() => setCommitment(`Outline 3 key ideas for "${projectName}" by hand. No AI.`))
        .finally(() => setLoadingSuggestion(false));
    }
  }, [commitment, selectedTheme, projectName, suggested, setCommitment]);

  const canCommit = commitment.trim().length > 10 && timebox !== null;

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <div className="space-y-3 fade-in-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
            Screen 6 of 7
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F]">
            The Implementation Intention
          </h1>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            Vague goals fail. &ldquo;I will do X at TIME in PLACE&rdquo; increases follow-through 3×. Make it specific. Make it physical. Make it yours.
          </p>
        </div>

        {pursuedProject && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 fade-in-up fade-in-up-delay-1">
            <p className="text-[13px] font-semibold text-green-700 uppercase tracking-wide mb-1">
              Pursuing
            </p>
            <p className="text-[15px] font-semibold text-green-900">{pursuedProject.name}</p>
          </div>
        )}

        <div className="space-y-3 fade-in-up fade-in-up-delay-2">
          <label className="text-[13px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
            Your next action (human-only)
          </label>
          {loadingSuggestion ? (
            <div className="w-full min-h-[120px] rounded-2xl bg-[#F5F5F7] flex items-center justify-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin" />
              <span className="text-[14px] text-[#6E6E73]">Generating a suggestion...</span>
            </div>
          ) : (
            <Textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="What will you do — by hand, no AI — in the next 60 minutes?"
              className="w-full min-h-[120px] text-[15px] leading-relaxed rounded-2xl border-gray-200 focus:border-[#007AFF] bg-[#F5F5F7] placeholder:text-[#B0B0B5] p-5 transition-colors"
            />
          )}
          <p className="text-[12px] text-[#6E6E73] px-1">
            This is pre-filled from your theme. Edit it to make it yours.
          </p>
        </div>

        <div className="space-y-3 fade-in-up fade-in-up-delay-3">
          <label className="text-[13px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
            When will you do it?
          </label>
          <div className="flex gap-3">
            {TIMEBOX_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setTimebox(option)}
                className={`flex-1 py-4 rounded-2xl text-[15px] font-semibold transition-all duration-150 border-2 ${
                  timebox === option
                    ? "border-[#007AFF] bg-blue-50 text-[#007AFF]"
                    : "border-gray-200 bg-[#F5F5F7] text-[#6E6E73] hover:border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <PrimaryButton disabled={!canCommit} onClick={advance}>
          Commit &amp; See My Summary →
        </PrimaryButton>
      </div>
    </div>
  );
}
