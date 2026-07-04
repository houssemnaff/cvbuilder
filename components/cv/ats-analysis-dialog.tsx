"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Loader2, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ProfileData } from "./cv-preview"

interface ATSAnalysisDialogProps {
  cvData: ProfileData
}

interface Recommendation {
  category: string
  suggestion: string
  priority: "high" | "medium" | "low"
}

interface Analysis {
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  missingKeywords: string[]
  recommendations: Recommendation[]
}

export function ATSAnalysisDialog({ cvData }: ATSAnalysisDialogProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez coller une offre d'emploi",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/ats-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, jobDescription }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setAnalysis(data.analysis)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'analyser le CV. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="bg-transparent">
        <Target className="h-4 w-4 mr-2" />
        Analyse ATS
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analyse ATS - Compatibilité avec l'offre d'emploi</DialogTitle>
            <DialogDescription>
              Collez l'offre d'emploi pour obtenir un score de compatibilité et des recommandations
            </DialogDescription>
          </DialogHeader>

          {!analysis ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Offre d'emploi</label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Collez ici la description complète de l'offre d'emploi (titre, missions, compétences requises, etc.)..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">
                  Annuler
                </Button>
                <Button onClick={handleAnalyze} disabled={isAnalyzing || !jobDescription.trim()}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Analyser
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Score de compatibilité</h3>
                      <p className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}/100</p>
                    </div>
                    <Target className={`h-16 w-16 ${getScoreColor(analysis.score)}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{analysis.summary}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="h-5 w-5" />
                      Points Forts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      Points à Améliorer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">✗</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mots-clés manquants</CardTitle>
                    <CardDescription>Ces termes sont présents dans l'offre mais absents de votre CV</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Recommandations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 py-2">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">{rec.category}</span>
                        <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                          {rec.priority === "high" ? "Haute" : rec.priority === "medium" ? "Moyenne" : "Basse"} priorité
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysis(null)
                    setJobDescription("")
                  }}
                  className="bg-transparent"
                >
                  Nouvelle analyse
                </Button>
                <Button onClick={() => setIsOpen(false)}>Fermer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
