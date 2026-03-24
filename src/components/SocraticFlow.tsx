"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { ProgressBar } from "./ProgressBar";
import { ScreenA } from "./screens/ScreenA";
import { ScreenB } from "./screens/ScreenB";
import { ScreenC } from "./screens/ScreenC";
import { ScreenD } from "./screens/ScreenD";
import { ScreenE } from "./screens/ScreenE";
import { ScreenF } from "./screens/ScreenF";
import { ScreenG } from "./screens/ScreenG";

const SCREENS = [ScreenA, ScreenB, ScreenC, ScreenD, ScreenE, ScreenF, ScreenG];

const variants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export function SocraticFlow() {
  const screen = useStore((s) => s.screen);
  const Screen = SCREENS[screen];

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar screen={screen} />
      <main className="pt-16 pb-12 min-h-screen flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 flex flex-col"
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
