import { initializeApp, getApps } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

// Configuração condicional para evitar erros durante o build estático
const firebaseConfig = {
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
let database: Database | undefined = undefined;

// Verifica se está no navegador e se as variáveis essenciais estão definidas
const isBrowser = typeof window !== "undefined";
const hasRequiredConfig = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Só inicializa se estiver no navegador, tiver as configurações necessárias, e não estiver já inicializado
if (isBrowser && hasRequiredConfig && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { database };
