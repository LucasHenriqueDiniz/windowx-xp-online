"use client";
import { useDesktop } from "@/context/DesktopContext";
import { getProgramDefinition } from "@/data/program-library";
import { useProgramManager } from "@/hooks/useProgramManager";
import { useEffect, useMemo, useState } from "react";
import ProgramManager from "../Window/ProgramManager";
import DesktopContextMenu from "./DesktopContextMenu";

interface DesktopProps {
  className?: string;
}

export default function Desktop({ className = "" }: DesktopProps) {
  const { iconIds, iconSize, wallpaper, backgroundColor, iconArrangement, wallpaperPosition } = useDesktop();
  const { launchProgram } = useProgramManager();
  const [gridCols, setGridCols] = useState(6);
  const [gridRows, setGridRows] = useState(10);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Determine background style based on wallpaper availability and position
  const backgroundStyle = useMemo(() => {
    if (wallpaper) {
      switch (wallpaperPosition) {
        case "stretch":
          return {
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          };
        case "tile":
          return {
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: "auto",
            backgroundRepeat: "repeat",
            backgroundPosition: "0 0",
          };
        case "center":
        default:
          return {
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: "auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundColor: backgroundColor,
          };
      }
    } else {
      return {
        backgroundColor: backgroundColor,
      };
    }
  }, [wallpaper, backgroundColor, wallpaperPosition]);

  // Adjust grid based on icon size
  useEffect(() => {
    switch (iconSize) {
      case "small":
        setGridCols(8);
        setGridRows(16);
        break;
      case "medium":
        setGridCols(6);
        setGridRows(10);
        break;
      case "large":
        setGridCols(4);
        setGridRows(6);
        break;
    }
  }, [iconSize]);

  // Close context menu on click anywhere
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu.visible]);

  // Handle right-click on desktop
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  // Create a grid with empty cells maintaining Windows XP style grid
  const desktopGrid = useMemo(() => {
    // Create a full grid with all cells initially null
    const grid: Array<Array<string | null>> = Array(gridCols)
      .fill(null)
      .map(() => Array(gridRows).fill(null));

    // Place icons in column-first order (Windows XP style)
    if (iconArrangement === "auto") {
      let col = 0;
      let row = 0;

      iconIds.forEach((iconId) => {
        grid[col][row] = iconId;

        // Move to next position (down first, then right)
        row++;
        if (row >= gridRows) {
          row = 0;
          col++;
          if (col >= gridCols) {
            // Grid is full
            col = 0;
          }
        }
      });
    } else {
      // In normal mode, we still need to show icons according to their order
      // but we won't auto-arrange them
      iconIds.forEach((iconId, index) => {
        const col = Math.floor(index / gridRows);
        const row = index % gridRows;

        if (col < gridCols && row < gridRows) {
          grid[col][row] = iconId;
        }
      });
    }

    return grid;
  }, [iconIds, gridCols, gridRows, iconArrangement]);

  // Handle desktop icon double-click
  const handleIconDoubleClick = (iconId: string) => {
    const iconData = getProgramDefinition(iconId);
    launchProgram(iconData.program, { iconId });
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={backgroundStyle}
      onContextMenu={handleContextMenu}
    >
      {/* Windows XP style desktop grid */}
      <div className="absolute inset-0 grid grid-flow-col auto-cols-min h-full overflow-hidden">
        {desktopGrid.map((column, colIndex) => (
          <div
            key={`col-${colIndex}`}
            className="grid grid-flow-row auto-rows-min"
          >
            {column.map((iconId, rowIndex) => (
              <div
                key={`cell-${colIndex}-${rowIndex}`}
                className="desktop-cell"
              >
                {iconId && (
                  <DesktopIcon
                    icon={getProgramDefinition(iconId)}
                    size={iconSize}
                    onClick={() => handleIconDoubleClick(iconId)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Program Manager - renders all open windows */}
      <ProgramManager />

      {contextMenu.visible && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
}

interface DesktopIconProps {
  icon: {
    id: string;
    name: string;
    icon: string;
    program: string;
  };
  size: "small" | "medium" | "large";
  onClick?: () => void;
}

function DesktopIcon({ icon, size, onClick }: DesktopIconProps) {
  const sizeClasses = {
    small: "w-10 h-10 text-xs",
    medium: "w-14 h-14 text-sm",
    large: "w-18 h-18 text-base",
  };

  const containerSizeClasses = {
    small: "w-16 h-16",
    medium: "w-20 h-20",
    large: "w-24 h-24",
  };

  const labelSizeClasses = {
    small: "text-xs max-w-[70px]",
    medium: "text-sm max-w-[80px]",
    large: "text-base max-w-[90px]",
  };

  // State for selection
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  // Clear selection when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setIsSelected(false);
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center p-1 cursor-pointer ${containerSizeClasses[size]}`}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <div className={`relative ${isSelected ? "desktop-icon-selected" : ""}`}>
        <div
          className={`${sizeClasses[size]} flex items-center justify-center mb-1`}
          style={{
            backgroundImage: `url(${icon.icon})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className={`text-white text-center font-xp text-shadow-xp px-1 truncate ${labelSizeClasses[size]}`}
          style={{
            backgroundColor: isSelected ? "rgba(49, 106, 197, 0.4)" : "transparent",
            borderRadius: "2px",
          }}
        >
          {icon.name}
        </div>
      </div>
    </div>
  );
}
