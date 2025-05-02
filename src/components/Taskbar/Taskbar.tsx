"use client";
import { useDesktop } from "@/context/DesktopContext";
import { ProgramType, useProgramManager } from "@/hooks/useProgramManager";
import { get, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../lib/firebase";
import { start } from "../../../public/assets/audio";
import { Calculator, InternetExplorer, MyComputer, Network, Power, ShowDesktop, Volume } from "../../../public/assets/icons";
import StartMenu from "../StartMenu/StartMenu";

interface TaskbarProps {
  className?: string;
}

export default function Taskbar({ className = "" }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { programs, minimizeAllPrograms } = useDesktop();
  const { launchProgram, activateProgram, terminateProgram } = useProgramManager();

  // Global start menu state (to sync across users)
  const [globalStartMenuOpen, setGlobalStartMenuOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Sync start menu state with Firebase
  useEffect(() => {
    const startMenuRef = ref(database, "system/startMenu");

    // Listen for changes to global start menu state
    const unsubscribe = onValue(startMenuRef, (snapshot) => {
      if (snapshot.exists()) {
        const isOpen = snapshot.val().isOpen;
        setGlobalStartMenuOpen(isOpen);
        setIsStartMenuOpen(isOpen);
      }
    });

    return () => unsubscribe();
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Handle Start button click - sync to all users
  const toggleStartMenu = () => {
    const newState = !isStartMenuOpen;

    // Update local state
    setIsStartMenuOpen(newState);

    // Update Firebase for all users
    const startMenuRef = ref(database, "system/startMenu");
    set(startMenuRef, { isOpen: newState, lastUpdated: Date.now() });

    // Play sound only when opening
    if (newState) {
      const audio = new Audio(start);
      audio.volume = 0.5;
      audio.play().catch((e) => console.error("Error playing start sound:", e));
    }
  };

  // Group programs of the same type
  const groupedPrograms = programs.reduce((acc, program) => {
    if (!acc[program.type]) {
      acc[program.type] = [];
    }
    acc[program.type].push(program);
    return acc;
  }, {} as Record<string, typeof programs>);

  // Handle quick launch clicks
  const handleQuickLaunch = (program: ProgramType) => {
    launchProgram(program);

    // Log the launch for all users to see
    const launchLogRef = ref(database, "system/programLaunches");
    get(launchLogRef).then((snapshot) => {
      const launches = snapshot.exists() ? snapshot.val() : [];
      launches.push({
        program,
        timestamp: Date.now(),
      });

      // Keep only last 10 launches
      if (launches.length > 10) {
        launches.shift();
      }

      set(launchLogRef, launches);
    });
  };

  // Handle show desktop click
  const handleShowDesktop = () => {
    // Minimize all programs - synchronized for all users
    const showDesktopRef = ref(database, "system/showDesktop");
    set(showDesktopRef, { triggered: true, timestamp: Date.now() });
  };

  // Listen for show desktop events
  useEffect(() => {
    const showDesktopRef = ref(database, "system/showDesktop");

    const unsubscribe = onValue(showDesktopRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val().triggered) {
        // Minimize all windows in response to the event
        minimizeAllPrograms();

        // Reset the trigger after processing
        set(showDesktopRef, { triggered: false, timestamp: Date.now() });
      }
    });

    return () => unsubscribe();
  }, [minimizeAllPrograms]);

  return (
    <div
      className={`relative flex items-center justify-between h-10 bg-gradient-to-r from-[#225BDD] to-[#2486DB] text-white ${className} border-t border-[#6CBEFF]`}
    >
      <div className="flex items-center h-full flex-1">
        {/* Start Button - More XP-like */}
        <button
          className={`h-full px-2 flex items-center gap-1 ${
            isStartMenuOpen
              ? "bg-gradient-to-b from-[#5AA5E0] to-[#1668DA] shadow-inner"
              : "bg-gradient-to-b from-[#379834] to-[#298130] hover:from-[#44A700] hover:to-[#318000] shadow"
          } transition-colors rounded-tr-md rounded-br-md border-r border-t border-b border-[#2B592C] ${isStartMenuOpen ? "border-[#225DDF]" : ""}`}
          onClick={toggleStartMenu}
        >
          <img
            src="/assets/icons/start-icon.png"
            alt="Start"
            className="h-6 w-6"
          />
          <span className="font-bold text-white drop-shadow-sm">Start</span>
        </button>

        {/* Separator */}
        <div className="h-full w-px bg-[#0D60BF] mx-1"></div>

        {/* Quick Launch bar - Windows XP style */}
        <div className="flex h-full items-center px-1 mr-2 border-r border-[#0D60BF]">
          <button
            className="p-1 hover:bg-[#55A2DF]/50 rounded flex items-center justify-center"
            onClick={handleShowDesktop}
            title="Show Desktop"
          >
            <img
              src={ShowDesktop.src}
              alt="Show Desktop"
              className="w-4 h-4"
            />
          </button>
          <button
            className="p-1 hover:bg-[#55A2DF]/50 rounded flex items-center justify-center"
            onClick={() => handleQuickLaunch("browser")}
            title="Internet Explorer"
          >
            <img
              src={InternetExplorer.src}
              alt="Internet Explorer"
              className="w-4 h-4"
            />
          </button>
          <button
            className="p-1 hover:bg-[#55A2DF]/50 rounded flex items-center justify-center"
            onClick={() => handleQuickLaunch("explorer")}
            title="My Computer"
          >
            <img
              src={MyComputer.src}
              alt="My Computer"
              className="w-4 h-4"
            />
          </button>
          <button
            className="p-1 hover:bg-[#55A2DF]/50 rounded flex items-center justify-center"
            onClick={() => handleQuickLaunch("calculator")}
            title="Calculator"
          >
            <img
              src={Calculator.src}
              alt="Calculator"
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Task buttons for running applications */}
        <div className="flex h-full px-2 space-x-1 overflow-x-auto flex-1">
          {Object.entries(groupedPrograms).map(([type, programsOfType]) => {
            // For each type, show one button
            const firstProgram = programsOfType[0];
            const isActive = programsOfType.some((p) => p.zIndex === Math.max(...programs.map((prog) => prog.zIndex)));
            const isMinimized = programsOfType.every((p) => p.isMinimized);

            return (
              <button
                key={type}
                className={`h-8 px-2 my-1 flex items-center gap-1 rounded transition-colors min-w-[120px] max-w-[200px] taskbar-button ${
                  isActive
                    ? "bg-gradient-to-b from-[#5AA5E0] to-[#1668DA]"
                    : isMinimized
                    ? "bg-gradient-to-b from-[#549FE0] to-[#3681DA] opacity-70"
                    : "bg-gradient-to-b from-[#4893DE] to-[#2169D5] hover:from-[#549FE0] hover:to-[#3681DA]"
                }`}
                onClick={() => {
                  // If all programs of this type are minimized, restore the first one
                  // Otherwise, focus the first one
                  const programToActivate = programsOfType[0];
                  activateProgram(programToActivate.id);
                }}
              >
                <img
                  src={firstProgram.icon}
                  alt={firstProgram.title}
                  className="h-5 w-5"
                />
                <span className="text-xs font-medium truncate">
                  {programsOfType.length > 1 ? `${firstProgram.title} (${programsOfType.length})` : firstProgram.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* System tray area */}
      <div className="px-2 flex items-center h-full bg-gradient-to-b from-[#2392E5] to-[#0D75CF] border-l border-[#0D60BF]">
        {/* System tray icons */}
        <div className="flex items-center mr-2 system-tray">
          <img
            src={Volume.src}
            alt="Volume"
            className="system-tray-icon"
          />
          <img
            src={Network.src}
            alt="Network"
            className="system-tray-icon"
          />
          <img
            src={Power.src}
            alt="Power"
            className="system-tray-icon"
          />
        </div>
        <span className="text-sm">{formattedTime}</span>
      </div>

      {/* Start Menu (conditionally rendered) */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => {
          // Close locally and globally
          setIsStartMenuOpen(false);
          const startMenuRef = ref(database, "system/startMenu");
          set(startMenuRef, { isOpen: false, lastUpdated: Date.now() });
        }}
      />
    </div>
  );
}
