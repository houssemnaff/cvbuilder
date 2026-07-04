import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function AcademicTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="bg-white text-gray-900 max-w-5xl mx-auto p-8" id="cv-content-container">
      {/* Header académique */}
      <div className="text-center mb-8 pb-6 border-b-2 border-blue-800" data-cv-block="header">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">
          {personal.firstName} {personal.lastName}
        </h1>
        <div className="text-lg text-gray-700 mb-4">
          PhD, Researcher & Academic Professional
        </div>
        
        {/* Contact académique */}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>• ☎ {personal.phone}</span>}
          {personal. city && <span>• 📍 {personal.city}, {personal.country}</span>}
          {personal.linkedin && <span>• 🔗 LinkedIn</span>}
          <span>• 📚 ORCID:  0000-0000-0000-0000</span>
        </div>
      </div>

      {/* Research Interests */}
      {personal.summary && (
        <div className="mb-8" data-cv-block="summary">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
            RESEARCH INTERESTS
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {personal.summary}
          </p>
        </div>
      )}

      {/* Education - Section principale pour académiques */}
      {education. length > 0 && (
        <div className="mb-8" data-cv-block="education-title">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
            EDUCATION
          </h2>
          
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="pl-6 border-l-4 border-blue-300" data-cv-block={`education-${edu.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-lg font-semibold text-blue-700">{edu.institution}</p>
                    <p className="text-base text-gray-600">{edu.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                      {edu.startDate} - {edu. endDate}
                    </span>
                  </div>
                </div>
                
                {edu.description && (
                  <div className="mt-3 bg-blue-50 p-4 rounded">
                    <p className="text-gray-700 italic">Dissertation: {edu.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Experience */}
      {experiences.length > 0 && (
        <div className="mb-8" data-cv-block="experience-title">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
            ACADEMIC APPOINTMENTS
          </h2>
          
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500" data-cv-block={`experience-${exp.id}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-lg font-semibold text-green-700">{exp.company}</p>
                    <p className="text-base text-gray-600">{exp.location}</p>
                  </div>
                  <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                
                {exp.description && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    <p>{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8" data-cv-block="lower-grid">
        {/* Publications */}
        <div className="lg:col-span-2 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-blue-200">
            SELECTED PUBLICATIONS
          </h2>
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="text-gray-600 italic">
              <p>• Author, A., Author, B.  (2024). "Research Title." Journal Name, 42(3), 123-145.</p>
              <p>• Author, A.  (2023). "Conference Paper Title." Proceedings of Academic Conference, 15-28.</p>
              <p>• Author, A., et al. (2023). Book Title. Academic Publisher. </p>
            </div>
          </div>
        </div>

        {/* Research Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b border-blue-200">
              RESEARCH SKILLS & METHODS
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <span className="text-gray-800 font-medium">• {skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b border-blue-200">
              LANGUAGES
            </h2>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                  <span className="font-semibold text-gray-800">{lang.name}</span>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Academic Sections */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200">
            GRANTS & AWARDS
          </h2>
          <p className="text-sm text-gray-500 italic">Research funding and recognitions</p>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200">
            CONFERENCES
          </h2>
          <p className="text-sm text-gray-500 italic">Presentations and participation</p>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200">
            MEMBERSHIPS
          </h2>
          <p className="text-sm text-gray-500 italic">Professional associations</p>
        </div>
      </div>
    </div>
  )
}