export interface Template {
  id: string
  name: string
  description: string
  tags: string[]
  /** Whether this template has a pdfme/jsx implementation and can be previewed/exported. */
  available?: boolean
}

export const TEMPLATES: Template[] = [
  // Templates actuels
  {
    id:  "modern-minimal",
    name: "Moderne Minimaliste",
    description: "Design épuré et moderne, idéal pour les profils tech",
    tags: ["Moderne", "Tech", "Minimaliste"],
    available: true,
  },
  {
    id: "professional",
    name:  "Professionnel Classique",
    description: "Layout traditionnel pour tous les secteurs",
    tags: ["Classique", "Polyvalent", "ATS-friendly"],
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Design original pour les métiers créatifs",
    tags: ["Créatif", "Design", "Marketing"],
  },
  {
    id: "executive",
    name: "Cadre Dirigeant",
    description:  "Pour les postes de direction et management",
    tags: ["Executive", "Leadership", "Premium"],
  },
  {
    id: "two-column",
    name: "Deux Colonnes",
    description: "Organisation claire en deux colonnes",
    tags: ["Structuré", "Lisible", "Moderne"],
    available: true,
  },
  {
    id: "timeline",
    name: "Timeline",
    description:  "Mise en avant chronologique des expériences",
    tags:  ["Chronologique", "Visuel", "Clair"],
  },

  // Templates régionaux
  {
    id: "canadian",
    name:  "Style Canadien",
    description: "Format canadien standard sans photo, ATS-optimisé",
    tags: ["Canada", "ATS-friendly", "Immigration"],
  },
  {
    id: "european",
    name: "Style Européen",
    description: "Format européen avec photo et informations détaillées",
    tags: ["Europe", "Photo", "Détaillé"],
    available: true,
  },
  {
    id: "american",
    name: "Resume Américain",
    description: "Format américain concis, 1-2 pages maximum",
    tags: ["USA", "Concis", "Skills-focused"],
  },

  // Templates spécialisés
  {
    id: "academic",
    name:  "CV Académique",
    description: "Pour chercheurs, professeurs et postes universitaires",
    tags: ["Recherche", "Université", "Publications"],
    available: true,
  },
  {
    id: "developer",
    name: "Développeur",
    description: "Spécialement conçu pour les développeurs et IT",
    tags: ["Tech", "Code", "GitHub"],
  },
 /* {
    id: "sales",
    name:  "Commercial",
    description: "Orienté résultats et performances commerciales",
    tags: ["Vente", "KPI", "Résultats"],
  },
  {
    id:  "medical",
    name: "Médical",
    description:  "Pour professionnels de santé avec certifications",
    tags:  ["Santé", "Certifications", "Licence"],
  },
  {
    id:  "startup",
    name: "Startup",
    description: "Pour profils entrepreneuriaux et startup",
    tags: ["Innovation", "Agile", "Growth"],
  },
  
  // Templates par niveau
  {
    id:  "entry-level",
    name: "Débutant",
    description: "Pour nouveaux diplômés et premiers emplois",
    tags: ["Junior", "Formation", "Potentiel"],
  },
  {
    id: "senior-expert",
    name: "Expert Senior",
    description: "Pour profils très expérimentés et consultants",
    tags: ["Expert", "Consultant", "Référence"],
  },
  
  // Templates par fonction
  {
    id: "project-manager",
    name: "Chef de Projet",
    description: "Focus sur gestion de projets et méthodologies",
    tags:  ["PM", "Agile", "Projets"],
  },
  {
    id: "digital-marketing",
    name:  "Marketing Digital",
    description:  "Pour spécialistes du marketing digital et growth",
    tags:  ["Digital", "Growth", "Analytics"],
  },*/
]