/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

// Define Firebase configuration interface with required fields
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Default Firebase configuration
const defaultConfig: FirebaseConfig = {
  apiKey: "AIzaSyBLkoD4AiCf41YERfkQdNFiAfYYDNCu7d4",
  authDomain: "w-xp-online.firebaseapp.com",
  databaseURL: "https://w-xp-online-default-rtdb.firebaseio.com",
  projectId: "w-xp-online",
  storageBucket: "w-xp-online.firebasestorage.app",
  messagingSenderId: "623256255902",
  appId: "1:623256255902:web:fc440dd8ed4798b6be6a8f",
};

// Initialize Firebase only on the client side or if not already initialized
let app;
let database: Database | null = null;
let initializationError: string | null = null;

// Verifica se está no navegador
const isBrowser = typeof window !== "undefined";

// Configuração do Firebase
let firebaseConfig: FirebaseConfig = defaultConfig;

// Function to validate if a config has all required Firebase fields
const isValidFirebaseConfig = (config: Record<string, any>): config is FirebaseConfig => {
  const requiredFields = ["apiKey", "authDomain", "databaseURL", "projectId", "storageBucket", "messagingSenderId", "appId"];

  return requiredFields.every((field) => typeof config[field] === "string" && config[field].trim() !== "");
};

// Se estiver no navegador, tenta carregar a configuração do arquivo config.js
if (isBrowser) {
  try {
    // Verifica se o config global está disponível (definido em public/config.js)
    if (typeof window.firebaseConfig !== "undefined") {
      if (isValidFirebaseConfig(window.firebaseConfig)) {
        console.log("Usando configuração do Firebase do arquivo config.js");
        firebaseConfig = window.firebaseConfig;
      } else {
        console.warn("Configuração do Firebase no config.js está incompleta, usando configuração padrão");
      }
    } else {
      console.log("Configuração do Firebase não encontrada no arquivo config.js, usando configuração padrão");
    }
  } catch (error) {
    console.warn("Erro ao acessar window.firebaseConfig, usando configuração padrão", error);
  }
}

// Só inicializa se estiver no navegador e não estiver já inicializado
if (isBrowser && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    initializationError = error instanceof Error ? error.message : "Erro desconhecido ao inicializar o Firebase";
  }
}

// Function to check if database is available
const isDatabaseAvailable = () => database !== null;

// Function to get the initialization error
const getInitializationError = () => initializationError;

export { database, isDatabaseAvailable, getInitializationError };
