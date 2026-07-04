"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"
import { ExperienceSection } from "@/components/profile/experience-section"
import { EducationSection } from "@/components/profile/education-section"
import { SkillsSection } from "@/components/profile/skills-section"
import { LanguagesSection } from "@/components/profile/languages-section"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">
              Centralisez toutes vos informations ici. Elles seront utilisées pour générer tous vos CV.
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="experience">Expériences</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="languages">Langues</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>Vos coordonnées et informations de contact</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Expériences Professionnelles</CardTitle>
                  <CardDescription>Ajoutez vos postes et responsabilités</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExperienceSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Formation</CardTitle>
                  <CardDescription>Vos diplômes et certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <EducationSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Compétences</CardTitle>
                  <CardDescription>Techniques, logiciels, et savoir-faire</CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages">
              <Card>
                <CardHeader>
                  <CardTitle>Langues</CardTitle>
                  <CardDescription>Langues parlées et niveau de maîtrise</CardDescription>
                </CardHeader>
                <CardContent>
                  <LanguagesSection />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Link href="/dashboard/cvs/new">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Créer un CV
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
