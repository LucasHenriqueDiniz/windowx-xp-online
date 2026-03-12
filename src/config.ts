// src/config.ts

// Define o modo da aplicação. Pode ser 'local' ou 'online'.
// 'local': Usa localStorage, sem conexão com o Firebase.
// 'online': Usa Firebase para sincronização em tempo real.
const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || 'local'; // Padrão para 'local' se não definido

// Configurações do Firebase (usadas apenas no modo 'online')
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Valida se as configurações do Firebase estão presentes no modo online
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId);

if (APP_MODE === 'online' && !isFirebaseConfigured) {
  console.warn(
    'Modo online está ativo, mas as variáveis de ambiente do Firebase não estão configuradas corretamente. '
  );
}

export const config = {
  APP_MODE,
  firebaseConfig,
  isFirebaseConfigured,
};
