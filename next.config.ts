import type { NextConfig } from "next";
import path from 'path'; // Utiliser import au lieu de require

const nextConfig: NextConfig = {
   turbopack: {
    resolveAlias: {
      // Alias pour html2canvas-pro avec Turbopack
 'html2canvas': 'html2canvas-pro',
      // clawpdf (pulled in transitively by @pdfme/ui via @pdfme/converter) has a
      // Node-only `await import("module")` branch guarded at runtime, but Turbopack
      // still tries to statically resolve it for the browser bundle. Stub it out,
      // scoped to the browser condition only so Next's own server-side use of the
      // real Node "module" builtin (source maps, etc.) keeps working.
      'module': {
        browser: path.join(__dirname, 'lib/stubs/empty-module.js').split(path.sep).join('/'),
      },
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