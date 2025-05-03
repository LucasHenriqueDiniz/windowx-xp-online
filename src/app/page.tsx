"use client";
import { DesktopProvider } from "@/context/DesktopContext";
import Desktop from "@/components/Desktop/Desktop";
import Taskbar from "@/components/Taskbar/Taskbar";
import DatabaseInitializer from "@/components/DatabaseInitializer";
import CursorOverlay from "@/components/CursorOverlay";
import NameDialog from "@/components/NameDialog";
import BootAnimation from "@/components/Boot/BootAnimation";
import { useState } from "react";

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);

  const handleBootComplete = () => {
    setIsBooting(false);
  };

  return (
    <DesktopProvider>
      <div className="flex flex-col h-screen">
        <DatabaseInitializer />
        {isBooting ? (
          <BootAnimation onComplete={handleBootComplete} />
        ) : (
          <>
            <div className="flex-grow relative">
              <Desktop />
            </div>
            <Taskbar />
            <CursorOverlay />
            <NameDialog />
          </>
        )}
      </div>
    </DesktopProvider>
  );
}
