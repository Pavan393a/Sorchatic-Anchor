"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Project } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { triageProjects } from "@/app/actions";

const VERDICT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Pursue: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Park: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Kill: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

function ProjectRow({
  project,
  onNameChange,
  onRemove,
  triaged,
}: {
  project: Project;
  onNameChange: (name: string) => void;
  onRemove: () => void;
  triaged: boolean;
}) {
  const style = project.verdict ? VERDICT_STYLES[project.verdict] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        style ? `${style.bg} ${style.border}` : "border-gray-100 bg-[#F5F5F7]"
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        <input
          value={project.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Project name..."
          disabled={triaged}
          className="flex-1 bg-transparent text-[15px] font-medium text-[#1D1D1F] outline-none placeholder:text-[#B0B0B5]"
        />
        {!triaged && (
          <button
            onClick={onRemove}
            className="text-[#6E6E73] hover:text-[#FF3B30] text-[18px] leading-none transition-colors"
            aria-label="Remove project"
          >
            ×
          </button>
        )}
        {project.verdict && (
          <span
            className={`shrink-0 text-[12px] font-bold tracking-wide uppercase px-3 py-1 rounded-full ${style?.bg} ${style?.text} border ${style?.border}`}
          >
            {project.verdict}
          </span>
        )}
      </div>

      <AnimatePresence>
        {project.rationale && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <p className={`text-[13px] leading-relaxed ${style?.text ?? "text-[#6E6E73]"}`}>
              {project.rationale}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ScreenE() {
  const { selectedTheme, projects, setProjects, updateProjectVerdict, advance } = useStore();
  const [loading, setLoading] = useState(false);
  const [triaged, setTriaged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addProject() {
    if (projects.length >= 5) return;
    const newProject: Project = { id: Date.now().toString(), name: "" };
    setProjects([...projects, newProject]);
  }

  function updateName(id: string, name: string) {
    setProjects(projects.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function removeProject(id: string) {
    setProjects(projects.filter((p) => p.id !== id));
  }

  async function handleTriage() {
    const validProjects = projects.filter((p) => p.name.trim().length > 0);
    if (validProjects.length < 1 || !selectedTheme) return;

    setLoading(true);
    setError(null);
    try {
      const result = await triageProjects(
        validProjects.map((p) => ({ id: p.id, name: p.name })),
        selectedTheme
      );
      result.results.forEach((r) => {
        updateProjectVerdict(r.id, r.verdict, r.rationale);
      });
      setTriaged(true);
    } catch {
      setError("Triage failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  const validCount = projects.filter((p) => p.name.trim().length > 0).length;
  const allDecided = triaged && projects.every((p) => !p.name.trim() || p.verdict);

  if (!selectedTheme) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <p className="text-[15px] text-[#6E6E73] text-center">Complete earlier steps first.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <div className="space-y-3 fade-in-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
            Screen 5 of 7
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F]">
            Kill the Safe Bets
          </h1>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            List every project you're currently holding. Each one gets a verdict against your belief: &ldquo;{selectedTheme.title}&rdquo;. Pursue the real thing. Kill the ones you're using to avoid it.
          </p>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onNameChange={(name) => updateName(project.id, name)}
                onRemove={() => removeProject(project.id)}
                triaged={triaged}
              />
            ))}
          </AnimatePresence>

          {!triaged && projects.length < 5 && (
            <button
              onClick={addProject}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-[14px] text-[#6E6E73] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors font-medium"
            >
              + Add project {projects.length > 0 ? `(${projects.length}/5)` : ""}
            </button>
          )}
        </div>

        {error && (
          <p className="text-[13px] text-[#FF3B30] bg-red-50 rounded-xl p-4">{error}</p>
        )}

        {!triaged ? (
          <PrimaryButton
            disabled={validCount < 1 || loading}
            loading={loading}
            onClick={handleTriage}
          >
            Score Against My Theme →
          </PrimaryButton>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#F5F5F7] rounded-2xl p-4 text-[13px] text-[#6E6E73] leading-relaxed">
              These verdicts are suggestions based on theme alignment — not commands. You decide.
            </div>
            <PrimaryButton disabled={!allDecided} onClick={advance}>
              Confirm & Make My Commitment →
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
