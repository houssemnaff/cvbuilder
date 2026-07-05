// Stub for Node's built-in "module" so bundlers targeting the browser
// don't fail resolving it. Only reached via a runtime `typeof process === "object"`
// guard in clawpdf's pdfium wasm loader (pulled in transitively by @pdfme/ui),
// which never actually executes in the browser.
export function createRequire() {
  return () => {
    throw new Error("createRequire is not supported in the browser")
  }
}

export default { createRequire }
