"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Save, Check } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"
import { ExperienceSection } from "@/components/profile/experience-section"
import { EducationSection } from "@/components/profile/education-section"
import { SkillsSection } from "@/components/profile/skills-section"
import { LanguagesSection } from "@/components/profile/languages-section"
import { ProjectSelection } from "@/components/profile/project-selection"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import type { SectionHandle } from "@/components/profile/section-handle"
import { authService, type AuthUser } from "@/lib/services/auth-service"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  const personalRef = useRef<SectionHandle>(null)
  const experienceRef = useRef<SectionHandle>(null)
  const educationRef = useRef<SectionHandle>(null)
  const skillsRef = useRef<SectionHandle>(null)
  const languagesRef = useRef<SectionHandle>(null)
  const projectsRef = useRef<SectionHandle>(null)

  const [savedSection, setSavedSection] = useState<string | null>(null)
  const savedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSave = async (section: string, ref: React.RefObject<SectionHandle | null>) => {
    await ref.current?.save()
    setSavedSection(section)
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    savedTimeoutRef.current = setTimeout(() => setSavedSection(null), 1500)
  }

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
      }
    })
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">
              Centralisez toutes vos informations ici. Elles seront utilisées pour générer tous vos CV.
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full h-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="experience">Expériences</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
               <TabsTrigger value="projects">Projets</TabsTrigger>
              <TabsTrigger value="languages">Langues</TabsTrigger>
             
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>Vos coordonnées et informations de contact</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave("personal", personalRef)}
                    title="Sauvegarder"
                  >
                    {savedSection === "personal" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <ProfileForm ref={personalRef} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>Expériences Professionnelles</CardTitle>
                    <CardDescription>Ajoutez vos postes et responsabilités</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave("experience", experienceRef)}
                    title="Sauvegarder"
                  >
                    {savedSection === "experience" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <ExperienceSection ref={experienceRef} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>Formation</CardTitle>
                    <CardDescription>Vos diplômes et certifications</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave("education", educationRef)}
                    title="Sauvegarder"
                  >
                    {savedSection === "education" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <EducationSection ref={educationRef} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>Compétences</CardTitle>
                    <CardDescription>Techniques, logiciels, et savoir-faire</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave("skills", skillsRef)}
                    title="Sauvegarder"
                  >
                    {savedSection === "skills" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <SkillsSection ref={skillsRef} />
                </CardContent>
              </Card>
            </TabsContent>


              <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>Projets</CardTitle>
                    <CardDescription>Vos projets personnels ou professionnels</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave("projects", projectsRef)}
                    title="Sauvegarder"
                  >
                    {savedSection === "projects" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <ProjectSelection ref={projectsRef} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>Langues</CardTitle>
                    <CardDescription>Langues parlées et niveau de maîtrise</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave("languages", languagesRef)}
                    title="Sauvegarder"
                  >
                    {savedSection === "languages" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <LanguagesSection ref={languagesRef} />
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
