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
import { MoreVertical, Copy, Edit2, Trash2 } from "lucide-react"
import { cvService } from "@/lib/services/cv-service"

interface CVActionsProps {
  cvId: string
  cvName: string
  onUpdate: () => void
}

export function CVActions({ cvId, cvName, onUpdate }: CVActionsProps) {
  const { toast } = useToast()
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [newName, setNewName] = useState(cvName)

  const handleDuplicate = async () => {
    await cvService.duplicateCv(cvId)

    toast({
      title: "CV dupliqué",
      description: "Une copie du CV a été créée",
    })

    onUpdate()
  }

  const handleRename = async () => {
    if (!newName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom ne peut pas être vide",
        variant: "destructive",
      })
      return
    }

    await cvService.renameCv(cvId, newName)

    toast({
      title: "CV renommé",
      description: "Le nom du CV a été modifié",
    })

    setIsRenameOpen(false)
    onUpdate()
  }

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) {
      await cvService.deleteCv(cvId)

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
