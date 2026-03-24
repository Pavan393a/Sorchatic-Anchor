"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Textarea } from "@/components/ui/textarea";
import { generateAnchorQuestion } from "@/app/actions";

const HARDCODED_QUESTIONS = [
  "Describe the last time this pattern played out. Not in general — the specific day, what you did, what you avoided. What happened?",
  "What would you have to give up — identity, excuse, or comfort — if this pattern stopped tomorrow?",
  "What's the smallest version of the real thing you could do? The version so small it would feel almost embarrassing to avoid?",
];

const TOTAL_QUESTIONS = 5;

export function ScreenD() {
  const { selectedTheme, anchorAnswers, setAnchorAnswer, advance } = useStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [questions, setQuestions] = useState<string[]>([...HARDCODED_QUESTIONS]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);

  const isLastQuestion = currentQ === TOTAL_QUESTIONS - 1;
  const canNext = currentAnswer.trim().length > 20;

  useEffect(() => {
    if (anchorAnswers[currentQ]) {
      setCurrentAnswer(anchorAnswers[currentQ]);
    } else {
      setCurrentAnswer("");
    }
  }, [currentQ, anchorAnswers]);

  async function handleNext() {
    setAnchorAnswer(currentQ, currentAnswer);

    if (currentQ === TOTAL_QUESTIONS - 1) {
      advance();
      return;
    }

    const nextIndex = currentQ + 1;

    if (nextIndex >= HARDCODED_QUESTIONS.length && !questions[nextIndex]) {
      setLoadingNext(true);
      try {
        const result = await generateAnchorQuestion(
          selectedTheme!,
          [...anchorAnswers.slice(0, currentQ), currentAnswer],
          nextIndex
        );
        setQuestions((prev) => {
          const updated = [...prev];
          updated[nextIndex] = result.question;
          return updated;
        });

        if (nextIndex === 2) {
          setReflection(null);
        }
      } catch {
        setQuestions((prev) => {
          const updated = [...prev];
          updated[nextIndex] = "What would you regret most if this theme stayed unexamined?";
          return updated;
        });
      } finally {
        setLoadingNext(false);
      }
    }

    if (currentQ === 2) {
      setReflection("The next two questions are generated from your specific answers — targeting the assumption underneath your behavior.");
    }

    setCurrentQ(nextIndex);
  }

  if (!selectedTheme) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <p className="text-[15px] text-[#6E6E73] text-center">Select a theme first to begin the anchor questions.</p>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <div className="space-y-3 fade-in-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
            Screen 4 of 7 · The Anchor
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F]">
            Cracking the Belief
          </h1>
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all duration-400"
                style={{
                  backgroundColor:
                    i < currentQ ? "#007AFF" : i === currentQ ? "#007AFF" : "#E5E7EB",
                  opacity: i === currentQ ? 1 : i < currentQ ? 0.5 : 1,
                }}
              />
            ))}
          </div>
          <p className="text-[13px] text-[#6E6E73]">
            Question {currentQ + 1} of {TOTAL_QUESTIONS} · belief: &ldquo;{selectedTheme.title}&rdquo;
          </p>
        </div>

        <AnimatePresence mode="wait">
          {reflection && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-5"
            >
              <p className="text-[13px] font-semibold text-amber-700 uppercase tracking-wide mb-2">Pattern</p>
              <p className="text-[14px] text-amber-800 leading-relaxed">{reflection}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {question ? (
                <p className="text-[20px] font-semibold text-[#1D1D1F] leading-snug tracking-[-0.02em]">
                  {question}
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin" />
                  <p className="text-[15px] text-[#6E6E73]">Generating your next question...</p>
                </div>
              )}

              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Write your answer here. Don't be clever — be honest."
                className="w-full min-h-[140px] text-[15px] leading-relaxed rounded-2xl border-gray-200 focus:border-[#007AFF] bg-[#F5F5F7] placeholder:text-[#B0B0B5] p-5 transition-colors"
                disabled={!question}
              />

              <div className="flex justify-end">
                <span className={`text-[13px] ${currentAnswer.trim().length > 20 ? "text-[#007AFF]" : "text-[#6E6E73]"}`}>
                  {currentAnswer.trim().length} chars
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <PrimaryButton
          disabled={!canNext || loadingNext || !question}
          loading={loadingNext}
          onClick={handleNext}
        >
          {isLastQuestion ? "Complete the Anchor →" : `Next Question (${currentQ + 1}/${TOTAL_QUESTIONS}) →`}
        </PrimaryButton>
      </div>
    </div>
  );
}
