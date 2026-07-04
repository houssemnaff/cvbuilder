"use client"

import { useEffect, useState } from "react"
import { ModernMinimalTemplate } from "./templates/modern-minimal"
import { ProfessionalTemplate } from "./templates/professional"
import { CreativeTemplate } from "./templates/creative"
import { ExecutiveTemplate } from "./templates/executive"
import { TimelineTemplate } from "./templates/timeline"
import { TwoColumnTemplate } from "./templates/towcolumn"
import { CanadianTemplate } from "./templates/canadian"
import { AcademicTemplate } from "./templates/academic"
import { DeveloperTemplate } from "./templates/developper"
import { PaginatedTemplatePreview } from "./paginated-template-preview"

interface CVPreviewProps {
  templateId: string
  profileData?: ProfileData
}

export interface ProfileData {
  personal: {
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
  experiences: Array<{
    id: string
    position: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  languages: Array<{
    id: string
    name: string
    level: string
  }>
}

const EMPTY_PROFILE_DATA: ProfileData = {
  personal: {
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
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
}

export function CVPreview({ templateId, profileData: profileDataProp }: CVPreviewProps) {
  const [localProfileData, setLocalProfileData] = useState<ProfileData>(EMPTY_PROFILE_DATA)

  useEffect(() => {
    if (profileDataProp) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const personal = localStorage.getItem("profile_personal")
      const experiences = localStorage.getItem("profile_experiences")
      const education = localStorage.getItem("profile_education")
      const skills = localStorage.getItem("profile_skills")
      const languages = localStorage.getItem("profile_languages")

      setLocalProfileData({
        personal: personal ? JSON.parse(personal) : EMPTY_PROFILE_DATA.personal,
        experiences: experiences ? JSON.parse(experiences) : [],
        education: education ? JSON.parse(education) : [],
        skills: skills ? JSON.parse(skills) : [],
        languages: languages ? JSON.parse(languages) : [],
      })
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [profileDataProp])

  const effectiveProfileData = profileDataProp ?? localProfileData

  const renderTemplate = () => {
    switch (templateId) {
      case "modern-minimal":
        return <ModernMinimalTemplate data={effectiveProfileData} />
      case "professional":
        return <ProfessionalTemplate data={effectiveProfileData} />
      case "creative":
        return <CreativeTemplate data={effectiveProfileData} />
      case "executive":
        return <ExecutiveTemplate data={effectiveProfileData} />
      case "two-column":
        return <TwoColumnTemplate data={effectiveProfileData} />
      case "timeline":
        return <TimelineTemplate data={effectiveProfileData} />
      case "canadian":
        return <CanadianTemplate data={effectiveProfileData} />

      case "academic":
        return <AcademicTemplate data={effectiveProfileData} />
      case "developer":
        return <DeveloperTemplate data={effectiveProfileData} />
      default:
        return <ModernMinimalTemplate data={effectiveProfileData} />
    }
  }

  return <PaginatedTemplatePreview>{renderTemplate()}</PaginatedTemplatePreview>
}
