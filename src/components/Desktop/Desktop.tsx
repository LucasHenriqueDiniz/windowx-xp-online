"use client";
import { useDesktop } from "@/context/DesktopContext";
import { getProgramDefinition } from "@/data/program-library";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import ProgramManager from "../Window/ProgramManager";
import DesktopContextMenu from "./DesktopContextMenu";

// Helper function to check for intersection between two rectangles
const doRectsIntersect = (rect1: DOMRect, rect2: {x: number, y: number, width: number, height: number}) => {
  return !(
    rect2.x > rect1.x + rect1.width ||
    rect2.x + rect2.width < rect1.x ||
    rect2.y > rect1.y + rect1.height ||
    rect2.y + rect2.height < rect1.y
  );
};

interface DesktopProps {
  className?: string;
}

export default function Desktop({ className = "" }: DesktopProps) {
  const {
    iconIds,
    iconSize,
    openProgram,
  } = useDesktop();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    visible: false,
  });

  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const startDragPoint = useRef<{ x: number; y: number } | null>(null);

  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const backgroundStyle = {
    backgroundImage: `url(https://i.imgur.com/Zk6TR5k.jpg)`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      return;
    }
    
    const targetIsIcon = (e.target as HTMLElement).closest('.desktop-icon-container');
    if (targetIsIcon) {
        if (!e.ctrlKey && !e.shiftKey) {
            const iconId = targetIsIcon.getAttribute('data-icon-id');
            if (iconId && !selectedIcons.has(iconId)) {
                setSelectedIcons(new Set([iconId]));
            }
        }
      return;
    }

    e.preventDefault();
    
    if (!e.ctrlKey && !e.shiftKey) {
      setSelectedIcons(new Set());
    }

    startDragPoint.current = { x: e.clientX, y: e.clientY };
    setSelectionBox({
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
      visible: true,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!startDragPoint.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const startX = startDragPoint.current.x;
    const startY = startDragPoint.current.y;

    const newSelectionBox = {
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      width: Math.abs(currentX - startX),
      height: Math.abs(currentY - startY),
      visible: true,
    };
    setSelectionBox(newSelectionBox);
    
    const newSelectedIcons = new Set(e.ctrlKey ? selectedIcons : []);
    Object.keys(iconRefs.current).forEach(iconId => {
      const iconRef = iconRefs.current[iconId];
      if (iconRef) {
        const iconRect = iconRef.getBoundingClientRect();
        if (doRectsIntersect(iconRect, newSelectionBox)) {
          newSelectedIcons.add(iconId);
        }
      }
    });
    setSelectedIcons(newSelectedIcons);
  };

  const handleMouseUp = () => {
    startDragPoint.current = null;
    setSelectionBox(null);
  };
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
      const targetIsIcon = (e.target as HTMLElement).closest('.desktop-icon-container');
      if (!targetIsIcon && desktopRef.current?.contains(e.target as Node)) {
          setSelectedIcons(new Set());
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [contextMenu.visible]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetIsIcon = (e.target as HTMLElement).closest('.desktop-icon-container');
    if (targetIsIcon) return;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  const handleIconDoubleClick = (iconId: string) => {
    const iconData = getProgramDefinition(iconId);
    openProgram(iconData.program, { iconId });
  };
  
  const handleIconClick = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    const newSelectedIcons = new Set(e.ctrlKey ? selectedIcons : []);
    
    if (selectedIcons.has(iconId) && e.ctrlKey) {
        newSelectedIcons.delete(iconId);
    } else {
        newSelectedIcons.add(iconId);
    }
    
    setSelectedIcons(newSelectedIcons);
  }

  return (
    <div
      ref={desktopRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={backgroundStyle}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute inset-0 flex flex-col flex-wrap h-full content-start p-2">
        {iconIds && iconIds.map(iconId => (
          <DesktopIcon
            key={iconId}
            icon={getProgramDefinition(iconId)}
            size={iconSize}
            isSelected={selectedIcons.has(iconId)}
            onClick={(e) => handleIconClick(e, iconId)}
            onDoubleClick={() => handleIconDoubleClick(iconId)}
            setRef={(el) => (iconRefs.current[iconId] = el)}
          />
        ))}
      </div>

      <ProgramManager />

      {contextMenu.visible && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        />
      )}

      {selectionBox && selectionBox.visible && (
        <div
          className="absolute border border-dotted border-white"
          style={{
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
            backgroundColor: "rgba(49, 106, 197, 0.3)",
            zIndex: 100
          }}
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
  isSelected: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

function DesktopIcon({ icon, size, isSelected, onClick, onDoubleClick, setRef }: DesktopIconProps) {
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

    return (
      <div
        ref={setRef}
        data-icon-id={icon.id}
        className={`flex flex-col items-center justify-center p-1 cursor-pointer desktop-icon-container ${containerSizeClasses[size]}`}
        onClick={onClick}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (onDoubleClick) onDoubleClick();
        }}
      >
        <div className={`relative`}>
          <div
            className={`${sizeClasses[size]} flex items-center justify-center mb-1 icon`}
            style={{
              backgroundImage: `url(${icon.icon})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
           {isSelected && <div className="absolute inset-0 bg-blue-500 opacity-50"></div>}
          </div>
          <div
            className={`text-white text-center font-xp text-shadow-xp px-1 truncate ${labelSizeClasses[size]}`}
            style={{
              backgroundColor: isSelected ? "#3169c5" : "transparent",
              borderRadius: "2px",
            }}
          >
            {icon.name}
          </div>
        </div>
      </div>
    );
}