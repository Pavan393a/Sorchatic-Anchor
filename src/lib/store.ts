import { create } from "zustand";

export interface Theme {
  id: string;
  title: string;
  quotes: string[];
}

export interface Project {
  id: string;
  name: string;
  verdict?: "Pursue" | "Park" | "Kill";
  rationale?: string;
}

export interface StoryDump {
  projects: string;
  proudMoments: string;
  burnoutMoments: string;
}

export interface SessionState {
  screen: number;
  frustration: string;
  storyDump: StoryDump;
  aiSummary: string;
  aiQuestions: string[];
  themes: Theme[];
  selectedTheme: Theme | null;
  anchorAnswers: string[];
  projects: Project[];
  commitment: string;
  timebox: "Tonight" | "Tomorrow morning" | null;

  setScreen: (screen: number) => void;
  setFrustration: (v: string) => void;
  setStoryDump: (v: Partial<StoryDump>) => void;
  setAiSummary: (summary: string, questions: string[]) => void;
  setThemes: (themes: Theme[]) => void;
  updateTheme: (id: string, title: string) => void;
  deleteTheme: (id: string) => void;
  setSelectedTheme: (theme: Theme) => void;
  setAnchorAnswer: (index: number, answer: string) => void;
  setProjects: (projects: Project[]) => void;
  updateProjectVerdict: (id: string, verdict: Project["verdict"], rationale: string) => void;
  setCommitment: (v: string) => void;
  setTimebox: (v: SessionState["timebox"]) => void;
  advance: () => void;
}

export const useStore = create<SessionState>((set) => ({
  screen: 0,
  frustration: "",
  storyDump: { projects: "", proudMoments: "", burnoutMoments: "" },
  aiSummary: "",
  aiQuestions: [],
  themes: [],
  selectedTheme: null,
  anchorAnswers: [],
  projects: [],
  commitment: "",
  timebox: null,

  setScreen: (screen) => set({ screen }),
  setFrustration: (frustration) => set({ frustration }),
  setStoryDump: (v) => set((s) => ({ storyDump: { ...s.storyDump, ...v } })),
  setAiSummary: (aiSummary, aiQuestions) => set({ aiSummary, aiQuestions }),
  setThemes: (themes) => set({ themes }),
  updateTheme: (id, title) =>
    set((s) => ({
      themes: s.themes.map((t) => (t.id === id ? { ...t, title } : t)),
    })),
  deleteTheme: (id) =>
    set((s) => ({ themes: s.themes.filter((t) => t.id !== id) })),
  setSelectedTheme: (selectedTheme) => set({ selectedTheme }),
  setAnchorAnswer: (index, answer) =>
    set((s) => {
      const updated = [...s.anchorAnswers];
      updated[index] = answer;
      return { anchorAnswers: updated };
    }),
  setProjects: (projects) => set({ projects }),
  updateProjectVerdict: (id, verdict, rationale) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, verdict, rationale } : p
      ),
    })),
  setCommitment: (commitment) => set({ commitment }),
  setTimebox: (timebox) => set({ timebox }),
  advance: () => set((s) => ({ screen: Math.min(s.screen + 1, 6) })),
}));
