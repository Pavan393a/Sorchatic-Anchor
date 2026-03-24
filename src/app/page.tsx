import Link from "next/link";

const USE_CASES = [
  {
    persona: "The Developer",
    situation: "12 side projects. None shipped.",
    pattern: "You keep starting new ones to avoid finishing the real one.",
    before: "Context engineering platform, AI workflow library, payments SDK, 9 more...",
    after: "One project. One belief. One physical action — tonight.",
    color: "blue",
  },
  {
    persona: "The Writer",
    situation: "The outline has been open for 2 years.",
    pattern: "You research instead of write. You let AI draft so you don't have to risk the real thing.",
    before: "3 AI-generated drafts you feel nothing about. A notes app with 400 fragments.",
    after: "The sentence you've been avoiding. Written by hand. In 20 minutes.",
    color: "purple",
  },
  {
    persona: "The Designer",
    situation: "Freelance burnout. Every project feels like someone else's.",
    pattern: "You take every client job to feel productive while your personal work sits untouched.",
    before: "A portfolio of work you're proud of on the surface. Nothing that's actually yours.",
    after: "The project that scares you — named, triaged, committed to.",
    color: "green",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Name the loop",
    description: "Not your goals — your pattern. What you keep starting, abandoning, and restarting. The AI reads it like a behavioral analyst.",
  },
  {
    number: "02",
    title: "Face the belief",
    description: "5 questions, one at a time, no skip. The last two are generated from your specific answers — targeting what you kept almost saying.",
  },
  {
    number: "03",
    title: "Kill the noise",
    description: "Every project gets a verdict. Pursue the real thing. Kill the ones you're using to avoid it. The AI names what each one was protecting you from.",
  },
  {
    number: "04",
    title: "Sign the contract",
    description: "Not a goal — an implementation intention. I will [action] at [time] in [place]. Specific enough that avoiding it is a conscious choice.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.02em]">The Socratic Anchor</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[14px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
              My history
            </Link>
            <Link
              href="/session"
              className="text-[14px] font-semibold text-[#007AFF] hover:text-[#0066D6] transition-colors"
            >
              Start session →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-[640px] mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
              Anti-slop workspace
            </p>
            <h1 className="text-[44px] font-semibold leading-[1.1] tracking-[-0.03em]">
              AI that refuses to do the work for you.
            </h1>
          </div>
          <p className="text-[19px] text-[#6E6E73] leading-relaxed">
            You don&rsquo;t have an ideas problem. You have a pattern problem.
            The Socratic Anchor is a 30-minute session that finds your loop,
            cracks the belief running it, and leaves you with one real thing to do — made entirely by you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/session"
              className="inline-flex items-center justify-center bg-[#007AFF] text-white font-semibold text-[15px] px-8 py-4 rounded-2xl hover:bg-[#0066D6] active:bg-[#0055B3] transition-colors"
            >
              Start your session →
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center text-[#007AFF] font-semibold text-[15px] px-8 py-4 rounded-2xl border-2 border-[#007AFF] hover:bg-blue-50 transition-colors"
            >
              See how it works
            </a>
          </div>
          <p className="text-[13px] text-[#6E6E73]">
            No account needed. No AI-generated content. 30 minutes.
          </p>
        </div>
      </section>

      {/* The honest statement */}
      <section className="py-16 px-6 bg-[#F5F5F7]">
        <div className="max-w-[640px] mx-auto">
          <blockquote className="text-[22px] font-medium leading-relaxed tracking-[-0.02em] text-[#1D1D1F]">
            &ldquo;Every AI tool we use promises to make things easier.
            AI writes the first draft. AI suggests the next step.
            AI fills the blank page. And somehow, the blank page anxiety got worse.&rdquo;
          </blockquote>
          <p className="mt-6 text-[15px] text-[#6E6E73]">
            We built the opposite of a generation tool.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6" id="use-cases">
        <div className="max-w-[960px] mx-auto space-y-12">
          <div className="max-w-[640px] space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
              Who it&rsquo;s for
            </p>
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em]">
              If any of these sound like you, you&rsquo;re in the right place.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map((uc) => (
              <div
                key={uc.persona}
                className="rounded-2xl border border-gray-100 bg-white p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold tracking-wide uppercase text-[#6E6E73]">
                    {uc.persona}
                  </p>
                  <p className="text-[18px] font-semibold text-[#1D1D1F] leading-snug">
                    {uc.situation}
                  </p>
                </div>

                <p className="text-[14px] text-[#6E6E73] leading-relaxed italic">
                  &ldquo;{uc.pattern}&rdquo;
                </p>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6E6E73]">
                      Coming in with
                    </p>
                    <p className="text-[13px] text-[#1D1D1F] leading-relaxed">
                      {uc.before}
                    </p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#007AFF]">
                      Leaving with
                    </p>
                    <p className="text-[13px] font-medium text-[#1D1D1F] leading-relaxed">
                      {uc.after}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-[#F5F5F7]" id="how-it-works">
        <div className="max-w-[960px] mx-auto space-y-12">
          <div className="max-w-[640px] space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
              How it works
            </p>
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em]">
              7 screens. 30 minutes. Zero AI-generated content.
            </h2>
            <p className="text-[17px] text-[#6E6E73] leading-relaxed">
              The AI never writes a word for you. Every insight, every decision,
              every word on the final page — you produced it.
              We just made it impossible to stay vague.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="bg-white rounded-2xl p-6 space-y-3 border border-gray-100">
                <p className="text-[28px] font-semibold text-[#007AFF] tracking-[-0.02em]">
                  {step.number}
                </p>
                <p className="text-[17px] font-semibold text-[#1D1D1F]">{step.title}</p>
                <p className="text-[14px] text-[#6E6E73] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the AI is forbidden from doing */}
      <section className="py-24 px-6">
        <div className="max-w-[640px] mx-auto space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
              The constraint is the product
            </p>
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em]">
              What the AI is forbidden from doing
            </h2>
          </div>

          <div className="space-y-3">
            {[
              "Generating creative prose, copy, or ideas for you",
              "Suggesting what your project should be about",
              "Writing anything you could pass off as your own",
              "Completing your sentences or finishing your thoughts",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <span className="text-[#FF3B30] font-bold text-[16px] mt-0.5">✕</span>
                <p className="text-[14px] text-[#1D1D1F]">{item}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              "Read your behavior pattern and name the loop",
              "Surface the belief running your avoidance — in your own words",
              "Ask the question you kept almost answering",
              "Tell you which projects are real and which are hiding spots",
              "Design a commitment specific enough to be a contract",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <span className="text-[#34C759] font-bold text-[16px] mt-0.5">✓</span>
                <p className="text-[14px] text-[#1D1D1F]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#1D1D1F]">
        <div className="max-w-[640px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-[36px] font-semibold leading-tight tracking-[-0.03em] text-white">
              You already know what the real project is.
            </h2>
            <p className="text-[17px] text-[#A1A1A6] leading-relaxed">
              You just haven&rsquo;t been able to say it clearly enough to commit to it.
              That&rsquo;s what the next 30 minutes are for.
            </p>
          </div>
          <Link
            href="/session"
            className="inline-flex items-center justify-center bg-[#007AFF] text-white font-semibold text-[16px] px-10 py-5 rounded-2xl hover:bg-[#0066D6] transition-colors"
          >
            Start your session →
          </Link>
          <p className="text-[13px] text-[#6E6E73]">
            No account. No generation. No shortcuts.
          </p>
        </div>
      </section>

    </div>
  );
}
