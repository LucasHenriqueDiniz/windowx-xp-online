"use client";
import { useState, useEffect, ReactNode, useCallback } from "react";
import { getDatabase, ref, set, goOnline, goOffline, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useAuth } from "@/context/AuthContext";
import { useDesktop } from "@/context/DesktopContext";
import { config } from "@/config"; 
import { DesktopState } from "@/types";

interface DatabaseInitializerProps {
  children: ReactNode;
}

// Estado inicial da área de trabalho, caso não haja nenhum no banco de dados
const initialState: DesktopState = {
  icons: [
    { id: "paint", position: { x: 20, y: 20 } },
    { id: "notepad", position: { x: 20, y: 120 } },
  ],
  programs: [],
  nextZIndex: 10,
};

export default function DatabaseInitializer({ children }: DatabaseInitializerProps) {
  const { user } = useAuth();
  const { setDesktopState } = useDesktop();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = useCallback(async () => {
    // Se estiver no modo local, o DesktopContext cuida de tudo.
    if (config.APP_MODE === 'local') {
      console.log("Executando em modo local. O DesktopContext irá carregar o estado do localStorage.");
      // O setDesktopState(initialState) é chamado dentro do provider, não precisamos fazer nada aqui.
      // Apenas precisamos parar o carregamento.
      setIsLoading(false);
      return;
    }

    if (!config.isFirebaseConfigured) {
      setError("As variáveis de ambiente do Firebase não estão configuradas.");
      setIsLoading(false);
      return;
    }

    try {
      const app = initializeApp(config.firebaseConfig);
      const database = getDatabase(app);
      goOnline(database);

      if (user) {
        const dbRef = ref(database, "desktop");
        
        // Pega o estado inicial UMA VEZ.
        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
          setDesktopState(snapshot.val());
        } else {
          // Se não houver estado, inicializa com o estado padrão no DB e localmente
          await set(dbRef, initialState);
          setDesktopState(initialState);
        }

        // O listener de eventos no DesktopContext cuidará das atualizações a partir de agora.
        setIsLoading(false);

        return () => goOffline(database);
      }
      // Se não houver usuário, apenas para de carregar. A tela de login será exibida.
      else {
        setIsLoading(false)
      }

    } catch (e: unknown) {
      console.error("Falha na inicialização do Firebase:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
      setIsLoading(false);
    }
  }, [user, setDesktopState]);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  // ... o resto do componente (telas de loading e erro) permanece o mesmo ...
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white">Inicializando o sistema...</p>
      </div>
    );
  }

  if (config.APP_MODE === 'online' && error) {
    return (
      <div className="fixed inset-0 bg-[#000080] text-white flex items-center justify-center z-50">
        <div className="w-full max-w-2xl text-center p-8">
          <div className="bg-black text-white p-4 font-mono text-sm mb-6">
            <p>FIREBASE_INITIALIZATION_FAILED</p>
            <p className="mt-2">ERRO TÉCNICO: {error}</p>
            <p className="mt-4">*** STOP: 0x0000000F (0x00000000, 0x00000000, 0x00000000, 0x00000000)</p>
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
    );
  }

  return <>{children}</>;
}
