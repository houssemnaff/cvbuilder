import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function ProfessionalTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="p-12 text-gray-900 bg-white" id="cv-content-container">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-300 cv-section break-inside-avoid" data-cv-block="header">
        <h1 className="text-3xl font-bold mb-3">
          {personal.firstName} {personal.lastName}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            {personal.address && <span>{personal.address}, </span>}
            {personal.city} {personal.postalCode} {personal.country}
          </div>
          <div className="flex justify-center gap-4">
            {personal.phone && <span>{personal.phone}</span>}
            {personal.email && <span>•</span>}
            {personal.email && <span>{personal.email}</span>}
          </div>
          {personal.linkedin && <div>{personal.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-6 cv-section break-inside-avoid" data-cv-block="summary">
          <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">RÉSUMÉ PROFESSIONNEL</h2>
          <p className="text-sm leading-relaxed text-gray-700">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6 cv-section" data-cv-block="experience-title">
          <h2 className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-300 pb-1">
            EXPÉRIENCE PROFESSIONNELLE
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="cv-item break-inside-avoid" data-cv-block={`experience-${exp.id}`}>
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700 mb-2">
                  {exp.company}, {exp.location}
                </p>
                {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6 cv-section" data-cv-block="education-title">
          <h2 className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-300 pb-1">FORMATION</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="cv-item break-inside-avoid" data-cv-block={`education-${edu.id}`}>
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700">
                  {edu.institution}, {edu.location}
                </p>
                {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills and Languages */}
      <div className="grid grid-cols-2 gap-6 cv-section break-inside-avoid" data-cv-block="skills-languages-grid">
        {skills.length > 0 && (
          <div className="cv-item break-inside-avoid" data-cv-block="skills">
            <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">COMPÉTENCES</h2>
            <ul className="text-sm space-y-1">
              {skills.map((skill) => (
                <li key={skill}>• {skill}</li>
              ))}
            </ul>
          </div>
        )}

        {languages.length > 0 && (
          <div className="cv-item break-inside-avoid" data-cv-block="languages">
            <h2 className="text-lg font-bold mb-2 text-gray-800 border-b border-gray-300 pb-1">LANGUES</h2>
            <ul className="text-sm space-y-1">
              {languages.map((lang) => (
                <li key={lang.id}>
                  • {lang.name} - {lang.level}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
