"use client";
import { useEffect, useState } from "react";
import { database } from "../../lib/firebase";
import { ref, set, get } from "firebase/database";
import { DefaultWallpaper } from "../../public/assets/wallpapers";

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

        if (!snapshot.exists()) {
          console.log("Initializing database with default values...");

          // Default icon IDs - more efficient approach
          // With this approach, we only store the IDs in the database
          // The actual icon metadata (name, image, etc.) is loaded from the client
          const defaultIconIds = ["my-computer", "my-documents", "recycle-bin", "internet-explorer", "notepad", "calculator", "control-panel", "my-network"];

          // Set default values
          await set(ref(database, "desktop/iconIds"), defaultIconIds);
          await set(ref(database, "desktop/iconSize"), "medium");
          await set(ref(database, "desktop/iconArrangement"), "auto");
          await set(ref(database, "desktop/wallpaper"), DefaultWallpaper.src);

          console.log("Database initialized successfully!");
        } else {
          console.log("Database already initialized.");
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
