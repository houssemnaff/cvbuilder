"use client"

import { useEffect, useRef, useState } from "react"

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error"

/**
 * Sauvegarde `data` automatiquement (debounce) dès que `enabled` passe à true.
 * `enabled` doit passer à true dans le même effet que la première mise à jour
 * de `data` (hydratation depuis le serveur) : les deux changent alors dans un
 * seul rendu, ce qui permet de sauter cette sauvegarde initiale et de ne
 * déclencher l'auto-save que sur les modifications réelles de l'utilisateur.
 */
export function useAutoSave<T>(
  data: T,
  persist: (data: T) => Promise<void>,
  enabled: boolean,
  delay = 800,
): AutoSaveStatus {
  const [status, setStatus] = useState<AutoSaveStatus>("idle")
  const skipNextRef = useRef(true)

  useEffect(() => {
    if (!enabled) return
    if (skipNextRef.current) {
      skipNextRef.current = false
      return
    }

    setStatus("saving")
    const timeout = setTimeout(() => {
      persist(data)
        .then(() => setStatus("saved"))
        .catch((err) => {
          console.error("[useAutoSave] Failed to save:", err)
          setStatus("error")
        })
    }, delay)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, enabled])

  return status
}
