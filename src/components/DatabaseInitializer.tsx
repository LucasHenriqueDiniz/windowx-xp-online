"use client";
import { useEffect, useState } from "react";
import { database } from "../../lib/firebase";
import { ref, set, get } from "firebase/database";
import { DefaultWallpaper } from "../../public/assets/wallpapers";
import { defaultIcons } from "@/context/DesktopContext";

interface Props {
  onComplete?: () => void;
}

export default function DatabaseInitializer({ onComplete }: Props) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Check if desktop data already exists
        const desktopRef = ref(database, "desktop");
        const snapshot = await get(desktopRef);

        // Only initialize if data doesn't exist
        if (!snapshot.exists()) {
          console.log("Initializing database with default values...");

          // Set default values for desktop settings
          await set(ref(database, "desktop/iconIds"), defaultIcons);
          await set(ref(database, "desktop/iconSize"), "medium");
          await set(ref(database, "desktop/iconArrangement"), "auto");
          await set(ref(database, "desktop/wallpaper"), DefaultWallpaper.src);
          await set(ref(database, "desktop/wallpaperPosition"), "center");
          await set(ref(database, "desktop/backgroundColor"), "#008080");

          // Inicializa programs como um array vazio
          await set(ref(database, "desktop/programs"), []);

          console.log("Desktop settings initialized successfully!");
        } else {
          console.log("Desktop settings already exist.");
        }

        // Check if system data already exists
        const systemRef = ref(database, "system");
        const systemSnapshot = await get(systemRef);

        // Initialize system settings if they don't exist
        if (!systemSnapshot.exists()) {
          console.log("Initializing system settings...");

          // system/programs é usado para sincronização multiplayer, não para armazenar o estado atual
          await set(ref(database, "system/programs"), {});
          await set(ref(database, "system/taskbar"), { height: 40, isLocked: true });
          await set(ref(database, "system/startMenu"), { isOpen: false });
          await set(ref(database, "system/showDesktop"), { active: false, lastUpdated: Date.now() });
          await set(ref(database, "system/programLaunches"), []);

          console.log("System settings initialized successfully!");
        } else {
          console.log("System settings already exist.");
        }

        setInitialized(true);
        if (onComplete) onComplete();
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDatabase();
  }, [onComplete]);

  return <>{!initialized && <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-md text-sm">Initializing database...</div>}</>;
}
