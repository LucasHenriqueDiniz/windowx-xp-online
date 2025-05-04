import type { NextConfig } from "next";

// Log para debug durante o build
console.log("Building with Firebase config:", {
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasDatabaseURL: !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Modo de exportação estática para o Firebase Hosting
  output: "export",
  // Desabilita a geração de 404 personalizada
  trailingSlash: true,
  // Garantir que as env variables são processadas
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
};

export default nextConfig;
