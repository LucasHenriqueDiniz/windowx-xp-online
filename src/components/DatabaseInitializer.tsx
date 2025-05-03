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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Verificar se o database está inicializado
        if (!database) {
          throw new Error("Database não foi inicializado. Verifique suas variáveis de ambiente.");
        }

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
        setError(error instanceof Error ? error.message : "Erro desconhecido ao inicializar o banco de dados");
      }
    };

    initializeDatabase();
  }, [onComplete]);

  return (
    <>
      {!initialized && !error && <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-md text-sm">Initializing database...</div>}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Erro de Inicialização</h2>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-gray-600 mb-4">Verifique se as variáveis de ambiente do Firebase estão configuradas corretamente.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </>
  );
}
