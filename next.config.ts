import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Modo de exportação estática para o Firebase Hosting
  output: "export",
  // Desabilita a geração de 404 personalizada
  trailingSlash: true,
};

export default nextConfig;
