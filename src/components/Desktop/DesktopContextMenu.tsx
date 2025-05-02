"use client";
import { useDesktop } from "@/context/DesktopContext";
import { useProgramManager } from "@/hooks/useProgramManager";
import { useEffect, useRef } from "react";

interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function DesktopContextMenu({ x, y, onClose }: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { setIconSize, iconSize, setIconArrangement, iconArrangement } = useDesktop();
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

  const handleIconSizeChange = (size: "small" | "medium" | "large") => {
    setIconSize(size);
    onClose();
  };

  const handleArrangementChange = (arrangement: "auto" | "normal") => {
    setIconArrangement(arrangement);
    onClose();
  };

  const handleOpenDisplayProperties = () => {
    launchProgram("display-properties");
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-gray-300 shadow-md z-50 min-w-[200px]"
      style={{
        left: x,
        top: y,
        // Ensure menu stays within viewport
        transform: `translate(${x + 200 > window.innerWidth ? "-100%" : "0"}, ${y + 150 > window.innerHeight ? "-100%" : "0"})`,
      }}
    >
      <div className="flex flex-col">
        {/* View submenu */}
        <div className="relative group">
          <button className="p-2 text-left hover:bg-blue-100 w-full flex justify-between items-center context-menu-item">
            <span>View</span>
            <span>▸</span>
          </button>
          <div className="absolute left-full top-0 bg-white border border-gray-300 shadow-md hidden group-hover:block min-w-[180px]">
            <button
              className={`p-2 text-left hover:bg-blue-100 w-full context-menu-item ${iconSize === "large" ? "bg-blue-100" : ""}`}
              onClick={() => handleIconSizeChange("large")}
            >
              Large Icons
            </button>
            <button
              className={`p-2 text-left hover:bg-blue-100 w-full context-menu-item ${iconSize === "medium" ? "bg-blue-100" : ""}`}
              onClick={() => handleIconSizeChange("medium")}
            >
              Medium Icons
            </button>
            <button
              className={`p-2 text-left hover:bg-blue-100 w-full context-menu-item ${iconSize === "small" ? "bg-blue-100" : ""}`}
              onClick={() => handleIconSizeChange("small")}
            >
              Small Icons
            </button>
          </div>
        </div>

        {/* Arrange Icons submenu */}
        <div className="relative group">
          <button className="p-2 text-left hover:bg-blue-100 w-full flex justify-between items-center context-menu-item">
            <span>Arrange Icons By</span>
            <span>▸</span>
          </button>
          <div className="absolute left-full top-0 bg-white border border-gray-300 shadow-md hidden group-hover:block min-w-[180px]">
            <button
              className={`p-2 text-left hover:bg-blue-100 w-full context-menu-item ${iconArrangement === "auto" ? "bg-blue-100" : ""}`}
              onClick={() => handleArrangementChange("auto")}
            >
              Auto Arrange
            </button>
            <button
              className={`p-2 text-left hover:bg-blue-100 w-full context-menu-item ${iconArrangement === "normal" ? "bg-blue-100" : ""}`}
              onClick={() => handleArrangementChange("normal")}
            >
              Align to Grid
            </button>
          </div>
        </div>

        <div className="border-t border-gray-300 my-1"></div>

        <button
          className="p-2 text-left hover:bg-blue-100 context-menu-item"
          onClick={onClose}
        >
          Refresh
        </button>

        <div className="border-t border-gray-300 my-1"></div>

        <button
          className="p-2 text-left hover:bg-blue-100 context-menu-item"
          onClick={handleOpenDisplayProperties}
        >
          Properties
        </button>
      </div>
    </div>
  );
}
