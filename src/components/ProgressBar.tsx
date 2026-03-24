"use client";

const SCREEN_LABELS = ["Arrival", "Story", "Themes", "Anchor", "Triage", "Commit", "Done"];

export function ProgressBar({ screen }: { screen: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-[640px] mx-auto px-6 py-3 flex items-center gap-3">
        <span className="text-xs font-medium text-[#6E6E73] tracking-wide uppercase shrink-0">
          {SCREEN_LABELS[screen]}
        </span>
        <div className="flex-1 flex gap-1">
          {SCREEN_LABELS.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i <= screen ? "#007AFF" : "#E5E7EB",
              }}
            />
          ))}
        </div>
        <span className="text-xs text-[#6E6E73] shrink-0">
          {screen + 1}/7
        </span>
      </div>
    </div>
  );
}
