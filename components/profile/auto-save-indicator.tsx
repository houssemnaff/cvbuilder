import { Check, Loader2 } from "lucide-react"
import type { AutoSaveStatus } from "@/hooks/use-auto-save"

export function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Enregistrement...
      </span>
    )
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-green-600" />
        Enregistré
      </span>
    )
  }
  if (status === "error") {
    return <span className="text-xs text-destructive">Échec de la sauvegarde</span>
  }
  return null
}
