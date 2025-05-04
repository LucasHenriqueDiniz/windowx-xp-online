import { initializeApp, getApps } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

// Configuração condicional para evitar erros durante o build estático
let firebaseConfig: {
  apiKey?: string | undefined;
  authDomain?: string | undefined;
  databaseURL?: string | undefined;
  projectId?: string | undefined;
  storageBucket?: string | undefined;
  messagingSenderId?: string | undefined;
  appId?: string | undefined;
} = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on the client side or if not already initialized
let app;
let database: Database | null = null;
let initializationError: string | null = null;

// Verifica se está no navegador
const isBrowser = typeof window !== "undefined";

// Se estiver no navegador, tenta carregar a configuração do arquivo config.js
if (isBrowser) {
  // Verifica se o config global está disponível (definido em public/config.js)
  // Usando tipo globalThis para evitar erro de tipagem
  if (typeof window.firebaseConfig !== "undefined") {
    console.log("Usando configuração do Firebase do arquivo config.js");
    firebaseConfig = window.firebaseConfig;
  }
}

// Verifica se as variáveis essenciais estão definidas
const hasRequiredConfig =
  (firebaseConfig.databaseURL && firebaseConfig.projectId) || (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

// Só inicializa se estiver no navegador, tiver as configurações necessárias, e não estiver já inicializado
if (isBrowser && hasRequiredConfig && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    initializationError = error instanceof Error ? error.message : "Erro desconhecido ao inicializar o Firebase";
  }
} else if (isBrowser && !hasRequiredConfig) {
  initializationError = "Configuração do Firebase incompleta. Verifique as variáveis de ambiente.";
}

// Function to check if database is available
const isDatabaseAvailable = () => database !== null;

// Function to get the initialization error
const getInitializationError = () => initializationError;

export { database, isDatabaseAvailable, getInitializationError };
