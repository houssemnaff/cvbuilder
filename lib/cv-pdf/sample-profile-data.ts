import type { ProfileData } from "@/components/cv/cv-preview"

export const SAMPLE_PROFILE_DATA: ProfileData = {
  personal: {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    address: "12 rue de la Paix",
    city: "Paris",
    postalCode: "75002",
    country: "France",
    linkedin: "linkedin.com/in/jeandupont",
    website: "",
    summary:
      "Développeur full-stack avec 5 ans d'expérience en création d'applications web et d'API scalables. Spécialisé en architecture microservices et en optimisation de performance.",
  },
  experiences: [
    {
      id: "exp1",
      position: "Lead Developer",
      company: "TechCorp",
      location: "Paris",
      startDate: "2022",
      endDate: "",
      current: true,
      description: "Direction technique d'une équipe de 5 développeurs, mise en place de l'architecture microservices.",
    },
    {
      id: "exp2",
      position: "Développeur Full-Stack",
      company: "StartupXYZ",
      location: "Lyon",
      startDate: "2019",
      endDate: "2022",
      current: false,
      description: "Développement d'applications web avec React et Node.js.",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "Master Informatique",
      institution: "Université Paris-Saclay",
      location: "Paris",
      startDate: "2015",
      endDate: "2017",
      description: "",
    },
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
  languages: [
    { id: "lang1", name: "Français", level: "Natif" },
    { id: "lang2", name: "Anglais", level: "Courant" },
  ],
}
