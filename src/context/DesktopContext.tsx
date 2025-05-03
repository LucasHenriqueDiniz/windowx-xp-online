"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { database } from "../../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { DefaultWallpaper } from "../../public/assets/wallpapers";
import * as Icons from "../../public/assets/icons";

// Define icon metadata structure
export interface IconMetadata {
  id: string;
  type: string;
}

// Define program data structure
export interface ProgramData {
  id: string;
  globalId?: string; // Added for multiplayer functionality
  type: string;
  title: string;
  icon: string;
  isOpen: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isMaximized?: boolean;
  isMinimized?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
}

// Define the desktop context interface
interface DesktopContextType {
  iconIds: string[];
  iconArrangement: "auto" | "normal";
  iconSize: "small" | "medium" | "large";
  wallpaper: string | null; // Modificado para aceitar null
  wallpaperPosition: "center" | "tile" | "stretch"; // Nova propriedade para a posição do wallpaper
  backgroundColor: string; // Nova propriedade para cor de fundo
  programs: ProgramData[];
  setIconSize: (size: "small" | "medium" | "large") => void;
  setWallpaper: (wallpaperPath: string | null) => void; // Atualizado para aceitar null
  setWallpaperPosition: (position: "center" | "tile" | "stretch") => void; // Nova função
  setBackgroundColor: (color: string) => void; // Nova função para definir cor de fundo
  moveIcon: (iconId: string, newPosition: number) => void;
  setIconArrangement: (arrangement: "auto" | "normal") => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openProgram: (programType: string, props?: Record<string, any>) => string | null;
  closeProgram: (programId: string, persistProps?: boolean) => void;
  showErrorWindow: (message: string) => void;
  focusProgram: (programId: string) => void;
  minimizeProgram: (programId: string) => void;
  minimizeAllPrograms: () => void; // Added for "Show Desktop" functionality
  maximizeProgram: (programId: string, isMaximized: boolean) => void;
  moveProgram: (programId: string, position: { x: number; y: number }) => void;
  resizeProgram: (programId: string, size: { width: number; height: number }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProgramProps: (programId: string, props: Record<string, any>) => void;
}

// Create the context with a default value
const DesktopContext = createContext<DesktopContextType | undefined>(undefined);
// Lista padrão de ícones baseada no program-library.ts
export const defaultIcons = [
  "my-computer",
  "my-documents",
  "recycle-bin",
  "internet-explorer",
  "paint",
  "calculator",
  "notepad",
  "system-restore",
  "my-network",
  "control-panel",
];

// Provider component
export function DesktopProvider({ children }: { children: ReactNode }) {
  // More optimized structure - just store IDs
  const [iconIds, setIconIds] = useState<string[]>([]);
  const [iconSize, setIconSize] = useState<"small" | "medium" | "large">("medium");
  const [wallpaper, setWallpaperState] = useState<string | null>(DefaultWallpaper.src);
  const [wallpaperPosition, setWallpaperPositionState] = useState<"center" | "tile" | "stretch">("center");
  const [backgroundColor, setBackgroundColorState] = useState<string>("#008080"); // Cor padrão do Windows XP (verde azulado)
  const [iconArrangement, setIconArrangementState] = useState<"auto" | "normal">("auto");
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  // Load desktop settings from Firebase
  useEffect(() => {
    const iconsRef = ref(database, "desktop/iconIds");
    const sizeRef = ref(database, "desktop/iconSize");
    const wallpaperRef = ref(database, "desktop/wallpaper");
    const backgroundColorRef = ref(database, "desktop/backgroundColor");
    const arrangementRef = ref(database, "desktop/iconArrangement");
    const programsRef = ref(database, "desktop/programs");

    // Listen for icons
    const iconsUnsubscribe = onValue(iconsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIconIds(data);
      } else {
        // Set default icons if none exist
        set(iconsRef, defaultIcons);
        setIconIds(defaultIcons);
      }
    });

    // Listen for icon size
    const sizeUnsubscribe = onValue(sizeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIconSize(data);
      } else {
        // Initialize with default size if not exists
        set(sizeRef, "medium");
      }
    });

    // Listen for wallpaper
    const wallpaperUnsubscribe = onValue(wallpaperRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== undefined && data !== null) {
        setWallpaperState(data);
      } else {
        // Initialize with default wallpaper if not exists
        set(wallpaperRef, DefaultWallpaper.src);
      }
    });

    // Listen for background color
    const backgroundColorUnsubscribe = onValue(backgroundColorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBackgroundColorState(data);
      } else {
        // Initialize with default background color if not exists
        set(backgroundColorRef, "#008080");
      }
    });

    // Listen for icon arrangement
    const arrangementUnsubscribe = onValue(arrangementRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIconArrangementState(data);
      } else {
        // Initialize with default arrangement if not exists
        set(arrangementRef, "auto");
      }
    });

    // Listen for open programs
    const programsUnsubscribe = onValue(programsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPrograms(data);
      }
    });

    // Cleanup
    return () => {
      iconsUnsubscribe();
      sizeUnsubscribe();
      wallpaperUnsubscribe();
      backgroundColorUnsubscribe();
      arrangementUnsubscribe();
      programsUnsubscribe();
    };
  }, []);

  // Move an icon to a new position
  const moveIcon = (iconId: string, newPosition: number) => {
    if (iconArrangement === "auto") return; // Can't move icons in auto arrangement

    const newOrder = [...iconIds];
    const currentIndex = newOrder.indexOf(iconId);

    if (currentIndex !== -1) {
      // Remove from current position
      newOrder.splice(currentIndex, 1);
      // Insert at new position
      newOrder.splice(newPosition, 0, iconId);

      // Update Firebase
      set(ref(database, "desktop/iconIds"), newOrder);
      setIconIds(newOrder);
    }
  };

  // Update icon size in Firebase
  const handleSetIconSize = (size: "small" | "medium" | "large") => {
    set(ref(database, "desktop/iconSize"), size);
    setIconSize(size);
  };

  // Update wallpaper in Firebase
  const handleSetWallpaper = (wallpaperPath: string | null) => {
    set(ref(database, "desktop/wallpaper"), wallpaperPath);
    setWallpaperState(wallpaperPath);
  };

  // Update wallpaper position in Firebase
  const handleSetWallpaperPosition = (position: "center" | "tile" | "stretch") => {
    set(ref(database, "desktop/wallpaperPosition"), position);
    setWallpaperPositionState(position);
  };

  // Update background color in Firebase
  const handleSetBackgroundColor = (color: string) => {
    set(ref(database, "desktop/backgroundColor"), color);
    setBackgroundColorState(color);
  };

  // Update icon arrangement in Firebase
  const handleSetIconArrangement = (arrangement: "auto" | "normal") => {
    set(ref(database, "desktop/iconArrangement"), arrangement);
    setIconArrangementState(arrangement);
  };

  // Program management functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openProgram = (programType: string, props?: Record<string, any>) => {
    // Limit to 16 windows
    const nonErrorWindows = programs.filter((p) => p.type !== "error-dialog");
    if (nonErrorWindows.length >= 16 && programType !== "error-dialog") {
      showErrorWindow("You have reached the maximum limit of 16 open windows. Please close some windows before opening a new one.");
      return null;
    }

    const programId = `${programType}-${Date.now()}`;

    // Use provided globalId from props if available (for multiplayer sync)
    const globalId = props?.globalId || programId;

    // Get program title and icon based on program type
    let title = "Program";
    let icon = Icons.Folder.src; // Default icon

    switch (programType) {
      case "explorer":
        title =
          props?.iconId === "my-computer"
            ? "My Computer"
            : props?.iconId === "my-documents"
            ? "My Documents"
            : props?.iconId === "my-network"
            ? "My Network Places"
            : "Explorer";
        icon = `/assets/icons/${title}.png`;
        break;
      case "browser":
        title = "Internet Explorer";
        icon = Icons.InternetExplorer.src;
        break;
      case "notepad":
        title = "Notepad";
        icon = Icons.Notepad.src;
        break;
      case "calculator":
        title = "Calculator";
        icon = Icons.Calculator.src;
        break;
      case "control-panel":
        title = "Control Panel";
        icon = Icons.ControlPanel.src;
        break;
      case "display-properties":
        title = "Display Properties";
        icon = Icons.Display.src;
        break;
      case "error-dialog":
        title = "System Error";
        icon = Icons.ErrorDialog.src;
        break;
      case "system-restore":
        title = "System Restore";
        icon = Icons.SystemRestore.src;
        break;
    }

    const newProgram: ProgramData = {
      id: programId,
      globalId, // Store the global ID for multiplayer sync
      type: programType,
      title,
      icon,
      isOpen: true,
      zIndex: nextZIndex,
      position: { x: 50 + programs.length * 20, y: 50 + programs.length * 20 },
      size: { width: 640, height: 480 },
      isMaximized: false,
      isMinimized: false,
      props,
    };

    const updatedPrograms = [...programs, newProgram];
    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
    setNextZIndex(nextZIndex + 1);

    return programId;
  };

  const closeProgram = (programId: string, persistProps: boolean = false) => {
    const updatedPrograms = programs.filter((program) => program.id !== programId);

    // If not persisting props and the program is being reopened, reset its props
    if (!persistProps) {
      const programToClose = programs.find((program) => program.id === programId);
      if (programToClose) {
        // Save the program type for potential reopening
        const programType = programToClose.type;
        // const globalId = programToClose.globalId;

        // Get the remaining programs of this type
        const remainingPrograms = programs.filter((p) => p.type === programType && p.id !== programId);

        // Update those programs to clear their props
        // (except for global ID and essential props needed for the program to function)
        remainingPrograms.forEach((p) => {
          const essentialProps = { globalId: p.props?.globalId };
          const updatedProgram = { ...p, props: essentialProps };
          const index = updatedPrograms.findIndex((up) => up.id === p.id);
          if (index !== -1) {
            updatedPrograms[index] = updatedProgram;
          }
        });
      }
    }

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  // Add error window function
  const showErrorWindow = (message: string) => {
    // Don't create duplicate error windows if one is already open
    const existingErrorWindow = programs.find((p) => p.type === "error-dialog");
    if (existingErrorWindow) {
      // Update the existing error message
      const updatedPrograms = programs.map((p) => {
        if (p.id === existingErrorWindow.id) {
          return { ...p, props: { ...p.props, message } };
        }
        return p;
      });
      set(ref(database, "desktop/programs"), updatedPrograms);
      setPrograms(updatedPrograms);
      focusProgram(existingErrorWindow.id);
      return;
    }

    // Create a new error window
    openProgram("error-dialog", { message, persistProps: true });
  };

  const focusProgram = (programId: string) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id === programId) {
        return { ...program, zIndex: nextZIndex, isMinimized: false };
      }
      return program;
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
    setNextZIndex(nextZIndex + 1);
  };

  const minimizeProgram = (programId: string) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id === programId) {
        return { ...program, isMinimized: !program.isMinimized };
      }
      return program;
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  const minimizeAllPrograms = () => {
    const updatedPrograms = programs.map((program) => {
      return { ...program, isMinimized: true };
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  const maximizeProgram = (programId: string, isMaximized: boolean) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id === programId) {
        return { ...program, isMaximized };
      }
      return program;
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  const moveProgram = (programId: string, position: { x: number; y: number }) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id === programId) {
        return { ...program, position };
      }
      return program;
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  const resizeProgram = (programId: string, size: { width: number; height: number }) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id === programId) {
        return { ...program, size };
      }
      return program;
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  // Update program-specific properties (for synchronizing states like previews)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateProgramProps = (programId: string, newProps: Record<string, any>) => {
    const updatedPrograms = programs.map((program) => {
      if (program.id === programId) {
        return {
          ...program,
          props: {
            ...program.props,
            ...newProps,
          },
        };
      }
      return program;
    });

    set(ref(database, "desktop/programs"), updatedPrograms);
    setPrograms(updatedPrograms);
  };

  return (
    <DesktopContext.Provider
      value={{
        iconIds,
        iconSize,
        wallpaper,
        wallpaperPosition,
        backgroundColor,
        iconArrangement,
        programs,
        setIconSize: handleSetIconSize,
        setWallpaper: handleSetWallpaper,
        setWallpaperPosition: handleSetWallpaperPosition,
        setBackgroundColor: handleSetBackgroundColor,
        moveIcon,
        setIconArrangement: handleSetIconArrangement,
        openProgram,
        closeProgram,
        showErrorWindow,
        focusProgram,
        minimizeProgram,
        minimizeAllPrograms,
        maximizeProgram,
        moveProgram,
        resizeProgram,
        updateProgramProps,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

// Hook to use the desktop context
export function useDesktop() {
  const context = useContext(DesktopContext);
  if (context === undefined) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
}
