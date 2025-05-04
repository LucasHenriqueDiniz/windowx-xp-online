"use client";
import { useEffect, useState } from "react";
import { database, isDatabaseAvailable, getInitializationError } from "../../lib/firebase";
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
        // Check if database is available
        if (!isDatabaseAvailable()) {
          const errorMsg = getInitializationError() || "Database não foi inicializado. Verifique suas variáveis de ambiente.";
          throw new Error(errorMsg);
        }

        // Check if desktop data already exists
        const desktopRef = ref(database!, "desktop");
        const snapshot = await get(desktopRef);

        // Only initialize if data doesn't exist
        if (!snapshot.exists()) {
          console.log("Initializing database with default values...");

          // Set default values for desktop settings
          await set(ref(database!, "desktop/iconIds"), defaultIcons);
          await set(ref(database!, "desktop/iconSize"), "medium");
          await set(ref(database!, "desktop/iconArrangement"), "auto");
          await set(ref(database!, "desktop/wallpaper"), DefaultWallpaper.src);
          await set(ref(database!, "desktop/wallpaperPosition"), "center");
          await set(ref(database!, "desktop/backgroundColor"), "#008080");

          // Inicializa programs como um array vazio
          await set(ref(database!, "desktop/programs"), []);

          console.log("Desktop settings initialized successfully!");
        } else {
          console.log("Desktop settings already exist.");
        }

        // Check if system data already exists
        const systemRef = ref(database!, "system");
        const systemSnapshot = await get(systemRef);

        // Initialize system settings if they don't exist
        if (!systemSnapshot.exists()) {
          console.log("Initializing system settings...");

          // system/programs é usado para sincronização multiplayer, não para armazenar o estado atual
          await set(ref(database!, "system/programs"), {});
          await set(ref(database!, "system/taskbar"), { height: 40, isLocked: true });
          await set(ref(database!, "system/startMenu"), { isOpen: false });
          await set(ref(database!, "system/showDesktop"), { active: false, lastUpdated: Date.now() });
          await set(ref(database!, "system/programLaunches"), []);

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
        <div className="fixed inset-0 bg-blue-700 text-white flex flex-col items-center justify-center p-8 z-50">
          <div className="w-full max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">WINDOWS XP</h1>
            <p className="text-xl mb-6">Um problema foi detectado e o Windows foi encerrado para evitar danos ao seu computador.</p>

            <div className="bg-black text-white p-4 font-mono text-sm mb-6">
              <p>FIREBASE_INITIALIZATION_FAILED</p>
              <p className="mt-2">ERRO TÉCNICO: {error}</p>
              <p className="mt-4">Se esta é a primeira vez que você está vendo esta tela,</p>
              <p>verifique se as variáveis de ambiente do Firebase estão configuradas corretamente.</p>
              <p className="mt-4">Informações técnicas:</p>
              <p>*** STOP: 0x0000000F (0x00000000, 0x00000000, 0x00000000, 0x00000000)</p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
