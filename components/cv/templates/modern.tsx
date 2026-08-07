/** @jsxImportSource @pdfme/jsx */
import type { ProfileData } from "../cv-preview"
import { Document, Page, Stack, Row, Box, Text, Image, Footer } from "@pdfme/jsx"

interface TemplateProps {
  data: ProfileData
}

const ACCENT = "#0f766e"
const DARK = "#111827"
const BODY = "#374151"
const MUTED = "#6b7280"

// Titre de section : libellé coloré souligné d'un trait court dans la couleur d'accent
function SectionTitle({ title }: { title: string }) {
  return (
    <Stack gap={1.5}>
      <Text size={11} color={ACCENT} spacing={0.8}>
        {title}
      </Text>
      <Box height={0.6} width={14} background={ACCENT} />
    </Stack>
  )
}

export function ModernMinimalTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages, projects } = data

  const fullName = `${personal.firstName} ${personal.lastName}`.trim()
  const contactLine = [
    personal.phone,
    personal.email,
    personal.linkedin,
    personal.website,
    [personal.city, personal.country].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join("   ·   ")

  return (
    <Document size="A4" margin={{ x: 18, y: 16 }}>
      <Footer>
        <Text size={7} align="right" color="#94a3b8">
          {"Page {currentPage} of {totalPages}"}
        </Text>
      </Footer>

      <Page>
        <Stack gap={6}>
          {/* En-tête — nom en grand, ligne de contact compacte, photo à droite */}
          <Stack gap={2}>
            <Row gap={8} alignItems="center">
              <Box flex={1}>
                <Stack gap={2}>
                  <Text name="fullName" size={26} color={DARK}>
                    {fullName}
                  </Text>
                  {contactLine && (
                    <Text name="contactLine" size={8.5} color={MUTED}>
                      {contactLine}
                    </Text>
                  )}
                </Stack>
              </Box>
              {personal.photo && <Image name="photo" src={personal.photo} width={24} height={30} />}
            </Row>
            <Box height={0.8} background={ACCENT} />
          </Stack>

          {/* Profil */}
          {personal.summary && (
            <Stack gap={2}>
              <SectionTitle title="PROFIL" />
              <Text name="summaryBlock" size={9} lineHeight={1.5} color={BODY} overflow="expand">
                {personal.summary}
              </Text>
            </Stack>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <Stack gap={2}>
              <SectionTitle title="EXPÉRIENCE PROFESSIONNELLE" />
              <Stack gap={4}>
                {experiences.map((exp, index) => (
                  <Stack gap={1}>
                    <Row justifyContent="space-between">
                      <Text name={`experience-${index}-position`} size={10} color={DARK}>
                        {exp.position}
                      </Text>
                      <Text name={`experience-${index}-dates`} size={9} color={MUTED} align="right">
                        {`${exp.startDate} - ${exp.current ? "Présent" : exp.endDate}`}
                      </Text>
                    </Row>
                    <Text name={`experience-${index}-company`} size={9} color={ACCENT}>
                      {[exp.company, exp.location].filter(Boolean).join(" — ")}
                    </Text>
                    {exp.description && (
                      <Text
                        name={`experience-${index}-block`}
                        size={9}
                        lineHeight={1.5}
                        color={BODY}
                        overflow="expand"
                      >
                        {exp.description
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => `• ${line}`)
                          .join("\n")}
                      </Text>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <Stack gap={2}>
              <SectionTitle title="FORMATION" />
              <Stack gap={2.5}>
                {education.map((edu, index) => (
                  <Stack gap={0.5}>
                    <Row justifyContent="space-between">
                      <Text name={`education-${index}-degree`} size={9.5} color={DARK}>
                        {edu.degree}
                      </Text>
                      <Text name={`education-${index}-dates`} size={9} color={MUTED} align="right">
                        {`${edu.startDate} - ${edu.endDate}`}
                      </Text>
                    </Row>
                    <Text name={`education-${index}-institution`} size={9} color={BODY}>
                      {[edu.institution, edu.location].filter(Boolean).join(" — ")}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Projets */}
          {projects.length > 0 && (
            <Stack gap={2}>
              <SectionTitle title="PROJETS" />
              <Stack gap={2.5}>
                {projects.map((project, index) => (
                  <Stack gap={0.5}>
                    <Row justifyContent="space-between">
                      <Text name={`project-${index}-name`} size={9.5} color={DARK}>
                        {project.name}
                      </Text>
                      {project.link && (
                        <Text name={`project-${index}-link`} size={8} color={ACCENT} align="right">
                          {project.link}
                        </Text>
                      )}
                    </Row>
                    {project.technologies && (
                      <Text name={`project-${index}-technologies`} size={8} color={MUTED}>
                        {project.technologies}
                      </Text>
                    )}
                    {project.description && (
                      <Text
                        name={`project-${index}-block`}
                        size={9}
                        lineHeight={1.5}
                        color={BODY}
                        overflow="expand"
                      >
                        {project.description
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => `• ${line}`)
                          .join("\n")}
                      </Text>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Compétences + Langues côte à côte */}
          <Row gap={10}>
            {skills.length > 0 && (
              <Box flex={1.4}>
                <Stack gap={2}>
                  <SectionTitle title="COMPÉTENCES" />
                  <Text name="skillsText" size={9} lineHeight={1.6} color={BODY} overflow="expand">
                    {skills.join("   •   ")}
                  </Text>
                </Stack>
              </Box>
            )}

            {languages.length > 0 && (
              <Box flex={1}>
                <Stack gap={2}>
                  <SectionTitle title="LANGUES" />
                  <Text name="languagesText" size={9} lineHeight={1.6} color={BODY} overflow="expand">
                    {languages.map((l) => `${l.name} (${l.level})`).join("\n")}
                  </Text>
                </Stack>
              </Box>
            )}
          </Row>
        </Stack>
      </Page>
    </Document>
  )
}
