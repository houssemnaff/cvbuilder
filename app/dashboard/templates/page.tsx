"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { TemplateGrid } from "@/components/cv/template-grid"
import { authService, type AuthUser } from "@/lib/services/auth-service"

export default function DashboardTemplatesPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Templates</h1>
            <p className="text-muted-foreground">
              Parcourez les modèles disponibles, puis créez un CV avec celui qui vous plaît.
            </p>
          </div>

          <TemplateGrid ctaHref="/dashboard/cvs/new" />
        </div>
      </main>
    </div>
  )
}
