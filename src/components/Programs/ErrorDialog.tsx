"use client";
import { useEffect, useRef } from "react";
import Window from "../Window";
import { systemSounds } from "../../../public/assets/audio";
import Image from "next/image";

interface ErrorDialogProps {
  id: string;
  title?: string;
  message: string;
  icon?: string;
  onClose?: () => void;
  width?: number;
  height?: number;
}

export default function ErrorDialog({
  id,
  title = "Error",
  message,
  icon = "/assets/icons/Windows XP Error.png",
  onClose,
  width = 350,
  height = 150,
}: ErrorDialogProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play error sound when component mounts
  useEffect(() => {
    audioRef.current = new Audio(systemSounds.error);
    audioRef.current.play();
  }, []);

  return (
    <Window
      id={id}
      title={title}
      icon={icon}
      initialSize={{ width, height }}
      resizable={false}
      onClose={onClose}
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
          <div className="text-sm">{message}</div>
        </div>
        <div className="flex justify-center">
          <button
            className="px-4 py-1 bg-[#ececec] border border-gray-400 rounded hover:bg-[#e5e5e5] active:bg-[#d9d9d9] text-sm"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </Window>
  );
}
