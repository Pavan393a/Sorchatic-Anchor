"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Textarea } from "@/components/ui/textarea";
import { analyzeStoryDump, extractThemes } from "@/app/actions";

const PROMPTS = [
  {
    key: "projects" as const,
    label: "1. Projects & ideas you care about",
    placeholder: "List 3–5 projects or ideas you keep coming back to, even if they're not started yet...",
  },
  {
    key: "proudMoments" as const,
    label: "2. Proud creative moments",
    placeholder: "Describe 1–2 times you made something and felt genuinely proud — what was it, and why did it matter?",
  },
  {
    key: "burnoutMoments" as const,
    label: "3. Burnout moments",
    placeholder: "Describe 1–2 times when creative work felt hollow or pointless. What was happening?",
  },
];

export function ScreenB() {
  const { storyDump, setStoryDump, setAiSummary, setThemes, advance } = useStore();
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ summary: string; questions: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const allFilled = PROMPTS.every((p) => storyDump[p.key].trim().length > 20);

  async function handleReflect() {
    setLoading(true);
    setError(null);
    try {
      const [analysisResult, themesResult] = await Promise.all([
        analyzeStoryDump(storyDump),
        extractThemes(storyDump),
      ]);

      setAiSummary(analysisResult.summary, analysisResult.questions);

      const themesWithIds = themesResult.themes.map((t, i) => ({
        ...t,
        id: t.id || String(i + 1),
      }));
      setThemes(themesWithIds);
      setAiResult(analysisResult);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(`API error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <div className="space-y-3 fade-in-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
            Screen 2 of 7
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F]">
            Give us the raw material.
          </h1>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            Three prompts. Write fast. Don&rsquo;t edit — the pattern shows up in your first words, not your polished ones.
          </p>
        </div>

        <div className="space-y-6">
          {PROMPTS.map((prompt, i) => (
            <div key={prompt.key} className={`space-y-2 fade-in-up fade-in-up-delay-${i + 1}`}>
              <label className="text-[13px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
                {prompt.label}
              </label>
              <Textarea
                value={storyDump[prompt.key]}
                onChange={(e) => setStoryDump({ [prompt.key]: e.target.value })}
                placeholder={prompt.placeholder}
                className="w-full min-h-[120px] text-[15px] leading-relaxed rounded-2xl border-gray-200 focus:border-[#007AFF] bg-[#F5F5F7] placeholder:text-[#B0B0B5] p-4 transition-colors"
                disabled={!!aiResult}
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-[13px] text-[#FF3B30] bg-red-50 rounded-xl p-4">{error}</p>
        )}

        <AnimatePresence>
          {aiResult && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-[#F5F5F7] rounded-2xl p-6"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6E6E73]">
                  Your behavior loop
                </p>
                <p className="text-[15px] text-[#1D1D1F] leading-relaxed">{aiResult.summary}</p>
              </div>

              {aiResult.questions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#6E6E73]">
                    The crack in the loop
                  </p>
                  <ul className="space-y-3">
                    {aiResult.questions.map((q, i) => (
                      <li
                        key={i}
                        className="text-[15px] text-[#1D1D1F] leading-relaxed pl-4 border-l-2 border-[#007AFF]"
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {!aiResult ? (
            <PrimaryButton
              disabled={!allFilled}
              loading={loading}
              onClick={handleReflect}
            >
              Reflect with AI →
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={advance}>
              See Your Themes →
            </PrimaryButton>
          )}
          {!allFilled && !aiResult && (
            <p className="text-center text-[13px] text-[#6E6E73]">
              Fill in all three prompts to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
