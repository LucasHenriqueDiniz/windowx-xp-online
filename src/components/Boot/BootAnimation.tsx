"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import * as Icons from "../../../public/assets/icons";
import { systemSounds } from "../../../public/assets/audio";

interface BootAnimationProps {
  onComplete: () => void;
}

export default function BootAnimation({ onComplete }: BootAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const startupAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar o elemento de áudio
    startupAudioRef.current = new Audio(systemSounds.startup);

    // Tocar o som de inicialização
    const playPromise = startupAudioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch((e) => console.error("Error playing startup sound:", e));
    }

    // Iniciar a animação de progresso
    const bootInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(bootInterval);

          // Aguardar um momento após o carregamento completo
          setTimeout(() => {
            setIsHidden(true);

            // Chamar o callback depois da animação de fade-out
            setTimeout(() => {
              onComplete();
            }, 1000);
          }, 1500);

          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => {
      clearInterval(bootInterval);
      if (startupAudioRef.current) {
        startupAudioRef.current.pause();
        startupAudioRef.current = null;
      }
    };
  }, [onComplete]);

  // Fade out ao finalizar
  const opacity = isHidden ? "opacity-0" : "opacity-100";

  return (
    <div className={`fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center transition-opacity duration-1000 ${opacity}`}>
      <div className="flex items-center mb-10">
        <Image
          width={64}
          height={64}
          src={Icons.WindowsExplorer.src}
          alt="Windows Logo"
          className="w-16 h-16 mr-4"
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
