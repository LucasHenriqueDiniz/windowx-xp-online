/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDesktop } from "@/context/DesktopContext";
import { onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../lib/firebase";

export interface ProgramProps {
  id: string;
  iconId?: string;
  path?: string;
  url?: string;
  [key: string]: any;
}

export function useProgramManager() {
  const { programs, openProgram, closeProgram, focusProgram } = useDesktop();
  const [isListening, setIsListening] = useState(false);

  // Setup Firebase listeners for multiplayer program synchronization
  useEffect(() => {
    if (isListening) return;

    // Listen for global program open/close events
    const globalProgramsRef = ref(database, "system/programs");

    const unsubscribe = onValue(globalProgramsRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const programsData = snapshot.val();

      // Process each program event based on its action
      Object.entries(programsData).forEach(([key, data]: [string, any]) => {
        // Skip if we've already processed this event
        if (data.processed) return;

        switch (data.action) {
          case "open":
            // Don't reopen already open programs
            if (!programs.some((p) => p.globalId === data.programId)) {
              // Make sure props don't contain any undefined values
              const sanitizedProps = Object.entries(data.props || {}).reduce(
                (acc, [key, value]) => {
                  if (value !== undefined) {
                    acc[key] = value;
                  }
                  return acc;
                },
                { globalId: data.programId } as Record<string, any>
              );

              openProgram(data.programType, sanitizedProps);
            }
            break;

          case "close":
            // Find local program with matching globalId
            const programToClose = programs.find((p) => p.globalId === data.programId);
            if (programToClose) {
              closeProgram(programToClose.id);
            }
            break;

          case "focus":
            // Find local program with matching globalId
            const programToFocus = programs.find((p) => p.globalId === data.programId);
            if (programToFocus) {
              focusProgram(programToFocus.id);
            }
            break;
        }

        // Mark as processed so we don't process it again
        const eventRef = ref(database, `system/programs/${key}`);
        set(eventRef, {
          ...data,
          processed: true,
        });
      });
    });

    setIsListening(true);

    return () => unsubscribe();
  }, [programs, openProgram, closeProgram, focusProgram, isListening]);

  // Open a program with proper props validation and Firebase sync
  const launchProgram = (programType: string, props: Partial<ProgramProps> = {}) => {
    // Generate a global program ID
    const globalProgramId = uuidv4();

    // Make sure props don't contain any undefined values
    const sanitizedProps = Object.entries(props).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      { globalId: globalProgramId } as Record<string, any>
    );

    // Add the program event to Firebase for all users
    const programsRef = ref(database, "system/programs");
    push(programsRef, {
      action: "open",
      programType,
      programId: globalProgramId,
      props: sanitizedProps,
      timestamp: Date.now(),
      processed: false,
    });

    return openProgram(programType, sanitizedProps);
  };

  // Close a specific program and sync with Firebase
  const terminateProgram = (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return;

    // Add the close event to Firebase for all users
    const programsRef = ref(database, "system/programs");
    push(programsRef, {
      action: "close",
      programId: program.globalId,
      timestamp: Date.now(),
      processed: false,
    });

    closeProgram(programId);
  };

  // Focus a specific program and sync with Firebase
  const activateProgram = (programId: string) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) return;

    // Add the focus event to Firebase for all users
    const programsRef = ref(database, "system/programs");
    push(programsRef, {
      action: "focus",
      programId: program.globalId,
      timestamp: Date.now(),
      processed: false,
    });

    focusProgram(programId);
  };

  // Find a specific program by type
  const findProgramByType = (programType: string) => {
    return programs.find((program) => program.type === programType);
  };

  // Check if a program of a specific type is open
  const isProgramRunning = (programType: string) => {
    return programs.some((program) => program.type === programType);
  };

  // Get all running instances of a specific program type
  const getProgramInstances = (programType: string) => {
    return programs.filter((program) => program.type === programType);
  };

  return {
    programs,
    launchProgram,
    terminateProgram,
    activateProgram,
    findProgramByType,
    isProgramRunning,
    getProgramInstances,
  };
}
