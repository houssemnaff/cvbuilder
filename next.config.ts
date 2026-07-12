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

  // Same clawpdf issue as above, but for the "next build --webpack" path
  // (the actual production build command): its Node-only `await import(...)`
  // branches (module, node:fs/promises, node:url, node:zlib) are guarded by a
  // runtime `typeof process` check and never execute in the browser, but
  // webpack still statically resolves dynamic imports, so it fails without
  // these stubbed out for the client bundle.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        module: path.join(__dirname, 'lib/stubs/empty-module.js'),
        'node:fs/promises': false,
        'node:url': false,
        'node:zlib': false,
      }
    }
    return config
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