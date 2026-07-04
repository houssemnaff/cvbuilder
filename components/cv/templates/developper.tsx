import type { ProfileData } from "../cv-preview"

interface TemplateProps {
  data: ProfileData
}

export function DeveloperTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  return (
    <div className="bg-gray-900 text-white min-h-screen" id="cv-content-container">
      {/* Terminal-style header */}
      <div className="bg-black p-6" data-cv-block="header">
        <div className="flex items-center mb-4">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 font-mono text-sm">developer-cv. json</span>
        </div>
        
        <div className="font-mono">
          <div className="text-green-400 text-sm mb-2">$ whoami</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {personal.firstName} {personal. lastName}
          </h1>
          <div className="text-cyan-400 text-lg mb-4">Full Stack Developer</div>
          
          {/* Contact info en style code */}
          <div className="text-sm text-gray-300 space-y-1">
            <div><span className="text-purple-400">email:</span> "{personal.email}"</div>
            <div><span className="text-purple-400">phone:</span> "{personal.phone}"</div>
            <div><span className="text-purple-400">location:</span> "{personal.city}, {personal.country}"</div>
            <div><span className="text-purple-400">linkedin:</span> "{personal.linkedin}"</div>
            <div><span className="text-purple-400">github:</span> "github.com/username"</div>
          </div>
        </div>
      </div>

      <div className="p-8" data-cv-block="main-content">
        {/* About section */}
        {personal.summary && (
          <div className="mb-8" data-cv-block="summary">
            <div className="flex items-center mb-4">
              <span className="text-green-400 font-mono mr-2">// </span>
              <h2 className="text-xl font-bold text-white">About Me</h2>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500 font-mono">
              <p className="text-gray-300 leading-relaxed">{personal.summary}</p>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {skills.length > 0 && (
          <div className="mb-8" data-cv-block="skills">
            <div className="flex items-center mb-4">
              <span className="text-green-400 font-mono mr-2">// </span>
              <h2 className="text-xl font-bold text-white">Tech Stack</h2>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills. map((skill) => (
                  <div key={skill} className="flex items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-gray-200 font-mono text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences. length > 0 && (
          <div className="mb-8" data-cv-block="experience-title">
            <div className="flex items-center mb-4">
              <span className="text-green-400 font-mono mr-2">// </span>
              <h2 className="text-xl font-bold text-white">Work Experience</h2>
            </div>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="bg-gray-800 rounded-lg border-l-4 border-cyan-500" data-cv-block={`experience-${exp.id}`}>
                  <div className="p-6">
                    {/* Code-style header */}
                    <div className="font-mono text-sm text-gray-400 mb-2">
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-yellow-400">job{index + 1}</span> = {'{'}
                    </div>
                    
                    <div className="ml-4 mb-4">
                      <div className="font-mono text-sm space-y-1">
                        <div><span className="text-blue-400">position:</span> <span className="text-green-300">"{exp.position}"</span></div>
                        <div><span className="text-blue-400">company:</span> <span className="text-green-300">"{exp.company}"</span></div>
                        <div><span className="text-blue-400">location:</span> <span className="text-green-300">"{exp.location}"</span></div>
                        <div><span className="text-blue-400">duration:</span> <span className="text-green-300">"{exp. startDate} - {exp.current ? 'present' : exp.endDate}"</span></div>
                      </div>
                    </div>
                    
                    {exp.description && (
                      <div className="ml-4 mb-2">
                        <div className="font-mono text-sm text-blue-400 mb-2">description:  [</div>
                        <div className="ml-4 bg-gray-900 p-4 rounded text-gray-300 text-sm leading-relaxed">
                          {exp.description}
                        </div>
                        <div className="font-mono text-sm text-blue-400">]</div>
                      </div>
                    )}
                    
                    <div className="font-mono text-sm text-gray-400">{'}'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <div data-cv-block="education-title">
              <div className="flex items-center mb-4">
                <span className="text-green-400 font-mono mr-2">// </span>
                <h2 className="text-xl font-bold text-white">Education</h2>
              </div>
              
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500" data-cv-block={`education-${edu.id}`}>
                    <div className="font-mono">
                      <div className="text-sm text-purple-400 mb-2">class Education {'{'}  </div>
                      <div className="ml-4 space-y-1 text-sm">
                        <div><span className="text-blue-400">degree:</span> <span className="text-green-300">"{edu.degree}"</span></div>
                        <div><span className="text-blue-400">school:</span> <span className="text-green-300">"{edu. institution}"</span></div>
                        <div><span className="text-blue-400">year:</span> <span className="text-green-300">"{edu. startDate}-{edu.endDate}"</span></div>
                      </div>
                      <div className="text-sm text-purple-400 mt-2">{'}'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div data-cv-block="languages">
              <div className="flex items-center mb-4">
                <span className="text-green-400 font-mono mr-2">// </span>
                <h2 className="text-xl font-bold text-white">Languages</h2>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-500">
                <div className="font-mono text-sm">
                  <div className="text-purple-400 mb-2">languages = {'{'}  </div>
                  <div className="ml-4 space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.id}>
                        <span className="text-blue-400">{lang.name. toLowerCase()}:</span>{' '}
                        <span className="text-green-300">"{lang.level}"</span>,
                      </div>
                    ))}
                  </div>
                  <div className="text-purple-400 mt-2">{'}'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projects section */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <span className="text-green-400 font-mono mr-2">// </span>
            <h2 className="text-xl font-bold text-white">Featured Projects</h2>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-red-500">
            <div className="font-mono text-sm text-gray-400">
              <div># Clone repositories to see my work</div>
              <div className="mt-2 text-cyan-400">
                $ git clone https://github.com/username/awesome-project.git
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center font-mono text-sm text-gray-500">
          <div>// Thank you for reviewing my profile</div>
          <div>// Let's build something amazing together!  🚀</div>
        </div>
      </div>
    </div>
  )
}