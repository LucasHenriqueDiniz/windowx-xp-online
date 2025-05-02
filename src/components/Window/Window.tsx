"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { useDesktop } from "@/context/DesktopContext";

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  isActive?: boolean;
  isMaximized?: boolean;
  isMinimized?: boolean;
  zIndex?: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  onClose?: () => void;
  resizable?: boolean;
}

export default function Window({
  id,
  title,
  icon,
  children,
  isActive = true,
  isMaximized = false,
  isMinimized = false,
  zIndex = 10,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 640, height: 480 },
  minWidth = 200,
  minHeight = 150,
  onClose,
  resizable = true,
}: WindowProps) {
  const { closeProgram, focusProgram, minimizeProgram, maximizeProgram, moveProgram, resizeProgram } = useDesktop();
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeProgram(id);
    }
  };

  const handleFocus = () => {
    if (!isActive) {
      focusProgram(id);
    }
  };

  const handleMinimize = () => {
    minimizeProgram(id);
  };

  const handleMaximize = () => {
    maximizeProgram(id, !isMaximized);
  };

  // Set up window drag functionality
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Set up window resize functionality
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMaximized || !resizable) return;

    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragOffset({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Handle mouse events for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        setPosition({ x: newX, y: newY });
      } else if (isResizing && resizeDirection) {
        const dx = e.clientX - dragOffset.x;
        const dy = e.clientY - dragOffset.y;
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        // Handle different resize directions
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(size.width + dx, minWidth);
        }
        if (resizeDirection.includes("w")) {
          const widthChange = Math.min(dx, size.width - minWidth);
          newWidth = Math.max(size.width - dx, minWidth);
          newX = position.x + widthChange;
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(size.height + dy, minHeight);
        }
        if (resizeDirection.includes("n")) {
          const heightChange = Math.min(dy, size.height - minHeight);
          newHeight = Math.max(size.height - dy, minHeight);
          newY = position.y + heightChange;
        }

        setSize({ width: newWidth, height: newHeight });
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setPosition({ x: newX, y: newY });
        }
        setDragOffset({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // Save position to context
        moveProgram(id, position);
      } else if (isResizing) {
        // Save size to context
        resizeProgram(id, size);
      }

      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, id, resizeDirection, moveProgram, resizeProgram, minWidth, minHeight]);

  // Double-click on title bar to maximize/restore
  const handleTitleDoubleClick = () => {
    handleMaximize();
  };

  // Apply different styles based on window state
  let windowStyle: React.CSSProperties = {
    zIndex,
    display: isMinimized ? "none" : "flex",
  };

  if (isMaximized) {
    windowStyle = {
      ...windowStyle,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: "none",
    };
  } else {
    windowStyle = {
      ...windowStyle,
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
    };
  }

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-[#ECE9D8] border border-[#0055EA] shadow-lg overflow-hidden`}
      style={windowStyle}
      onMouseDown={handleFocus}
    >
      {/* Window Title Bar */}
      <div
        className={`flex items-center px-2 py-1 ${isActive ? "xp-window-title" : "xp-window-title-inactive"}`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        <img
          src={icon}
          alt=""
          className="w-4 h-4 mr-1"
        />
        <div className="flex-grow text-sm font-semibold truncate">{title}</div>
        <div className="flex space-x-1">
          <button
            className="w-6 h-6 flex items-center justify-center bg-[#7895E5] hover:bg-[#96B4FA] active:bg-[#3c55a3] rounded-none"
            onClick={handleMinimize}
          >
            <div className="w-2 h-0.5 bg-white"></div>
          </button>

          <button
            className="w-6 h-6 flex items-center justify-center bg-[#7895E5] hover:bg-[#96B4FA] active:bg-[#3c55a3] rounded-none"
            onClick={handleMaximize}
          >
            {isMaximized ? (
              <div className="w-3 h-3 border border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-[#7895E5] border border-white"></div>
              </div>
            ) : (
              <div className="w-3 h-3 border border-white"></div>
            )}
          </button>

          <button
            className="w-6 h-6 flex items-center justify-center bg-[#EB4848] hover:bg-[#F06A6A] active:bg-[#A72222] rounded-none"
            onClick={handleClose}
          >
            <div className="w-3 h-3 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-white absolute transform rotate-45"></div>
              <div className="w-3 h-0.5 bg-white absolute transform -rotate-45"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-grow overflow-auto relative">{children}</div>

      {/* Resize Handles (if window is resizable and not maximized) */}
      {resizable && !isMaximized && (
        <>
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
          />
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "n")}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "s")}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "w")}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize z-10"
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
          />
        </>
      )}
    </div>
  );
}
