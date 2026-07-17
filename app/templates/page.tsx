"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import { TemplateGrid } from "@/components/cv/template-grid"

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">CVBuilder AI</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="sm:h-9 sm:px-4">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="sm:h-9 sm:px-4">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="sm:h-9 sm:px-4">
                Inscription
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos modèles de CV professionnels</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez parmi une sélection de templates soigneusement conçus et optimisés pour les systèmes ATS
            </p>
          </div>

          <TemplateGrid ctaHref="/register" />

          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Prêt à créer votre CV professionnel ?</h2>
            <Link href="/register">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 CVBuilder AI. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
