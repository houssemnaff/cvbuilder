"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import {
  profileService,
  type Profile,
  type PersonalInfo,
  type Experience,
  type Education,
  type Language,
  type Project,
} from "@/lib/services/profile-service"

interface ProfileContextValue {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  savePersonalInfo: (data: PersonalInfo) => Promise<void>
  saveExperiences: (data: Experience[]) => Promise<void>
  saveEducation: (data: Education[]) => Promise<void>
  saveSkills: (data: string[]) => Promise<void>
  saveLanguages: (data: Language[]) => Promise<void>
  saveProjects: (data: Project[]) => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await profileService.getProfile()
      setProfile(data)
    } catch (err) {
      console.error("[ProfileProvider] Failed to load profile:", err)
      setError(err instanceof Error ? err.message : "Impossible de charger le profil")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const savePersonalInfo = useCallback(async (data: PersonalInfo) => {
    await profileService.savePersonalInfo(data)
    setProfile((prev) => (prev ? { ...prev, personalInfo: data } : prev))
  }, [])

  const saveExperiences = useCallback(async (data: Experience[]) => {
    await profileService.saveExperiences(data)
    setProfile((prev) => (prev ? { ...prev, experiences: data } : prev))
  }, [])

  const saveEducation = useCallback(async (data: Education[]) => {
    await profileService.saveEducation(data)
    setProfile((prev) => (prev ? { ...prev, education: data } : prev))
  }, [])

  const saveSkills = useCallback(async (data: string[]) => {
    await profileService.saveSkills(data)
    setProfile((prev) => (prev ? { ...prev, skills: data } : prev))
  }, [])

  const saveLanguages = useCallback(async (data: Language[]) => {
    await profileService.saveLanguages(data)
    setProfile((prev) => (prev ? { ...prev, languages: data } : prev))
  }, [])

  const saveProjects = useCallback(async (data: Project[]) => {
    await profileService.saveProjects(data)
    setProfile((prev) => (prev ? { ...prev, projects: data } : prev))
  }, [])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refresh,
        savePersonalInfo,
        saveExperiences,
        saveEducation,
        saveSkills,
        saveLanguages,
        saveProjects,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider")
  return ctx
}
