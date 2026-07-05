import type { ReactNode } from "react"
import { ProfileProvider } from "@/components/profile/profile-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>
}
