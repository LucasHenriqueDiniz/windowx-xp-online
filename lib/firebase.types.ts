// filepath: c:\Users\lucas\Documents\GitHub\multiplayer-xp\lib\firebase.types.ts

// Declaração de tipo para o window.firebaseConfig
declare global {
  interface Window {
    firebaseConfig?: {
      apiKey?: string;
      authDomain?: string;
      databaseURL?: string;
      projectId?: string;
      storageBucket?: string;
      messagingSenderId?: string;
      appId?: string;
    };
  }
}

// Exporta algo para tornar este arquivo um módulo externo
export {};
