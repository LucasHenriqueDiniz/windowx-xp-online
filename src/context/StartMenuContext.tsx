"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ProgramDefinition, UserProgramSettings, ProgramsMenuStructure } from "@/types/program-definitions";
import { programLibrary, defaultPinnedPrograms, defaultProgramsMenuStructure } from "@/data/program-library";

interface StartMenuContextProps {
  pinnedPrograms: string[];
  recentPrograms: string[];
  allProgramsStructure: ProgramsMenuStructure;
  addToPinned: (programId: string) => void;
  removeFromPinned: (programId: string) => void;
  addToRecent: (programId: string) => void;
  movePin: (fromIndex: number, toIndex: number) => void;
  getProgramInfo: (programId: string) => ProgramDefinition | undefined;
}

const StartMenuContext = createContext<StartMenuContextProps>({
  pinnedPrograms: [],
  recentPrograms: [],
  allProgramsStructure: defaultProgramsMenuStructure,
  addToPinned: () => {},
  removeFromPinned: () => {},
  addToRecent: () => {},
  movePin: () => {},
  getProgramInfo: () => undefined,
});

export const useStartMenu = () => useContext(StartMenuContext);

export const StartMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pinnedPrograms, setPinnedPrograms] = useState<string[]>(defaultPinnedPrograms);
  const [recentPrograms, setRecentPrograms] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allProgramsStructure, setAllProgramsStructure] = useState<ProgramsMenuStructure>(defaultProgramsMenuStructure);

  // Load user preferences from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userProgramSettings");
    if (savedSettings) {
      const settings: UserProgramSettings = JSON.parse(savedSettings);
      setPinnedPrograms(settings.pinnedPrograms);
      setRecentPrograms(settings.recentPrograms);
    }
  }, []);

  // Save user preferences to localStorage when they change
  useEffect(() => {
    const settings: UserProgramSettings = {
      pinnedPrograms,
      recentPrograms,
    };
    localStorage.setItem("userProgramSettings", JSON.stringify(settings));
  }, [pinnedPrograms, recentPrograms]);

  // Add a program to pinned items
  const addToPinned = (programId: string) => {
    if (!pinnedPrograms.includes(programId)) {
      setPinnedPrograms([...pinnedPrograms, programId]);
    }
  };

  // Remove a program from pinned items
  const removeFromPinned = (programId: string) => {
    setPinnedPrograms(pinnedPrograms.filter((id) => id !== programId));
  };

  // Add a program to recent items
  const addToRecent = (programId: string) => {
    // Remove if already exists to avoid duplicates
    const filtered = recentPrograms.filter((id) => id !== programId);

    // Add to the beginning of the array
    const updated = [programId, ...filtered];

    // Limit to 6 recent items
    setRecentPrograms(updated.slice(0, 6));
  };

  // Move a pinned item from one position to another (drag and drop)
  const movePin = (fromIndex: number, toIndex: number) => {
    const result = [...pinnedPrograms];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    setPinnedPrograms(result);
  };

  // Get program information by ID
  const getProgramInfo = (programId: string): ProgramDefinition | undefined => {
    return programLibrary[programId];
  };

  return (
    <StartMenuContext.Provider
      value={{
        pinnedPrograms,
        recentPrograms,
        allProgramsStructure,
        addToPinned,
        removeFromPinned,
        addToRecent,
        movePin,
        getProgramInfo,
      }}
    >
      {children}
    </StartMenuContext.Provider>
  );
};
