"use client";
import { WindowPropertiesProps } from "@/types/window-properties";
import { ref, set } from "firebase/database";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { database } from "../../../lib/firebase";
import { systemSounds } from "../../../public/assets/audio";
import * as Icons from "../../../public/assets/icons";
import { DefaultWallpaper } from "../../../public/assets/wallpapers";
import Window from "../Window";
import { defaultIcons } from "@/context/DesktopContext";

export default function SystemRestore({ id, isActive, isMaximized, isMinimized, zIndex, position, size }: WindowPropertiesProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const [shutdownMessage, setShutdownMessage] = useState("Preparing to restore system...");
  const shutdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const startupAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar os elementos de áudio
    shutdownAudioRef.current = new Audio(systemSounds.shutdown);
    startupAudioRef.current = new Audio(systemSounds.startup);

    return () => {
      // Limpar os recursos de áudio ao desmontar
      if (shutdownAudioRef.current) {
        shutdownAudioRef.current.pause();
        shutdownAudioRef.current = null;
      }
      if (startupAudioRef.current) {
        startupAudioRef.current.pause();
        startupAudioRef.current = null;
      }
    };
  }, []);

  // Start system restore process
  const startRestore = () => {
    setIsConfirming(false);
    setIsShuttingDown(true);

    // Tocar o som de desligamento
    if (shutdownAudioRef.current) {
      shutdownAudioRef.current.play().catch((e) => console.error("Error playing shutdown sound:", e));
    }

    // Update progress bar for shutdown animation
    const shutdownInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(shutdownInterval);
          setTimeout(() => {
            setIsShuttingDown(false);
            setIsBooting(true);
            setProgress(0);
            resetDatabase();

            // Tocar o som de inicialização
            if (startupAudioRef.current) {
              startupAudioRef.current.play().catch((e) => console.error("Error playing startup sound:", e));
            }
          }, 1500);
          return 100;
        }

        // Update shutdown message
        if (prev === 30) {
          setShutdownMessage("Saving your settings...");
        } else if (prev === 60) {
          setShutdownMessage("System restore in progress...");
        } else if (prev === 85) {
          setShutdownMessage("Almost done...");
        }

        return prev + 1;
      });
    }, 50);
  };

  // Reset the database
  const resetDatabase = async () => {
    try {
      // Check if database is defined first
      if (!database) {
        console.error("Firebase database is not initialized");
        throw new Error("Firebase database is not initialized");
      }

      // Reset desktop settings
      await set(ref(database, "desktop/iconIds"), defaultIcons);
      await set(ref(database, "desktop/iconSize"), "medium");
      await set(ref(database, "desktop/iconArrangement"), "auto");
      await set(ref(database, "desktop/wallpaper"), DefaultWallpaper.src);
      await set(ref(database, "desktop/programs"), []);

      // Reset system settings
      await set(ref(database, "system/programs"), []);
      await set(ref(database, "system/taskbar"), { height: 40, isLocked: true });
      await set(ref(database, "system/startMenu"), { isOpen: false });

      // Start the boot animation
      setTimeout(() => {
        const bootInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(bootInterval);
              setTimeout(() => {
                setIsBooting(false);
                // Não precisamos mais chamar onClose aqui, o componente Window lidará com isso
              }, 1000);
              return 100;
            }
            return prev + 1;
          });
        }, 30);
      }, 2000);
    } catch (error) {
      console.error("Error resetting database:", error);
      setIsShuttingDown(false);
      setIsBooting(false);
    }
  };

  // If the user closes the window, make sure to cancel the shutdown
  useEffect(() => {
    return () => {
      // This will run when component unmounts
      setIsShuttingDown(false);
      setIsBooting(false);
    };
  }, []);

  // Full screen shutdown overlay
  if (isShuttingDown) {
    return (
      <div className="fixed inset-0 bg-[#0A246A] z-[9999] flex flex-col items-center justify-center">
        <div className="text-white font-xp text-2xl mb-4">Windows is shutting down</div>
        <div className="text-white font-xp mb-8">{shutdownMessage}</div>
        <div className="w-64 h-4 bg-[#122A88] border border-[#2A59B1]">
          <div
            ref={progressRef}
            className="h-full bg-[#2A59B1]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-white font-xp mt-8 text-sm">Do not turn off your computer or close your browser window</div>
      </div>
    );
  }

  // Full screen boot overlay
  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
        <div className="flex items-center mb-10">
          <Image
            width={64}
            height={64}
            src={Icons.WindowsExplorer.src}
            alt="Windows Logo"
            className="w-12 h-12 mr-4"
          />
          <div className="text-white font-xp text-3xl">
            Microsoft<sup>®</sup> Windows<sup>®</sup> XP
          </div>
        </div>
        <div className="w-64 h-4 bg-black border border-[#2A59B1]">
          <div
            className="h-full bg-[#2A59B1]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-white font-xp mt-8 text-sm">Starting Windows...</div>
      </div>
    );
  }

  // Normal window when not shutting down or booting
  const content = (
    <div className="flex flex-col w-full h-full bg-[#ECE9D8] overflow-hidden">
      <div className="flex-grow p-4 overflow-auto">
        {!isConfirming ? (
          <div className="flex flex-col items-center">
            <Image
              width={64}
              height={64}
              src={Icons.SystemRestore.src}
              alt="System Restore"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-lg font-bold mb-4">System Restore</h2>
            <p className="mb-4 text-center">System Restore helps you restore your computer&apos;s system files to an earlier point in time.</p>
            <p className="mb-6 text-center">This process will reset your desktop settings to default values. Any open programs will be closed.</p>
            <button
              className="xp-button mb-2"
              onClick={() => setIsConfirming(true)}
            >
              Next &gt;
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Image
              width={64}
              height={64}
              src={Icons.WarningDialog.src}
              alt="Warning"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-lg font-bold mb-4">Confirm System Restore</h2>
            <p className="mb-4 text-center text-red-600 font-bold">Warning: This will reset all your desktop settings!</p>
            <p className="mb-6 text-center">Are you sure you want to continue? Your computer will restart.</p>
            <div className="flex justify-center gap-4">
              <button
                className="xp-button"
                onClick={startRestore}
              >
                Yes
              </button>
              <button
                className="xp-button"
                onClick={() => setIsConfirming(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Window
      id={id}
      title="System Restore"
      icon={Icons.SystemRestore.src}
      isActive={isActive}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
      zIndex={zIndex}
      initialPosition={position || { x: 100, y: 100 }}
      initialSize={size || { width: 500, height: 400 }}
      minWidth={400}
      minHeight={300}
      resizable={true}
    >
      {content}
    </Window>
  );
}
