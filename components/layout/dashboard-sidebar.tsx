"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FileText, LayoutTemplate, User, LogOut, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { authService } from "@/lib/services/auth-service"

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
    href: "/dashboard/templates",
    icon: LayoutTemplate,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await authService.signOut()
    router.push("/")
    router.refresh()
  }

  const navigation = (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
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
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">CVBuilder AI</span>
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-6 w-6 text-primary" />
                CVBuilder AI
              </SheetTitle>
            </SheetHeader>
            {navigation}
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">CVBuilder AI</span>
          </Link>
        </div>
        {navigation}
      </aside>
    </>
  )
}
