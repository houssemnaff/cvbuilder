import { createClient } from "@/lib/supabase/client"

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  linkedin: string
  website: string
  summary: string
}

export interface Experience {
  id: string
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Language {
  id: string
  name: string
  level: string
}

export interface Project {
  id: string
  name: string
  link: string
  technologies: string
  description: string
}

export interface Profile {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: string[]
  languages: Language[]
  projects: Project[]
}

const EMPTY_PERSONAL_INFO: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  linkedin: "",
  website: "",
  summary: "",
}

async function requireUserId() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return { supabase, userId: user.id }
}

export const profileService = {
  async getProfile(): Promise<Profile> {
    const { supabase, userId } = await requireUserId()
    const { data, error } = await supabase
      .from("profiles")
      .select("personal_info, experiences, education, skills, languages, projects")
      .eq("id", userId)
      .maybeSingle()

    if (error) throw error

    return {
      personalInfo: { ...EMPTY_PERSONAL_INFO, ...(data?.personal_info as Partial<PersonalInfo> | null) },
      experiences: (data?.experiences as Experience[]) ?? [],
      education: (data?.education as Education[]) ?? [],
      skills: (data?.skills as string[]) ?? [],
      languages: (data?.languages as Language[]) ?? [],
      projects: (data?.projects as Project[]) ?? [],
    }
  },

  async savePersonalInfo(personalInfo: PersonalInfo) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("profiles").upsert({ id: userId, personal_info: personalInfo })
    if (error) throw error
  },

  async saveExperiences(experiences: Experience[]) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("profiles").upsert({ id: userId, experiences })
    if (error) throw error
  },

  async saveEducation(education: Education[]) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("profiles").upsert({ id: userId, education })
    if (error) throw error
  },

  async saveSkills(skills: string[]) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("profiles").upsert({ id: userId, skills })
    if (error) throw error
  },

  async saveLanguages(languages: Language[]) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("profiles").upsert({ id: userId, languages })
    if (error) throw error
  },

  async saveProjects(projects: Project[]) {
    const { supabase, userId } = await requireUserId()
    const { error } = await supabase.from("profiles").upsert({ id: userId, projects })
    if (error) throw error
  },
}
