"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import { useDesktop } from "@/context/DesktopContext";
import Image from "next/image";
import { WindowPropertiesProps } from "@/types/window-properties";

// Estendendo a interface WindowPropertiesProps para incluir as propriedades adicionais específicas do componente Window
interface WindowProps extends Omit<WindowPropertiesProps, "props"> {
  title: string;
  icon: string;
  children: ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  onClose?: () => void;
  showMinimize?: boolean;
  showMaximize?: boolean;
  resizable?: boolean;
  props?: Record<string, any>;
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
  position,
  size,
  minWidth = 200,
  minHeight = 150,
  onClose,
  showMinimize = true,
  showMaximize = true,
  resizable = true,
  props,
}: WindowProps) {
  const { closeProgram, focusProgram, minimizeProgram, maximizeProgram, moveProgram, resizeProgram } = useDesktop();
  const [windowPosition, setWindowPosition] = useState(position || initialPosition);
  const [windowSize, setWindowSize] = useState(size || initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Atualiza a posição da janela se a prop position mudar
  useEffect(() => {
    if (position) {
      setWindowPosition(position);
    }
  }, [position]);

  // Atualiza o tamanho da janela se a prop size mudar
  useEffect(() => {
    if (size) {
      setWindowSize(size);
    }
  }, [size]);

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
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
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

        setWindowPosition({ x: newX, y: newY });
      } else if (isResizing && resizeDirection) {
        const dx = e.clientX - dragOffset.x;
        const dy = e.clientY - dragOffset.y;
        let newWidth = windowSize.width;
        let newHeight = windowSize.height;
        let newX = windowPosition.x;
        let newY = windowPosition.y;

        // Handle different resize directions
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(windowSize.width + dx, minWidth);
        }
        if (resizeDirection.includes("w")) {
          const widthChange = Math.min(dx, windowSize.width - minWidth);
          newWidth = Math.max(windowSize.width - dx, minWidth);
          newX = windowPosition.x + widthChange;
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(windowSize.height + dy, minHeight);
        }
        if (resizeDirection.includes("n")) {
          const heightChange = Math.min(dy, windowSize.height - minHeight);
          newHeight = Math.max(windowSize.height - dy, minHeight);
          newY = windowPosition.y + heightChange;
        }

        setWindowSize({ width: newWidth, height: newHeight });
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setWindowPosition({ x: newX, y: newY });
        }
        setDragOffset({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // Save position to context
        moveProgram(id, windowPosition);
      } else if (isResizing) {
        // Save size to context
        resizeProgram(id, windowSize);
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
  }, [isDragging, isResizing, dragOffset, windowPosition, windowSize, id, resizeDirection, moveProgram, resizeProgram, minWidth, minHeight]);

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
      top: `${windowPosition.y}px`,
      left: `${windowPosition.x}px`,
      width: `${windowSize.width}px`,
      height: `${windowSize.height}px`,
    };
  }

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col shadow-lg overflow-hidden border`}
      style={{
        ...windowStyle,
        borderColor: isActive ? "#0055EA" : "#a0a0a0",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
      onMouseDown={handleFocus}
    >
      {/* Window Title Bar - Usando estilo Windows XP com gradiente */}
      <div
        className={`flex items-center px-2 py-1 h-7 select-none ${
          isActive
            ? "bg-gradient-to-r from-[#0C59B3] via-[#3984D8] to-[#0C59B3] text-white"
            : "bg-gradient-to-r from-[#7F7F7F] via-[#B8B8B8] to-[#7F7F7F] text-[#D8E4F8]"
        }`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        <Image
          width={16}
          height={16}
          src={icon}
          alt="Icon"
          className="w-4 h-4 mr-1"
        />
        <div className="flex-grow text-sm font-semibold truncate">{title}</div>
        <div className="flex space-x-1">
          {/* Botão de minimizar - Estilo Windows XP */}
          {showMinimize && (
            <button
              className="w-[21px] h-[21px] flex items-center justify-center rounded-none focus:outline-none"
              style={{
                background: isActive ? "linear-gradient(to bottom, #FFFDFD 0%, #EEE9E5 100%)" : "linear-gradient(to bottom, #F5F5F5 0%, #E5E5E5 100%)",
                boxShadow: "0 0 1px rgba(0,0,0,0.5), inset 1px 1px 0px white, inset -1px -1px 0px #C7C7C7",
              }}
              onClick={handleMinimize}
            >
              <div className="w-[8px] h-[2px] bg-[#0A246A]"></div>
            </button>
          )}

          {/* Botão de maximizar/restaurar - Estilo Windows XP */}
          {showMaximize && (
            <button
              className="w-[21px] h-[21px] flex items-center justify-center rounded-none focus:outline-none"
              style={{
                background: isActive ? "linear-gradient(to bottom, #FFFDFD 0%, #EEE9E5 100%)" : "linear-gradient(to bottom, #F5F5F5 0%, #E5E5E5 100%)",
                boxShadow: "0 0 1px rgba(0,0,0,0.5), inset 1px 1px 0px white, inset -1px -1px 0px #C7C7C7",
              }}
              onClick={handleMaximize}
            >
              {isMaximized ? (
                // Ícone de restaurar - Estilo Windows XP
                <div className="relative w-[10px] h-[10px]">
                  <div className="absolute w-[6px] h-[6px] right-0 bottom-0 border border-[#0A246A]"></div>
                  <div className="absolute w-[6px] h-[6px] left-0 top-0 border border-[#0A246A] bg-white"></div>
                </div>
              ) : (
                // Ícone de maximizar - Estilo Windows XP
                <div className="w-[8px] h-[8px] border border-[#0A246A]"></div>
              )}
            </button>
          )}

          {/* Botão de fechar - Estilo Windows XP */}
          <button
            className="w-[21px] h-[21px] flex items-center justify-center rounded-none focus:outline-none"
            style={{
              background: "linear-gradient(to bottom, #F5A3A3 0%, #B81B22 60%, #952116 100%)",
              boxShadow: "0 0 1px rgba(0,0,0,0.5), inset 1px 1px 0px #FCBCBC, inset -1px -1px 0px #800000",
            }}
            onClick={handleClose}
          >
            {/* X branco - Estilo Windows XP */}
            <div className="relative w-[10px] h-[10px]">
              <div className="absolute w-[10px] h-[1px] bg-white transform rotate-45 top-[4.5px]"></div>
              <div className="absolute w-[10px] h-[1px] bg-white transform -rotate-45 top-[4.5px]"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Frame da janela - Estilo Windows XP */}
      <div className="flex-grow overflow-auto relative border-t border-[#0055EA] bg-[#ECE9D8]">{children}</div>

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
