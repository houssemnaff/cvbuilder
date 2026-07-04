import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function TwoColumnTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="bg-white text-gray-900 min-h-screen flex" id="cv-content-container">
      {/* Colonne Gauche - Sidebar */}
      <div className="w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white" data-cv-block="left-column">
        <div className="p-8 h-full flex flex-col">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-slate-600 rounded-full mx-auto mb-6 border-4 border-white/20"></div>
            <h1 className="text-2xl font-bold mb-2">
              {personal.firstName}
            </h1>
            <h1 className="text-2xl font-bold mb-4">
              {personal.lastName}
            </h1>
            {personal.summary && (
              <p className="text-sm leading-relaxed text-slate-200">
                {personal.summary}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/20 uppercase tracking-wide">
              Contact
            </h2>
            <div className="space-y-3">
              {personal.phone && (
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs">📱</span>
                  </div>
                  <span className="break-all">{personal.phone}</span>
                </div>
              )}
              {personal.email && (
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs">📧</span>
                  </div>
                  <span className="break-all">{personal. email}</span>
                </div>
              )}
              {personal.city && (
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs">📍</span>
                  </div>
                  <span>{personal.city}, {personal.country}</span>
                </div>
              )}
              {personal. linkedin && (
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 bg-white/20 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs">💼</span>
                  </div>
                  <span className="break-all text-xs">{personal.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/20 uppercase tracking-wide">
                Compétences
              </h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={skill} className="relative">
                    <div className="bg-white/10 rounded-lg p-3 border-l-4 border-white/40 hover:bg-white/15 transition-colors">
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {languages. length > 0 && (
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-white/20 uppercase tracking-wide">
                Langues
              </h2>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div key={lang.id} className="bg-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{lang.name}</span>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                        {lang.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Colonne Droite - Contenu Principal */}
      <div className="w-3/5 bg-white" data-cv-block="right-column">
        <div className="p-8 h-full">
          {/* Experience Section */}
          {experiences.length > 0 && (
            <div className="mb-10" data-cv-block="experience-title">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mr-4">Expérience Professionnelle</h2>
                <div className="flex-1 h-px bg-slate-300"></div>
              </div>
              
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="group" data-cv-block={`experience-${exp.id}`}>
                    <div className="bg-slate-50 rounded-lg p-6 border-l-4 border-slate-800 hover:shadow-md transition-shadow">
                      {/* Header avec position et dates */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-slate-900">
                            {exp.position}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-lg font-semibold text-slate-600">{exp.company}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-sm text-slate-600">{exp.location}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      {exp.description && (
                        <div className="mt-4">
                          <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                        </div>
                      )}
                      
                      {/* Séparateur entre expériences */}
                      {index < experiences. length - 1 && (
                        <div className="mt-6 flex justify-center">
                          <div className="w-12 h-px bg-slate-300"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education. length > 0 && (
            <div data-cv-block="education-title">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mr-4">Formation</h2>
                <div className="flex-1 h-px bg-slate-300"></div>
              </div>
              
              <div className="grid gap-6">
                {education. map((edu, index) => (
                  <div key={edu.id} className="group" data-cv-block={`education-${edu.id}`}>
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-slate-900">
                            {edu.degree}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-blue-700">{edu.institution}</p>
                            <p className="text-sm text-slate-600 flex items-center">
                              <span className="mr-1">📍</span>
                              {edu.location}
                            </p>
                          </div>
                          {edu.description && (
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                              {edu.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {edu.startDate} - {edu.endDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}