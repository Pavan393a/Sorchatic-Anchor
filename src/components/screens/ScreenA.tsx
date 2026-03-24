"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Textarea } from "@/components/ui/textarea";

export function ScreenA() {
  const { frustration, setFrustration, advance } = useStore();
  const [touched, setTouched] = useState(false);

  const isValid = frustration.trim().length >= 50;
  const charCount = frustration.trim().length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[640px] space-y-10">
        <div className="space-y-3 fade-in-up">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#007AFF]">
            Screen 1 of 7
          </p>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1D1D1F]">
            What pattern keeps repeating in your creative life?
          </h1>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed fade-in-up fade-in-up-delay-1">
            Not what you wish would happen. What actually keeps happening — over and over.
          </p>
        </div>

        <div className="space-y-3 fade-in-up fade-in-up-delay-2">
          <Textarea
            value={frustration}
            onChange={(e) => {
              setFrustration(e.target.value);
              if (!touched) setTouched(true);
            }}
            placeholder="I keep starting things and never finishing them. I have 15 half-built projects and none of them feel like mine anymore..."
            className="w-full min-h-[160px] text-[16px] leading-relaxed rounded-2xl border-gray-200 focus:border-[#007AFF] focus:ring-[#007AFF] bg-[#F5F5F7] placeholder:text-[#B0B0B5] resize-none p-5 transition-colors"
            onFocus={() => setTouched(true)}
          />
          <div className="flex justify-between items-center px-1">
            {touched && !isValid ? (
              <p className="text-[13px] text-[#FF3B30]">
                Keep going — {50 - charCount} more characters needed
              </p>
            ) : (
              <span />
            )}
            <p
              className={`text-[13px] transition-colors ${
                isValid ? "text-[#007AFF] font-medium" : "text-[#6E6E73]"
              }`}
            >
              {charCount} / 50 min
            </p>
          </div>
        </div>

        <div className="fade-in-up fade-in-up-delay-3">
          <PrimaryButton
            disabled={!isValid}
            onClick={advance}
          >
            Continue to Story Dump →
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
