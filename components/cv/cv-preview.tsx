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
    /** Photo de profil en data URL, optionnelle (seuls certains templates l'affichent). */
    photo?: string
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
  projects: Array<{
    id: string
    name: string
    link: string
    technologies: string
    description: string
  }>
}
