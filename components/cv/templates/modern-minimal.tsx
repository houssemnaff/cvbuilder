import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function ModernMinimalTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    // Ajoutez un ID pour cibler le conteneur principal plus facilement
    <div className="p-12 text-gray-900 bg-white" id="cv-content-container">
      
      {/* Header - Toujours un bloc unique */}
      <div className="mb-8 border-b-2 border-gray-900 pb-6 cv-section" data-cv-block="header">
        <h1 className="text-4xl font-bold mb-2">
          {personal.firstName} {personal.lastName}
        </h1>
        {/* ... reste du header ... */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.city && <span>{personal.city}, {personal.country}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-8 cv-section" data-cv-block="summary">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wider">Profil</h2>
          <p className="text-sm leading-relaxed text-gray-700">{personal.summary}</p>
        </div>
      )}

      {/* Experience - Notez la classe 'cv-item' sur chaque expérience individuelle */}
      {experiences.length > 0 && (
        <div className="mb-8 cv-section" data-cv-block="experience-title">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Expérience Professionnelle</h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="cv-item break-inside-avoid" data-cv-block={`experience-${exp.id}`}> {/* AJOUT IMPORTANT */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {exp.company} • {exp.location}
                </p>
                {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education - Pareil pour les items education */}
      {education.length > 0 && (
        <div className="mb-8 cv-section" data-cv-block="education-title">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Formation</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="cv-item break-inside-avoid" data-cv-block={`education-${edu.id}`}> {/* AJOUT IMPORTANT */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-base">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {/* ... reste education ... */}
                <p className="text-sm font-medium text-gray-700">
                  {edu.institution} • {edu.location}
                </p>
                {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8 cv-section" data-cv-block="skills">
           {/* ... contenu skills ... */}
           <h2 className="text-xl font-bold mb-3 uppercase tracking-wider">Compétences</h2>
           <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="text-sm bg-gray-100 px-3 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="cv-section" data-cv-block="languages">
           {/* ... contenu languages ... */}
           <h2 className="text-xl font-bold mb-3 uppercase tracking-wider">Langues</h2>
         <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <span key={lang.id} className="text-sm">
                <strong>{lang.name}</strong> : {lang.level}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}