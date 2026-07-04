"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft } from "lucide-react"
import { TEMPLATES } from "@/lib/cv-templates"

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
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Inscription</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nos modèles de CV professionnels</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez parmi une sélection de templates soigneusement conçus et optimisés pour les systèmes ATS
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] bg-muted rounded border border-border flex items-center justify-center mb-4">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href="/register">
                    <Button className="w-full">Utiliser ce modèle</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

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
