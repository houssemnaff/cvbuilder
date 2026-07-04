import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="flex text-gray-900 bg-white" id="cv-content-container">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-800 text-white p-8 cv-section" data-cv-block="sidebar">
        <div className="mb-8" data-cv-block="sidebar-contact">
          <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-center">
            {personal.firstName}
            <br />
            {personal.lastName}
          </h1>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-gray-600 pb-2">Contact</h2>
          <div className="space-y-2 text-sm">
            {personal.phone && <p className="wrap-break-word">{personal.phone}</p>}
            {personal.email && <p className="wrap-break-word">{personal.email}</p>}
            {personal.city && (
              <p>
                {personal.city}, {personal.country}
              </p>
            )}
            {personal.linkedin && <p className="wrap-break-word text-xs">{personal.linkedin}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8" data-cv-block="sidebar-skills">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-gray-600 pb-2">
              Compétences
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill} className="text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div data-cv-block="sidebar-languages">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-gray-600 pb-2">Langues</h2>
            <div className="space-y-2 text-sm">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <strong>{lang.name}</strong>
                  <div className="text-xs text-gray-400">{lang.level}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8" data-cv-block="main-column">
        {/* Summary */}
        {personal.summary && (
          <div className="mb-8" data-cv-block="summary">
            <h2 className="text-xl font-bold mb-3 text-gray-800">À propos</h2>
            <p className="text-sm leading-relaxed text-gray-700">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-8 cv-section" data-cv-block="experience-title">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Expérience</h2>
            <div className="space-y-6 relative pl-6 border-l-2 border-gray-300">
              {experiences.map((exp) => (
                <div key={exp.id} className="cv-item break-inside-avoid relative" data-cv-block={`experience-${exp.id}`}>
                  <div className="absolute -left-6.75 w-3 h-3 bg-gray-800 rounded-full"></div>
                  <div className="mb-1">
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <p className="text-sm font-medium text-gray-700">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div data-cv-block="education-title">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Formation</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} data-cv-block={`education-${edu.id}`}>
                  <h3 className="font-bold text-base">{edu.degree}</h3>
                  <p className="text-sm font-medium text-gray-700">
                    {edu.institution} • {edu.location}
                  </p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
