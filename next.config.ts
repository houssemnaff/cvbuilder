import type { NextConfig } from "next";
import path from 'path'; // Utiliser import au lieu de require

const nextConfig: NextConfig = {
   turbopack: {
    resolveAlias: {
      // Alias pour html2canvas-pro avec Turbopack
 'html2canvas': 'html2canvas-pro' 
    }
  },

  // Autoriser les appels API externes
  /*async headers() {
    return [
      {
        source: '/api/: path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        ],
      },
    ]
  },*/
}

export default nextConfig;