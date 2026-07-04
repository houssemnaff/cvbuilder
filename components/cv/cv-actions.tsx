"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MoreVertical, Download, Copy, Edit2, Trash2 } from "lucide-react"
import type { ProfileData } from "./cv-preview"

interface CVActionsProps {
  cvId: string
  cvName: string
  templateId: string
  profileData: ProfileData
  onUpdate: () => void
}

export function CVActions({ cvId, cvName, templateId, profileData, onUpdate }: CVActionsProps) {
  const { toast } = useToast()
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [newName, setNewName] = useState(cvName)
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Call the Puppeteer PDF generation API
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          profileData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate PDF')
      }

      // Get the PDF blob from response
      const blob = await response.blob()

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${profileData.personal.firstName}_${profileData.personal.lastName}_CV.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export réussi",
        description: "Votre CV a été exporté en PDF avec succès.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('[PDF Export Error]:', error)
      
      toast({
        title: "Erreur d'export",
        description: `Impossible d'exporter le PDF: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDuplicate = () => {
    const cvs = JSON.parse(localStorage.getItem("user_cvs") || "[]")
    const originalCv = cvs.find((cv: any) => cv.id === cvId)

    if (originalCv) {
      const newCv = {
        ...originalCv,
        id: Date.now().toString(),
        name: `${originalCv.name} (Copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      cvs.push(newCv)
      localStorage.setItem("user_cvs", JSON.stringify(cvs))

      toast({
        title: "CV dupliqué",
        description: "Une copie du CV a été créée",
      })

      onUpdate()
    }
  }

  const handleRename = () => {
    if (!newName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom ne peut pas être vide",
        variant: "destructive",
      })
      return
    }

    const cvs = JSON.parse(localStorage.getItem("user_cvs") || "[]")
    const updatedCvs = cvs.map((cv: any) =>
      cv.id === cvId
        ? {
            ...cv,
            name: newName,
            updatedAt: new Date().toISOString(),
          }
        : cv,
    )

    localStorage.setItem("user_cvs", JSON.stringify(updatedCvs))

    toast({
      title: "CV renommé",
      description: "Le nom du CV a été modifié",
    })

    setIsRenameOpen(false)
    onUpdate()
  }

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) {
      const cvs = JSON.parse(localStorage.getItem("user_cvs") || "[]")
      const updatedCvs = cvs.filter((cv: any) => cv.id !== cvId)
      localStorage.setItem("user_cvs", JSON.stringify(updatedCvs))

      toast({
        title: "CV supprimé",
        description: "Le CV a été supprimé avec succès",
      })

      onUpdate()
      window.location.href = "/dashboard/cvs"
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-transparent">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export en cours..." : "Exporter en PDF"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Dupliquer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Renommer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le CV</DialogTitle>
            <DialogDescription>Choisissez un nouveau nom pour votre CV</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cvName">Nom du CV</Label>
              <Input
                id="cvName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Mon CV Professionnel"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRenameOpen(false)} className="bg-transparent">
                Annuler
              </Button>
              <Button onClick={handleRename}>Enregistrer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
