import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, Target, Download, Upload } from "lucide-react"

export default function HomePage() {
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
            <Link href="/login">
              <Button variant="ghost" size="sm" className="sm:h-9 sm:px-4">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="sm:h-9 sm:px-4">
                <span className="sm:hidden">Inscription</span>
                <span className="hidden sm:inline">Inscription gratuite</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
              Créez des CV professionnels optimisés par l'IA
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Une plateforme intelligente qui transforme vos informations en CV professionnels, optimisés pour les
              systèmes ATS et adaptés à chaque offre d'emploi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Voir les modèles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Pourquoi choisir CVBuilder AI ?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Import de CV en 2 minutes</h3>
                <p className="text-muted-foreground text-sm">
                  Envoyez votre ancien CV en PDF : l'IA extrait automatiquement vos expériences, formations et
                  compétences pour remplir votre profil.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Assistant IA intelligent</h3>
                <p className="text-muted-foreground text-sm">
                  Reformulez automatiquement vos expériences dans un style professionnel. L'IA adapte le contenu selon
                  la langue et le poste visé.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Analyse ATS avancée</h3>
                <p className="text-muted-foreground text-sm">
                  Comparez votre CV aux offres d'emploi. Obtenez un score de compatibilité et des recommandations
                  précises pour améliorer vos chances.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Modèles professionnels</h3>
                <p className="text-muted-foreground text-sm">
                  Choisissez parmi 10+ templates soigneusement conçus. Exportez en PDF prêt à l'envoi avec toutes vos
                  informations pré-remplies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Prêt à créer votre CV professionnel ?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà boosté leur recherche d'emploi avec CVBuilder AI.
          </p>
          <Link href="/register">
            <Button size="lg">Créer mon premier CV gratuitement</Button>
          </Link>
        </section>
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
