"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Eye, Trash2 } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { authService, type AuthUser } from "@/lib/services/auth-service"
import { cvService, type Cv } from "@/lib/services/cv-service"

export default function CVsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [cvs, setCvs] = useState<Cv[]>([])

  useEffect(() => {
    authService.getCurrentUser().then(async (currentUser) => {
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
      setCvs(await cvService.listCvs())
    })
  }, [router])

  const deleteCv = async (id: string) => {
    await cvService.deleteCv(id)
    setCvs((prev) => prev.filter((cv) => cv.id !== id))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes CV</h1>
              <p className="text-muted-foreground">Gérez et créez vos CV professionnels</p>
            </div>
            <Link href="/dashboard/cvs/new">
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Nouveau CV
              </Button>
            </Link>
          </div>

          {cvs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun CV créé</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Commencez par créer votre premier CV en choisissant un modèle professionnel
                </p>
                <Link href="/dashboard/cvs/new">
                  <Button>
                    <Plus className="h-5 w-5 mr-2" />
                    Créer mon premier CV
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{cv.name}</CardTitle>
                    <CardDescription>Créé le {new Date(cv.createdAt).toLocaleDateString("fr-FR")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/cvs/${cv.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon" onClick={() => deleteCv(cv.id)} className="bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
