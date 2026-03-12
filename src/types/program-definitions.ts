import { ProgramDefinition } from "@/types";

export const programDefinitions: { [key: string]: ProgramDefinition } = {
  paint: {
    id: "paint",
    name: "Paint",
    icon: "/assets/windowsIcons/680(16x16).png",
    desktopIcon: "/assets/windowsIcons/680(32x32).png",
    defaultSize: { width: 500, height: 400 },
    isPinned: true,
  },
  notepad: {
    id: "notepad",
    name: "Bloco de Notas",
    icon: "/assets/windowsIcons/327(16x16).png",
    desktopIcon: "/assets/windowsIcons/327(32x32).png",
    defaultSize: { width: 500, height: 400 },
    isPinned: true,
  },
  pinball: {
    id: "pinball",
    name: "3D Pinball",
    icon: "/assets/pinball/Icon_16x16.png",
    desktopIcon: "/assets/pinball/Icon_32x32.png",
    defaultSize: { width: 600, height: 420 },
    isPinned: true,
  },
};

export type ProgramId = keyof typeof programDefinitions;
