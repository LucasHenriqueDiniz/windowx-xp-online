"use client";
import { useStartMenu } from "@/context/StartMenuContext";
import { useProgramManager } from "@/hooks/useProgramManager";
import { useEffect, useRef, useState } from "react";
import { uiSounds } from "../../../public/assets/audio";
import { LogOff, ShutDown, Users } from "../../../public/assets/icons";
import { AllProgramsArrow } from "../../../public/assets/start-menu";
import AllProgramsMenu from "./AllProgramsMenu";
import StartMenuItemContextMenu from "./StartMenuItemContextMenu";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { pinnedPrograms, recentPrograms, getProgramInfo, addToPinned, removeFromPinned, addToRecent } = useStartMenu();
  const { launchProgram } = useProgramManager();
  const [allProgramsOpen, setAllProgramsOpen] = useState(false);
  const [allProgramsPosition, setAllProgramsPosition] = useState({ top: 0, left: 0 });
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    programId: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    programId: "",
  });
  const allProgramsButtonRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("User");
  const [draggingProgram, setDraggingProgram] = useState<string | null>(null);

  // Default programs shown in the start menu
  const defaultStartMenuPrograms = ["internet-explorer", "outlook-express", "windows-media-player", "windows-messenger", "notepad", "paint", "minesweeper"];

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
        setAllProgramsOpen(false);
      }
    };

    if (isOpen) {
      // Play start menu sound
      const audio = new Audio(uiSounds.start);
      audio.play().catch((err) => console.log("Audio play error:", err));

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // If not open, don't render anything
  if (!isOpen) return null;

  // Handle program launch
  const handleProgramLaunch = (programId: string) => {
    const program = getProgramInfo(programId);
    if (program) {
      launchProgram(program.program, { programId });
      addToRecent(programId);
      onClose(); // Close menu after launching
      setAllProgramsOpen(false);
    }
  };

  // Handle right-click on a program item
  const handleContextMenu = (event: React.MouseEvent, programId: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      programId,
    });
  };

  // Handle All Programs button click
  const handleAllProgramsClick = () => {
    if (allProgramsButtonRef.current) {
      const rect = allProgramsButtonRef.current.getBoundingClientRect();

      // Calculate menu position more precisely
      // Position to the right of the button (outside the start menu)
      const menuTop = rect.top - 10; // Align slightly above the button top
      const menuLeft = menuRef.current?.getBoundingClientRect().right || 0;

      setAllProgramsPosition({
        top: menuTop,
        left: menuLeft,
      });

      setAllProgramsOpen(!allProgramsOpen);
    }
  };

  // Handle drag start of program item
  const handleDragStart = (event: React.DragEvent, programId: string) => {
    setDraggingProgram(programId);
    event.dataTransfer.setData("text/plain", programId);
    // Use a custom drag image (optional)
    const program = getProgramInfo(programId);
    if (program) {
      const img = new Image();
      img.src = program.icon;
      event.dataTransfer.setDragImage(img, 16, 16);
    }
  };

  // Handle drag over on pinned area
  const handleDragOver = (event: React.DragEvent) => {
    if (draggingProgram) {
      event.preventDefault();
    }
  };

  // Handle drop on pinned area
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const programId = event.dataTransfer.getData("text/plain");
    if (programId && !pinnedPrograms.includes(programId)) {
      addToPinned(programId);
    }
    setDraggingProgram(null);
  };

  // Render a program item in the menu
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderProgramItem = (programId: string, isPinned = false) => {
    const program = getProgramInfo(programId);
    if (!program) return null;

    return (
      <div
        key={program.id}
        className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer"
        onClick={() => handleProgramLaunch(program.id)}
        onContextMenu={(e) => handleContextMenu(e, program.id)}
        draggable
        onDragStart={(e) => handleDragStart(e, program.id)}
        title={program.description}
      >
        <div
          className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${program.icon})` }}
        ></div>
        <span className="text-sm">{program.name}</span>
      </div>
    );
  };

  // Program shortcuts for the right side column
  const renderRightColumnItem = (programId: string, hasSubmenu = false) => {
    const program = getProgramInfo(programId);
    if (!program) return null;

    return (
      <div
        key={program.id}
        className="flex items-center p-1 hover:bg-[#2F71CD] hover:text-white cursor-pointer w-full"
        onClick={() => handleProgramLaunch(program.id)}
        title={program.description}
      >
        <div
          className="w-6 h-6 mr-2 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${program.icon})` }}
        ></div>
        <span className="text-sm">{program.name}</span>
        {hasSubmenu && <span className="ml-auto">▶</span>}
      </div>
    );
  };

  return (
    <>
      <div
        ref={menuRef}
        className="absolute text-black left-0 bottom-10 w-[400px] bg-gradient-to-b from-[#095BDC] to-[#0048CA] rounded-tr-md overflow-hidden shadow-xl flex flex-col z-50"
        style={{
          borderTop: "1px solid #3B9BFF",
          borderRight: "1px solid #3B9BFF",
        }}
      >
        {/* User section */}
        <div className="flex p-2 bg-gradient-to-r from-[#236DE5] to-[#235FDA] h-16">
          <div
            className="w-12 h-12 rounded-full bg-white mr-3 flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: `url(${Users.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="text-white font-bold flex items-center text-lg">{userName}</div>
        </div>

        {/* Menu items section */}
        <div className="flex flex-1">
          {/* Left column - Default programs, Pinned and Recent programs */}
          <div
            className="w-[59%] bg-white p-1 flex flex-col justify-between"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex-1 flex flex-col justify-start">
              {/* Default programs */}
              {defaultStartMenuPrograms.map((programId) => {
                const program = getProgramInfo(programId);
                if (!program) return null;
                return renderProgramItem(programId);
              })}

              {/* Pinned programs section */}
              {pinnedPrograms.length > 0 && (
                <div className="border-t border-gray-200 mt-2 pt-2">{pinnedPrograms.map((programId) => renderProgramItem(programId, true))}</div>
              )}

              {/* Recent programs section - only show if we have space */}
              {recentPrograms.length > 0 && defaultStartMenuPrograms.length + pinnedPrograms.length < 9 && (
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="px-2 py-1 text-xs text-gray-600 font-semibold">Recently Used</div>
                  {recentPrograms.slice(0, Math.min(5, recentPrograms.length)).map((programId) => renderProgramItem(programId))}
                </div>
              )}
            </div>

            {/* All Programs button at the bottom */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div
                ref={allProgramsButtonRef}
                className="flex items-center p-1 hover:bg-[#316AC5] hover:text-white cursor-pointer"
                onClick={handleAllProgramsClick}
              >
                <div
                  className="w-8 h-8 mr-2 bg-center bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url(${AllProgramsArrow ? AllProgramsArrow.src : ""})` }}
                ></div>
                <span className="text-sm font-semibold">All Programs</span>
              </div>
            </div>
          </div>

          {/* Right sidebar - Windows XP style column with My Documents, etc */}
          <div className="w-[41%] bg-[#D3E5FA] p-1 flex flex-col">
            {/* My Documents, My Pictures, etc. */}
            <div className="flex flex-col space-y-1 mb-2">
              {renderRightColumnItem("my-documents")}
              {renderRightColumnItem("my-recent-documents", true)}
              {renderRightColumnItem("my-pictures")}
              {renderRightColumnItem("my-music")}
              {renderRightColumnItem("my-computer")}
            </div>

            {/* Control Panel, etc. */}
            <div className="flex flex-col space-y-1 border-t border-[#A9C5EF] pt-2 mb-2">
              {renderRightColumnItem("control-panel")}
              {renderRightColumnItem("display-properties")}
              {renderRightColumnItem("default-programs")}
              {renderRightColumnItem("network-connections", true)}
              {renderRightColumnItem("printers-faxes")}
            </div>

            {/* Help, Search, Run */}
            <div className="flex flex-col space-y-1 border-t border-[#A9C5EF] pt-2 mt-auto">
              {renderRightColumnItem("help")}
              {renderRightColumnItem("search")}
              {renderRightColumnItem("run")}
            </div>
          </div>
        </div>

        {/* Bottom buttons - Log Off and Turn Off Computer */}
        <div className="bg-[#C4CCE4] flex justify-between items-center p-1">
          <div
            className="flex items-center p-2 hover:bg-[#316AC5] hover:text-white rounded cursor-pointer"
            onClick={() => {
              // Handle log off
              onClose();
            }}
          >
            <div
              className="w-7 h-7 mr-2 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${LogOff.src})` }}
            ></div>
            <span className="text-sm font-bold">Log Off</span>
          </div>

          <div
            className="flex items-center p-2 hover:bg-[#316AC5] hover:text-white rounded cursor-pointer"
            onClick={() => {
              // Handle shut down
              onClose();
            }}
          >
            <div
              className="w-7 h-7 mr-2 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: `url(${ShutDown.src})` }}
            ></div>
            <span className="text-sm font-bold">Turn Off Computer</span>
          </div>
        </div>
      </div>

      {/* All Programs submenu with fixed z-index and absolute positioning */}
      {isOpen && allProgramsOpen && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <AllProgramsMenu
              position={allProgramsPosition}
              onSelectProgram={handleProgramLaunch}
            />
          </div>
        </div>
      )}

      {/* Context menu for right-clicked program */}
      {contextMenu.visible && (
        <StartMenuItemContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          program={getProgramInfo(contextMenu.programId)!}
          isPinned={pinnedPrograms.includes(contextMenu.programId)}
          onPin={() => addToPinned(contextMenu.programId)}
          onUnpin={() => removeFromPinned(contextMenu.programId)}
          onRename={() => {
            // Handle rename (would typically show a rename dialog)
            setContextMenu((prev) => ({ ...prev, visible: false }));
          }}
          onOpen={() => handleProgramLaunch(contextMenu.programId)}
          onProperties={() => {
            // Handle properties (would typically show a properties dialog)
            setContextMenu((prev) => ({ ...prev, visible: false }));
            // Could launch a properties program with the context program as a parameter
            launchProgram("properties", { targetId: contextMenu.programId });
          }}
          onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </>
  );
}
