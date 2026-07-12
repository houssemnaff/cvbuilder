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
  // (the actual production build command). clawpdf's own internal Node-only
  // `await import(...)` branches (module, node:fs/promises, node:url, node:zlib)
  // are guarded by a runtime `typeof process` check and never execute in the
  // browser, but webpack still statically resolves every import() call to build
  // the chunk graph — including inside async chunks — so these need to stay
  // stubbed for the client bundle even when @pdfme/ui itself is imported
  // dynamically on our side.
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        module: path.join(__dirname, 'lib/stubs/empty-module.js'),
      }
      // resolve.alias doesn't intercept "node:"-scheme specifiers used in
      // dynamic `import()` calls (they hit webpack's scheme resolver before
      // alias substitution runs), so IgnorePlugin is needed to actually
      // drop these from the client bundle.
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^node:(fs\/promises|url|zlib)$/,
        }),
      )
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