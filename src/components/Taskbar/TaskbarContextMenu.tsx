/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDesktop } from "@/context/DesktopContext";
import { useProgramManager } from "@/hooks/useProgramManager";
import { useEffect, useRef } from "react";

interface TaskbarContextMenuProps {
  x: number;
  y: number;
  isLocked: boolean;
  programs?: any[];
  programType?: string;
  onToggleLock: () => void;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TaskbarContextMenu({ x, y, isLocked, programs, programType, onToggleLock, onClose }: TaskbarContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { launchProgram } = useProgramManager();
  const { closeProgram, minimizeProgram, maximizeProgram, focusProgram } = useDesktop();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar o áudio
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Open Taskbar Properties (Display Properties in XP)
  const handleOpenProperties = () => {
    launchProgram("display-properties");
    onClose();
  };

  // Handle toggling taskbar lock
  const handleToggleLock = () => {
    onToggleLock();
    onClose();
  };

  // Handle cascade windows
  const handleCascadeWindows = () => {
    // Implementação futura
    onClose();
  };

  // Handle tile windows horizontally
  const handleTileHorizontally = () => {
    // Implementação futura
    onClose();
  };

  // Handle tile windows vertically
  const handleTileVertically = () => {
    // Implementação futura
    onClose();
  };

  // Handle show desktop
  const handleShowDesktop = () => {
    // Esta funcionalidade será implementada no futuro
    // Por enquanto, apenas fecharemos o menu
    onClose();
  };

  // Fechar programa
  const handleCloseProgram = (programId: string) => {
    closeProgram(programId);
    onClose();
  };

  // Minimizar programa
  const handleMinimizeProgram = (programId: string) => {
    minimizeProgram(programId);
    onClose();
  };

  // Maximizar programa
  const handleMaximizeProgram = (programId: string, isMaximized: boolean) => {
    maximizeProgram(programId, !isMaximized);
    onClose();
  };

  // Focar programa
  const handleFocusProgram = (programId: string) => {
    focusProgram(programId);
    onClose();
  };

  // Fechar todas as instâncias do tipo de programa
  const handleCloseAllPrograms = (programs: any[]) => {
    if (programs && programs.length > 0) {
      programs.forEach((program) => {
        closeProgram(program.id);
      });
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-gray-300 shadow-md z-50 min-w-[220px]"
      style={{
        left: x,
        top: y,
        // Ensure menu stays within viewport
        transform: `translate(${x + 220 > window.innerWidth ? "-100%" : "0"}, ${y + 200 > window.innerHeight ? "-100%" : "0"})`,
      }}
    >
      {programs && programs.length > 0 ? (
        // Menu de contexto para programas
        <div className="flex flex-col">
          {programs.length === 1 ? (
            // Opções para um único programa
            <>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={() => handleFocusProgram(programs[0].id)}
              >
                Restaurar
              </button>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={() => handleMinimizeProgram(programs[0].id)}
              >
                Minimizar
              </button>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={() => handleMaximizeProgram(programs[0].id, programs[0].isMaximized || false)}
              >
                {programs[0].isMaximized ? "Restaurar" : "Maximizar"}
              </button>
              <div className="border-t border-gray-300 my-1"></div>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={() => handleCloseProgram(programs[0].id)}
              >
                Fechar
              </button>
            </>
          ) : (
            // Opções para múltiplos programas do mesmo tipo
            <>
              <div className="p-2 text-left font-bold border-b border-gray-300">
                {programs[0].title} ({programs.length})
              </div>
              {programs.map((program) => (
                <button
                  key={program.id}
                  className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                  onClick={() => handleFocusProgram(program.id)}
                >
                  {program.title}
                </button>
              ))}
              <div className="border-t border-gray-300 my-1"></div>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={() => handleCloseAllPrograms(programs)}
              >
                Fechar Todos
              </button>
            </>
          )}
        </div>
      ) : (
        // Menu de contexto padrão da barra de tarefas
        <div className="flex flex-col">
          {/* Toolbars submenu - placeholder for future implementation */}
          <div className="relative group">
            <button className="p-2 text-left hover:bg-blue-100 w-full flex justify-between items-center context-menu-item">
              <span>Toolbars</span>
              <span>▸</span>
            </button>
            <div className="absolute left-full top-0 bg-white border border-gray-300 shadow-md hidden group-hover:block min-w-[180px]">
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={onClose}
              >
                Quick Launch
              </button>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={onClose}
              >
                Address
              </button>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={onClose}
              >
                Links
              </button>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={onClose}
              >
                Desktop
              </button>
              <div className="border-t border-gray-300 my-1"></div>
              <button
                className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
                onClick={onClose}
              >
                New Toolbar...
              </button>
            </div>
          </div>

          {/* Lock/Unlock the Taskbar */}
          <button
            className="p-2 text-left hover:bg-blue-100 w-full flex items-center context-menu-item"
            onClick={handleToggleLock}
          >
            <span className="mr-2">{isLocked ? "✓" : ""}</span>
            <span>Lock the Taskbar</span>
          </button>

          {/* Window arrangement options */}
          <div className="border-t border-gray-300 my-1"></div>
          <button
            className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
            onClick={handleCascadeWindows}
          >
            Cascade Windows
          </button>
          <button
            className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
            onClick={handleTileHorizontally}
          >
            Tile Windows Horizontally
          </button>
          <button
            className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
            onClick={handleTileVertically}
          >
            Tile Windows Vertically
          </button>
          <button
            className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
            onClick={handleShowDesktop}
          >
            Show Desktop
          </button>

          {/* Task Manager */}
          <div className="border-t border-gray-300 my-1"></div>
          <button
            className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
            onClick={onClose}
          >
            Task Manager
          </button>

          {/* Properties */}
          <div className="border-t border-gray-300 my-1"></div>
          <button
            className="p-2 text-left hover:bg-blue-100 w-full context-menu-item"
            onClick={handleOpenProperties}
          >
            Properties
          </button>
        </div>
      )}
    </div>
  );
}
