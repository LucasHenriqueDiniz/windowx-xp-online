import React from "react";

export const programComponentMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<unknown>> } = {
  paint: React.lazy(() => import("@/components/Programs/Paint")),
  notepad: React.lazy(() => import("@/components/Programs/Notepad")),
  pinball: React.lazy(() => import("@/components/Programs/Pinball")),
  calculator: React.lazy(() => import("@/components/Programs/Calculator")),
  "internet-explorer": React.lazy(() => import("@/components/Programs/InternetExplorer")),
  "my-computer": React.lazy(() => import("@/components/Programs/MyComputer")),
  minesweeper: React.lazy(() => import("@/components/Programs/Minesweeper")),
};
