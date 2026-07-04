"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AITextImproverProps {
  originalText: string
  context?: string
  language?: "fr" | "en"
  onApply: (improvedText: string) => void
}

export function AITextImprover({ originalText, context, language = "fr", onApply }: AITextImproverProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleGenerateSuggestions = async () => {
    setIsLoading(true)
    setSuggestions([])
    setSelectedIndex(null)

    try {
      const response = await fetch("/api/ai/generate-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, context, language }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setSuggestions(data.suggestions)
      if (data.suggestions.length > 0) {
        setSelectedIndex(0)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les suggestions. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (suggestions.length === 0) {
      handleGenerateSuggestions()
    }
  }

  const handleApply = () => {
    if (selectedIndex !== null && suggestions[selectedIndex]) {
      onApply(suggestions[selectedIndex])
      setIsOpen(false)
      toast({
        title: "Texte appliqué",
        description: "La suggestion sélectionnée a été appliquée avec succès.",
      })
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpen}
        disabled={!originalText}
        className="bg-transparent"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Améliorer avec l'IA
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Assistant IA d'écriture</DialogTitle>
            <DialogDescription>
              L'IA génère 10 suggestions professionnelles. Choisissez celle qui vous convient le mieux.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Texte original</label>
              <Textarea value={originalText} readOnly className="min-h-20 bg-muted resize-none" />
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12 bg-muted rounded-md">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  L'IA génère 10 suggestions professionnelles...
                </span>
              </div>
            )}

            {!isLoading && suggestions.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Choisissez une suggestion ({suggestions.length} options disponibles)
                </label>
                <ScrollArea className="h-96 border rounded-md">
                  <div className="p-4 space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary/50",
                          selectedIndex === index
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:bg-accent",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                              selectedIndex === index
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {selectedIndex === index ? <Check className="h-4 w-4" /> : index + 1}
                          </div>
                          <p className="text-sm leading-relaxed flex-1">{suggestion}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">
                Annuler
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateSuggestions}
                disabled={isLoading}
                className="bg-transparent"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Régénérer 10 nouvelles
              </Button>
              <Button type="button" onClick={handleApply} disabled={selectedIndex === null || isLoading}>
                Appliquer la sélection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
