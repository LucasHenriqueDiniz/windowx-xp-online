"use client";
import { useEffect, useRef } from "react";
import Window from "../Window";
import { systemSounds } from "../../../public/assets/audio";
import Image from "next/image";
import { useDesktop } from "@/context/DesktopContext";
import { WindowPropertiesProps } from "@/types/window-properties";

interface ErrorDialogProps extends WindowPropertiesProps {
  title?: string;
  message: string;
  icon?: string;
  width?: number;
  height?: number;
  props?: {
    message: string;
  };
}

export default function ErrorDialog({
  id,
  isActive = true,
  isMaximized = false,
  isMinimized = false,
  zIndex = 9999,
  position,
  size,
  title = "Error",
  message,
  icon = "/assets/icons/error.png",
  width = 350,
  height = 150,
  props,
}: ErrorDialogProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { closeProgram } = useDesktop();

  // Play error sound when component mounts
  useEffect(() => {
    audioRef.current = new Audio(systemSounds.error);
    audioRef.current.play();
  }, []);

  const handleClose = () => {
    closeProgram(id);
  };

  return (
    <Window
      id={id}
      title={title}
      icon={icon}
      initialSize={{ width: width || 350, height: height || 150 }}
      initialPosition={position}
      size={size}
      resizable={false}
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      onClose={handleClose}
      showMaximize={false}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center flex-1 mb-4">
          <Image
            src={icon}
            alt="Error"
            width={48}
            height={48}
            className="w-12 h-12 mr-3"
          />
          <div className="text-sm">{message || props?.message}</div>
        </div>
        <div className="flex justify-center">
          <button
            className="px-4 py-1 bg-[#ececec] border border-gray-400 rounded hover:bg-[#e5e5e5] active:bg-[#d9d9d9] text-sm"
            onClick={handleClose}
          >
            OK
          </button>
        </div>
      </div>
    </Window>
  );
}
