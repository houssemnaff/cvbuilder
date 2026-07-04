import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function CanadianTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="bg-white text-gray-900 max-w-4xl mx-auto p-8" id="cv-content-container">
      {/* Header - Pas de photo selon les standards canadiens */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-200" data-cv-block="header">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {personal.firstName} {personal.lastName}
        </h1>
        
        {/* Contact Information - Une ligne pour optimisation ATS */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-4">
          {personal.phone && (
            <span>{personal.phone}</span>
          )}
          {personal.email && (
            <>
              <span>•</span>
              <span>{personal.email}</span>
            </>
          )}
          {personal.city && (
            <>
              <span>•</span>
              <span>{personal.city}, {personal.country}</span>
            </>
          )}
          {personal.linkedin && (
            <>
              <span>•</span>
              <span className="break-all">{personal.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personal.summary && (
        <div className="mb-8" data-cv-block="summary">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personal.summary}
          </p>
        </div>
      )}

      {/* Core Competencies / Skills */}
      {skills.length > 0 && (
        <div className="mb-8" data-cv-block="skills">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map((skill) => (
              <div key={skill} className="text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experiences. length > 0 && (
        <div className="mb-8" data-cv-block="experience-title">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} data-cv-block={`experience-${exp.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-base font-semibold text-gray-700">
                      {exp.company}, {exp.location}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {exp.startDate} - {exp.current ?  "Present" : exp.endDate}
                  </div>
                </div>
                
                {exp.description && (
                  <div className="ml-4 text-gray-700">
                    <p className="leading-relaxed">{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8" data-cv-block="education-title">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            EDUCATION
          </h2>
          
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} data-cv-block={`education-${edu.id}`}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-base text-gray-700">
                      {edu.institution}, {edu.location}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                
                {edu.description && (
                  <p className="text-sm text-gray-600 ml-4 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-8" data-cv-block="languages">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            LANGUAGES
          </h2>
          
          <div className="grid grid-cols-2 md: grid-cols-3 gap-4">
            {languages.map((lang) => (
              <div key={lang. id} className="text-gray-700">
                <span className="font-semibold">{lang.name}</span>:  {lang.level}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Sections commonly used in Canadian CVs */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Certifications Section (placeholder) */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            CERTIFICATIONS
          </h2>
          <p className="text-gray-500 text-sm italic">
            Add certifications relevant to Canadian market
          </p>
        </div>

        {/* Volunteer Experience (important in Canada) */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            VOLUNTEER EXPERIENCE
          </h2>
          <p className="text-gray-500 text-sm italic">
            Volunteer work is highly valued in Canada
          </p>
        </div>
      </div>

      {/* Footer note for Canadian standards */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          References available upon request
        </p>
      </div>
    </div>
  )
}