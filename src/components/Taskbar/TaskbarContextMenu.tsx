"use client";
import { useEffect, useRef } from "react";
import { useProgramManager } from "@/hooks/useProgramManager";

interface TaskbarContextMenuProps {
  x: number;
  y: number;
  isLocked: boolean;
  onToggleLock: () => void;
  onClose: () => void;
}

export default function TaskbarContextMenu({ x, y, isLocked, onToggleLock, onClose }: TaskbarContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { launchProgram } = useProgramManager();

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
    </div>
  );
}
