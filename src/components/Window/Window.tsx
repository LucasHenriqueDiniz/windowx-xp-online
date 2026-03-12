'use client';
import { useState, useRef, useEffect, ReactNode } from "react";
import { useDesktop } from "@/context/DesktopContext";
import Image from "next/image";
import { WindowPropertiesProps } from "@/types/window-properties";
import HeaderButtons from './HeaderButtons';
import './Window.css';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const dragRef = useRef<HTMLDivElement>(null);

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
    if (isMaximized || e.target !== dragRef.current) return;

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
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    if (e.target !== dragRef.current) return;
    handleMaximize();
  };

  const windowClasses = `window ${isActive ? 'focused' : 'unfocused'}`;

  let x, y, width, height;
  if (isMaximized) {
      width = window.innerWidth + 6;
      height = window.innerHeight - 24;
      x = -3;
      y = -3;
  } else {
      width = windowSize.width;
      height = windowSize.height;
      x = windowPosition.x;
      y = windowPosition.y;
  }

  return (
    <div
      ref={windowRef}
      className={windowClasses}
      style={{
        transform: `translate(${x}px,${y}px)`,
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        zIndex,
        display: isMinimized ? 'none' : 'flex',
      }}
      onMouseDown={handleFocus}
    >
        <div className="header-bg" />
        <header 
            className="app-header"
            ref={dragRef}
            onMouseDown={handleTitleMouseDown}
            onDoubleClick={handleTitleDoubleClick}
        >
            <Image
                width={15}
                height={15}
                src={icon}
                alt={title}
                className="app-header-icon"
                draggable={false}
            />
            <div className="app-header-title">{title}</div>
            <HeaderButtons
                onMinimize={handleMinimize}
                onMaximize={handleMaximize}
                onClose={handleClose}
                maximized={isMaximized}
                resizable={resizable}
                isFocus={isActive}
            />
        </header>
        <div className="app-content">
            {children}
        </div>

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
