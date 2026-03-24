"use server";

import { ask } from "@/lib/openai";
import { StoryDump, Theme, Project } from "@/lib/store";

// ─── Screen B ─────────────────────────────────────────────────────────────────
// Behavioral goal: Surface the PATTERN, not just the content.
// Most stuck creatives don't have an ideas problem — they have a behavior loop.
// Find the loop: what they repeatedly start, why they stop, what fear is running it.

export async function analyzeStoryDump(
  dump: StoryDump
): Promise<{ summary: string; questions: string[] }> {
  const prompt = `A burnt-out creative wrote the following. You are a behavioral pattern analyst.

PROJECTS THEY CARE ABOUT: ${dump.projects}
PROUD MOMENTS: ${dump.proudMoments}
BURNOUT MOMENTS: ${dump.burnoutMoments}

Your job: find the BEHAVIOR LOOP, not the themes.

Step 1 — THE PATTERN: Look for what they repeatedly DO (start things, switch projects, help others instead of themselves, research instead of make). Describe the loop in one sentence using only their words. Start with "You keep..."

Step 2 — THE BELIEF UNDERNEATH: Every repeated behavior is driven by a hidden belief. What belief would make their behavior make perfect sense? Format: "...as if [hidden belief]."

Step 3 — THE CRACK QUESTION: Ask the ONE question that, if answered honestly, would expose the belief as a choice rather than a fact. Not "why do you do this?" — something more specific that they can actually answer right now.

Return JSON only:
{
  "summary": "You keep [their pattern] as if [hidden belief].",
  "questions": ["[the crack question]"]
}`;

  return await ask(prompt) as { summary: string; questions: string[] };
}

// ─── Screen C ─────────────────────────────────────────────────────────────────
// Behavioral goal: Surface identity statements, not topic labels.
// "I am someone who ___" is 10x more motivating than "I like design."
// Identity-based motivation is the most durable driver of behavior change.

export async function extractThemes(
  dump: StoryDump
): Promise<{ themes: { id: string; title: string; quotes: string[] }[] }> {
  const prompt = `A creative wrote this about their work. You are identifying their core identity beliefs.

PROJECTS: ${dump.projects}
PROUD MOMENTS: ${dump.proudMoments}
BURNOUT MOMENTS: ${dump.burnoutMoments}

Find 2-3 IDENTITY STATEMENTS — the beliefs about who they are that their behavior is trying to protect or prove.

Format each as: "I am someone who ___" (complete the sentence).
The statement must explain BOTH why they're proud of their best work AND why they burn out.
It is a single belief that creates both the best and worst of their creative life.

Rules:
- Must be a belief, not a description ("I am someone who needs work to matter" not "I care about quality")
- Must create internal conflict when violated (that conflict IS the burnout)
- Pull 1-2 exact fragments from their text as evidence

Return JSON only:
{
  "themes": [
    { "id": "1", "title": "I am someone who ___", "quotes": ["[exact fragment]", "[exact fragment]"] }
  ]
}`;

  return await ask(prompt) as { themes: { id: string; title: string; quotes: string[] }[] };
}

// ─── Screen D ─────────────────────────────────────────────────────────────────
// Behavioral goal: Use the 5 Whys structure escalating toward the core assumption.
// Q1-2: What they can see (surface behavior)
// Q3: Where avoidance lives (the moment they stop)
// Q4 (AI): The core belief/assumption running the avoidance
// Q5 (AI): The implementation gap — what specifically happens at the decision point

export async function generateAnchorQuestion(
  theme: Theme,
  priorAnswers: string[],
  questionIndex: number
): Promise<{ question: string }> {
  const answeredSoFar = priorAnswers
    .map((a, i) => `Answer ${i + 1}: "${a}"`)
    .join("\n");

  const isQ4 = questionIndex === 3;

  const prompt = `Someone's core identity belief is: "${theme.title}"
Evidence from their writing: ${theme.quotes.join(" / ")}

Their answers so far:
${answeredSoFar}

${isQ4
  ? `This is Question 4. Based on their answers, identify the CORE ASSUMPTION that makes their avoidance feel rational.
     Look for: what they treat as fixed that is actually a choice. What would have to be true about the world for their behavior to make sense?
     Ask: "What are you treating as a fact that is actually just a decision you made?"
     Make it specific to something they actually said.`
  : `This is Question 5. Based on all their answers, find the exact DECISION POINT where their pattern takes over.
     Not a grand question — a tiny, specific moment. "What happens in the 10 minutes after you sit down to work on this?"
     Find the specific trigger → avoidance sequence hiding in their answers.
     Ask about that exact moment.`
}

One sentence. No preamble. Specific, not general.

Return JSON only: { "question": "..." }`;

  return await ask(prompt) as { question: string };
}

// ─── Screen E ─────────────────────────────────────────────────────────────────
// Behavioral goal: Regret minimization + sunk cost detection.
// Jeff Bezos's "regret minimization framework" but applied to creative projects.
// The AI must identify which projects are safe bets vs which is the real thing,
// and call out sunk cost thinking explicitly.

export async function triageProjects(
  projects: Pick<Project, "id" | "name">[],
  theme: Theme
): Promise<{ results: { id: string; verdict: "Pursue" | "Park" | "Kill"; rationale: string }[] }> {
  const prompt = `Someone's core identity belief is: "${theme.title}"
Their words: ${theme.quotes.join(" / ")}

Projects to evaluate:
${projects.map((p) => `- ID: ${p.id}, Name: "${p.name}"`).join("\n")}

Apply the REGRET MINIMIZATION framework + SUNK COST detection:

PURSUE = In 5 years, if they didn't do this, they'd regret it. AND it directly expresses their identity belief.
PARK = Has real value but doesn't engage their identity. Useful someday, not the real thing now.
KILL = This project is safe. They're keeping it alive because it feels productive without risking the real thing. Classic sunk cost or avoidance project.

For KILL verdicts: name what specific fear this project protects them from.
For PURSUE verdicts: name what becomes possible when this is done.
One sentence each. Be specific. This is not encouragement — this is a diagnostic.

Return JSON only:
{ "results": [{ "id": "...", "verdict": "Pursue", "rationale": "..." }] }`;

  return await ask(prompt) as {
    results: { id: string; verdict: "Pursue" | "Park" | "Kill"; rationale: string }[];
  };
}

// ─── Screen F ─────────────────────────────────────────────────────────────────
// Behavioral goal: Implementation intention, not vague commitment.
// Research shows "I will do X" fails. "I will do X at TIME in PLACE when TRIGGER" 
// increases follow-through by 2-3x (Gollwitzer, 1999).
// The action must also be irreversible — something that creates forward momentum.

export async function suggestCommitment(
  projectName: string,
  theme: Theme
): Promise<{ suggestion: string }> {
  const prompt = `Someone committed to: "${projectName}"
Their identity belief: "${theme.title}"
Their words: ${theme.quotes.join(" / ")}

Design an IMPLEMENTATION INTENTION for them — not a vague goal, a behavior contract.

Rules:
1. Format: "I will [specific action] at [specific time] in [specific location]."
2. The action must take under 20 minutes and produce a physical artifact (written words, a sketch, a list — something tangible that exists after)
3. It must be something that, once done, makes NOT continuing feel like the stranger choice
4. No screens. No AI. No research. Only making.
5. It must directly crack the behavior loop in their identity belief — doing it should feel like living proof of who they actually are

Return JSON only: { "suggestion": "I will [action] at [time] in [place]." }`;

  return await ask(prompt) as { suggestion: string };
}
