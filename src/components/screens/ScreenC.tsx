"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Theme } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";

function ThemeCard({
  theme,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(theme.title);

  function commitRename() {
    if (editValue.trim()) onRename(editValue.trim());
    setEditing(false);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.25 }}
      onClick={onSelect}
      className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? "border-[#007AFF] bg-blue-50/50 shadow-md"
          : "border-gray-100 bg-[#F5F5F7] hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className="space-y-3 pr-8">
        {editing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => e.key === "Enter" && commitRename()}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-[17px] font-semibold text-[#1D1D1F] bg-transparent border-b-2 border-[#007AFF] outline-none pb-1 tracking-[-0.01em]"
          />
        ) : (
          <h3 className="text-[17px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
            {theme.title}
          </h3>
        )}

        <ul className="space-y-1.5">
          {theme.quotes.map((quote, i) => (
            <li key={i} className="text-[13px] text-[#6E6E73] italic leading-relaxed pl-3 border-l-2 border-gray-300">
              &ldquo;{quote}&rdquo;
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200/60">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
            setEditValue(theme.title);
          }}
          className="text-[13px] text-[#007AFF] font-medium hover:underline"
        >
          Rename
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-[13px] text-[#FF3B30] font-medium hover:underline"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

export function ScreenC() {
  const { themes, selectedTheme, updateTheme, deleteTheme, setSelectedTheme, advance, setScreen } = useStore();

  const canProceed = selectedTheme !== null && themes.length > 0;

  if (themes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="space-y-2">
            <p className="text-[17px] font-semibold text-[#1D1D1F]">No identity beliefs generated yet</p>
            <p className="text-[15px] text-[#6E6E73] leading-relaxed">
              The AI call on the previous screen didn&apos;t complete. Go back and try again.
            </p>
          </div>
          <button
            onClick={() => setScreen(1)}
            className="w-full py-4 px-6 rounded-2xl border-2 border-[#007AFF] text-[#007AFF] font-semibold text-[15px] hover:bg-blue-50 transition-colors"
          >
            ← Go back to Story Dump
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <div className="space-y-3 fade-in-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
            Screen 3 of 7
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F]">
            Your Core Identity Beliefs
          </h1>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            These are the beliefs driving your behavior — the ones that explain both your best work and your burnout. Rename any that don&rsquo;t land exactly right. Then pick the one that&rsquo;s most true, even if it&rsquo;s uncomfortable.
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme?.id === theme.id}
                onSelect={() => setSelectedTheme(theme)}
                onRename={(title) => updateTheme(theme.id, title)}
                onDelete={() => deleteTheme(theme.id)}
              />
            ))}
          </div>
        </AnimatePresence>

        {selectedTheme && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-2xl p-4 text-[14px] text-[#007AFF] font-medium"
          >
            Primary theme: &ldquo;{selectedTheme.title}&rdquo;
          </motion.div>
        )}

        <PrimaryButton disabled={!canProceed} onClick={advance}>
          Deep Dive on &ldquo;{selectedTheme?.title ?? "Primary Theme"}&rdquo; →
        </PrimaryButton>
      </div>
    </div>
  );
}
