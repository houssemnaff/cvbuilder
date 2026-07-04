import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function TimelineTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="bg-white text-gray-900 max-w-5xl mx-auto" id="cv-content-container">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8" data-cv-block="header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-full shrink-0"></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {personal.firstName} {personal.lastName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                {personal.email && <span>📧 {personal.email}</span>}
                {personal.phone && <span>📱 {personal.phone}</span>}
                {personal.city && <span>📍 {personal.city}, {personal.country}</span>}
              </div>
              {personal.linkedin && (
                <div className="mt-2 text-xs opacity-80 break-all">
                  🔗 {personal.linkedin}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {personal.summary && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-base leading-relaxed opacity-95 max-w-4xl">
              {personal.summary}
            </p>
          </div>
        )}
      </div>

      <div className="p-8">
        {/* Timeline principale - Expériences */}
        {experiences.length > 0 && (
          <div className="mb-12" data-cv-block="experience-title">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-sm">💼</span>
              </div>
              Parcours Professionnel
            </h2>
            
            <div className="relative">
              {/* Ligne temporelle principale */}
              <div className="absolute left-8 top-0 w-0.5 h-full bg-linear-to-b from-blue-600 to-indigo-400"></div>
              
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative flex items-start" data-cv-block={`experience-${exp.id}`}>
                    {/* Point sur la timeline */}
                    <div className="absolute left-6 flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md z-10"></div>
                      {/* Date badge */}
                      <div className="mt-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                        {exp.startDate}
                      </div>
                    </div>
                    
                    {/* Contenu de l'expérience */}
                    <div className="ml-16 flex-1">
                      <div className="bg-linear-to-r from-gray-50 to-blue-50 p-6 rounded-lg border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{exp.position}</h3>
                            <p className="text-lg font-semibold text-blue-700 mb-1">{exp. company}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              📍 {exp.location}
                            </p>
                          </div>
                          
                          <div className="ml-4 text-right">
                            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                              {exp.current ? "En cours" : exp.endDate}
                            </div>
                            {/* Durée calculée */}
                            <div className="text-xs text-gray-500 mt-1">
                              {/* Vous pouvez ajouter ici le calcul de durée */}
                            </div>
                          </div>
                        </div>
                        
                        {exp.description && (
                          <div className="mt-4 text-gray-700 leading-relaxed bg-white p-4 rounded-md">
                            <p>{exp.description}</p>
                          </div>
                        )}
                        
                        {/* Indicateur de continuité */}
                        {index < experiences.length - 1 && (
                          <div className="absolute -bottom-4 left-6 w-4 h-8 flex justify-center">
                            <div className="w-px bg-linear-to-b from-blue-400 to-transparent h-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formation avec mini-timeline */}
          {education.length > 0 && (
            <div className="lg:col-span-2" data-cv-block="education-title">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-6 h-6 bg-indigo-600 rounded-full mr-3 flex items-center justify-center">
                  <span className="text-white text-xs">🎓</span>
                </div>
                Formation
              </h2>
              
              <div className="relative">
                <div className="absolute left-3 top-0 w-0.5 h-full bg-indigo-200"></div>
                
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="relative flex items-start" data-cv-block={`education-${edu.id}`}>
                      <div className="absolute left-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></div>
                      
                      <div className="ml-8 bg-indigo-50 p-4 rounded-lg flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                            <p className="text-sm font-semibold text-indigo-700">{edu.institution}</p>
                            <p className="text-xs text-gray-600">📍 {edu.location}</p>
                          </div>
                          <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Compétences et Langues */}
          <div className="space-y-8" data-cv-block="sidebar">
            {/* Compétences */}
            {skills. length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-600 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                  Compétences
                </h2>
                
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={skill} className="flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                      <span className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium flex-1 border-l-2 border-green-600">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-purple-600 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-white text-xs">🌍</span>
                  </div>
                  Langues
                </h2>
                
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-600">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">{lang.name}</span>
                        <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
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
      </div>
    </div>
  )
}