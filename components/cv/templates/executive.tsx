import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function ExecutiveTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="bg-white text-gray-900 max-w-4xl mx-auto" id="cv-content-container">
      {/* Header Section */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 text-white p-8" data-cv-block="header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {personal.firstName} {personal.lastName}
            </h1>
            <div className="text-xl font-light opacity-90 mb-4">
              Cadre Dirigeant
            </div>
            {personal.summary && (
              <p className="text-base leading-relaxed max-w-3xl opacity-95">
                {personal.summary}
              </p>
            )}
          </div>
          <div className="w-32 h-32 bg-slate-600 rounded-lg shrink-0"></div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-600">
          {personal.email && (
            <div className="flex items-center text-sm">
              <span className="font-medium">Email:</span>
              <span className="ml-2">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center text-sm">
              <span className="font-medium">Téléphone:</span>
              <span className="ml-2">{personal.phone}</span>
            </div>
          )}
          {personal.city && (
            <div className="flex items-center text-sm">
              <span className="font-medium">Localisation:</span>
              <span className="ml-2">{personal. city}, {personal.country}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center text-sm">
              <span className="font-medium">LinkedIn:</span>
              <span className="ml-2 break-all">{personal.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Experience Section */}
        {experiences.length > 0 && (
          <div className="mb-10" data-cv-block="experience-title">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-slate-800 mr-4"></div>
              <h2 className="text-2xl font-bold text-slate-800">Expérience Professionnelle</h2>
            </div>
            
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative" data-cv-block={`experience-${exp.id}`}>
                  {index !== experiences.length - 1 && (
                    <div className="absolute left-6 top-20 w-px h-full bg-gray-200"></div>
                  )}
                  
                  <div className="flex">
                    <div className="shrink-0 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm mr-6">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{exp.position}</h3>
                            <p className="text-lg font-semibold text-slate-600">{exp.company}</p>
                            <p className="text-sm text-gray-600">{exp. location}</p>
                          </div>
                          <div className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {exp.startDate} - {exp. current ? "Présent" : exp.endDate}
                          </div>
                        </div>
                        
                        {exp.description && (
                          <div className="mt-4 text-gray-700 leading-relaxed">
                            <p>{exp.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <div data-cv-block="education-title">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-slate-800 mr-4"></div>
                <h2 className="text-2xl font-bold text-slate-800">Formation</h2>
              </div>
              
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-slate-200 pl-6 pb-6" data-cv-block={`education-${edu.id}`}>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{edu.degree}</h3>
                    <p className="text-base font-semibold text-slate-600 mb-1">{edu.institution}</p>
                    <p className="text-sm text-gray-600 mb-2">{edu.location}</p>
                    <p className="text-sm font-medium text-slate-700">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Languages */}
          <div data-cv-block="skills-languages">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-8" data-cv-block="skills">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-slate-800 mr-4"></div>
                  <h2 className="text-2xl font-bold text-slate-800">Compétences Clés</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {skills.map((skill) => (
                    <div key={skill} className="bg-linear-to-r from-slate-50 to-gray-50 p-3 rounded-lg border-l-4 border-slate-800">
                      <span className="font-medium text-slate-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div data-cv-block="languages">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-8 bg-slate-800 mr-4"></div>
                  <h2 className="text-2xl font-bold text-slate-800">Langues</h2>
                </div>
                
                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-slate-800">{lang.name}</span>
                      <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}