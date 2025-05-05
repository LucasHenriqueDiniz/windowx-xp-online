"use client";
import { useDesktop } from "@/context/DesktopContext";
import { WindowPropertiesProps } from "@/types/window-properties";
import { useEffect, useRef, useState } from "react";
import { systemSounds, uiSounds } from "../../../public/assets/audio";
import Window from "../Window";

interface DrawAction {
  type: "draw" | "clear";
  points?: { x: number; y: number }[];
  color?: string;
  lineWidth?: number;
}

interface PaintProps extends WindowPropertiesProps {
  props?: {
    currentColor?: string;
    lineWidth?: number;
    currentTool?: "pencil" | "brush" | "eraser" | "line" | "rectangle" | "ellipse";
    drawHistory?: DrawAction[];
  };
}

export default function Paint({ id, isActive, isMaximized, isMinimized, zIndex, position, size, props }: PaintProps) {
  const { updateProgramProps } = useDesktop();
  const [color, setColor] = useState(props?.currentColor || "#000000");
  const [lineWidth, setLineWidth] = useState(props?.lineWidth || 2);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "brush" | "eraser" | "line" | "rectangle" | "ellipse">(props?.currentTool || "pencil");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [drawHistory, setDrawHistory] = useState<DrawAction[]>(props?.drawHistory || []);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to be the size of the content area
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Apply some settings to make drawing look smoother
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    // Initialize audio
    audioRef.current = new Audio(systemSounds.default);

    // Apply any existing drawing history from props
    if (props?.drawHistory && props.drawHistory.length > 0) {
      replayDrawHistory(props.drawHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Save current image data
      const context = contextRef.current;
      if (!context) return;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Restore context settings
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = lineWidth;

      // Restore image data
      context.putImageData(imageData, 0, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [color, lineWidth]);

  // Sync with other users' actions
  useEffect(() => {
    if (props?.drawHistory && JSON.stringify(props.drawHistory) !== JSON.stringify(drawHistory)) {
      setDrawHistory(props.drawHistory);
      replayDrawHistory(props.drawHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.drawHistory]);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    setDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    setCurrentPath((prev) => [...prev, { x, y }]);
  };

  const finishDrawing = () => {
    if (!drawing || !contextRef.current) return;

    contextRef.current.closePath();
    setDrawing(false);

    // Add to history
    const newAction: DrawAction = {
      type: "draw",
      points: currentPath,
      color,
      lineWidth,
    };

    const updatedHistory = [...drawHistory, newAction];
    setDrawHistory(updatedHistory);
    setUnsavedChanges(true);

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      drawHistory: updatedHistory,
      currentColor: color,
      lineWidth,
      currentTool: tool,
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Add clear action to history
    const newAction: DrawAction = { type: "clear" };
    const updatedHistory = [...drawHistory, newAction];
    setDrawHistory(updatedHistory);
    setUnsavedChanges(true);

    // Play delete sound
    if (audioRef.current) {
      audioRef.current.src = uiSounds.recycle;
      audioRef.current.play();
    }

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      drawHistory: updatedHistory,
      currentColor: color,
      lineWidth,
      currentTool: tool,
    });
  };

  // Replay drawing history on canvas
  const replayDrawHistory = (history: DrawAction[]) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Clear canvas first
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Replay each action
    history.forEach((action) => {
      if (action.type === "clear") {
        context.clearRect(0, 0, canvas.width, canvas.height);
      } else if (action.type === "draw" && action.points && action.points.length > 0) {
        context.beginPath();
        context.strokeStyle = action.color || "#000000";
        context.lineWidth = action.lineWidth || 2;

        const startPoint = action.points[0];
        context.moveTo(startPoint.x, startPoint.y);

        for (let i = 1; i < action.points.length; i++) {
          context.lineTo(action.points[i].x, action.points[i].y);
        }

        context.stroke();
        context.closePath();
      }
    });

    // Reset to current settings
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
  };

  // Handle color change
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (contextRef.current) {
      contextRef.current.strokeStyle = newColor;
    }

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      currentColor: newColor,
    });
  };

  // Handle line width change
  const handleLineWidthChange = (newWidth: number) => {
    setLineWidth(newWidth);
    if (contextRef.current) {
      contextRef.current.lineWidth = newWidth;
    }

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      lineWidth: newWidth,
    });
  };

  // Handle tool change
  const handleToolChange = (newTool: "pencil" | "brush" | "eraser" | "line" | "rectangle" | "ellipse") => {
    setTool(newTool);

    // For eraser, set color to white
    if (newTool === "eraser") {
      if (contextRef.current) {
        contextRef.current.strokeStyle = "#FFFFFF";
      }
    } else {
      if (contextRef.current) {
        contextRef.current.strokeStyle = color;
      }
    }

    // Sync with other users
    updateProgramProps(id, {
      ...props,
      currentTool: newTool,
    });
  };

  return (
    <Window
      id={id}
      title="Paint"
      icon="/assets/icons/paint.png"
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      initialPosition={position || { x: 150, y: 150 }}
      initialSize={size || { width: 800, height: 600 }}
      minWidth={400}
      minHeight={300}
    >
      <div className="flex flex-col h-full bg-[#ECE9D8]">
        {/* Menu Bar */}
        <div className="flex text-xs border-b border-gray-400 bg-[#ECE9D8]">
          <button className="px-2 py-1 hover:bg-[#B8C7E0]">File</button>
          <button className="px-2 py-1 hover:bg-[#B8C7E0]">Edit</button>
          <button className="px-2 py-1 hover:bg-[#B8C7E0]">View</button>
          <button className="px-2 py-1 hover:bg-[#B8C7E0]">Image</button>
          <button className="px-2 py-1 hover:bg-[#B8C7E0]">Colors</button>
          <button className="px-2 py-1 hover:bg-[#B8C7E0]">Help</button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center p-1 border-b border-gray-400 bg-[#ECE9D8]">
          {/* Drawing Tools */}
          <div className="flex space-x-1 mr-4">
            <button
              className={`w-8 h-8 flex justify-center items-center border ${
                tool === "pencil" ? "border-blue-500 bg-blue-100" : "border-gray-400 hover:bg-gray-200"
              }`}
              onClick={() => handleToolChange("pencil")}
              title="Pencil"
            >
              ✏️
            </button>
            <button
              className={`w-8 h-8 flex justify-center items-center border ${
                tool === "brush" ? "border-blue-500 bg-blue-100" : "border-gray-400 hover:bg-gray-200"
              }`}
              onClick={() => handleToolChange("brush")}
              title="Brush"
            >
              🖌️
            </button>
            <button
              className={`w-8 h-8 flex justify-center items-center border ${
                tool === "eraser" ? "border-blue-500 bg-blue-100" : "border-gray-400 hover:bg-gray-200"
              }`}
              onClick={() => handleToolChange("eraser")}
              title="Eraser"
            >
              🧽
            </button>
          </div>

          {/* Line Width */}
          <div className="flex space-x-1 mr-4">
            <button
              className={`w-8 h-8 flex justify-center items-center border ${
                lineWidth === 1 ? "border-blue-500 bg-blue-100" : "border-gray-400 hover:bg-gray-200"
              }`}
              onClick={() => handleLineWidthChange(1)}
              title="Thin"
            >
              <div className="w-4 h-1 bg-black"></div>
            </button>
            <button
              className={`w-8 h-8 flex justify-center items-center border ${
                lineWidth === 3 ? "border-blue-500 bg-blue-100" : "border-gray-400 hover:bg-gray-200"
              }`}
              onClick={() => handleLineWidthChange(3)}
              title="Medium"
            >
              <div className="w-4 h-2 bg-black"></div>
            </button>
            <button
              className={`w-8 h-8 flex justify-center items-center border ${
                lineWidth === 5 ? "border-blue-500 bg-blue-100" : "border-gray-400 hover:bg-gray-200"
              }`}
              onClick={() => handleLineWidthChange(5)}
              title="Thick"
            >
              <div className="w-4 h-3 bg-black"></div>
            </button>
          </div>

          {/* Colors */}
          <div className="flex flex-wrap max-w-[200px] border border-gray-400 p-1 bg-white">
            {[
              "#000000",
              "#808080",
              "#800000",
              "#808000",
              "#008000",
              "#008080",
              "#000080",
              "#800080",
              "#FFFFFF",
              "#C0C0C0",
              "#FF0000",
              "#FFFF00",
              "#00FF00",
              "#00FFFF",
              "#0000FF",
              "#FF00FF",
            ].map((colorOption) => (
              <button
                key={colorOption}
                className={`w-5 h-5 m-1 border ${color === colorOption ? "border-blue-500 border-2" : "border-gray-400"}`}
                style={{ backgroundColor: colorOption }}
                onClick={() => handleColorChange(colorOption)}
                title={colorOption}
              />
            ))}
          </div>

          {/* Clear Button */}
          <button
            className="ml-auto px-2 py-1 border border-gray-400 hover:bg-gray-200 text-xs"
            onClick={clearCanvas}
            title="Clear Canvas"
          >
            Clear
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-grow p-1 overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="w-full h-full border border-gray-300 cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={finishDrawing}
            onMouseLeave={finishDrawing}
          />
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-1 border-t border-gray-400 bg-[#ECE9D8] text-xs">
          <div className="flex items-center">
            <div className="px-2">Tool: {tool.charAt(0).toUpperCase() + tool.slice(1)}</div>
            <div className="px-2 border-l border-gray-400">
              Color:{" "}
              <span
                className="inline-block w-3 h-3 ml-1 border border-gray-400"
                style={{ backgroundColor: color }}
              ></span>
            </div>
          </div>
          <div>{unsavedChanges ? "Unsaved changes" : "Ready"}</div>
        </div>
      </div>
    </Window>
  );
}
