"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, LayoutTemplate, User, LogOut, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { authService } from "@/lib/services/auth-service"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await authService.signOut()
    router.push("/")
    router.refresh()
  }

  const navItems = [
   
    {
      title: "Mon Profil",
      href: "/dashboard",
      icon: User,
    },
    {
      title: "Mes CV",
      href: "/dashboard/cvs",
      icon: FileText,
    },
    {
      title: "Templates",
      href: "/templates",
      icon: LayoutTemplate,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">CVBuilder AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-secondary text-secondary-foreground")}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
