/** @jsxImportSource @pdfme/jsx */
import type { ProfileData } from "../cv-preview"
import { Document, Page, Stack, Row, Box, Text, Image, Footer } from "@pdfme/jsx"

interface TemplateProps {
  data: ProfileData
}

const NAVY = "#1e3a5f"
const DARK = "#111827"
const BODY = "#374151"
const MUTED = "#6b7280"

function SectionTitle({ title }: { title: string }) {
  return (
    <Stack gap={1.5}>
      <Text size={11} color={NAVY} spacing={0.5}>
        {title}
      </Text>
      <Box height={0.4} background={NAVY} />
    </Stack>
  )
}

export function EuropeanTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages, projects } = data

  const fullName = `${personal.firstName} ${personal.lastName}`.trim()
  const addressLine = [personal.address, personal.postalCode, personal.city, personal.country]
    .filter(Boolean)
    .join(", ")

  const contactRows = [
    personal.phone && { label: "Téléphone", value: personal.phone },
    personal.email && { label: "Email", value: personal.email },
    addressLine && { label: "Adresse", value: addressLine },
    personal.linkedin && { label: "LinkedIn", value: personal.linkedin },
    personal.website && { label: "Site web", value: personal.website },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <Document size="A4" margin={{ x: 18, y: 16 }}>
      <Footer>
        <Text size={7} align="right" color="#94a3b8">
          {"Page {currentPage} of {totalPages}"}
        </Text>
      </Footer>

      <Page>
        <Stack gap={6}>
          {/* En-tête européen : photo à gauche, identité et coordonnées à droite */}
          <Box background="#f1f5f9" padding={6} radius={2}>
            <Row gap={8} alignItems="center">
              {personal.photo ? (
                <Image name="photo" src={personal.photo} width={28} height={34} />
              ) : (
                // Placeholder affiché tant que l'utilisateur n'a pas ajouté de photo dans son profil
                <Box
                  width={28}
                  height={34}
                  background="#e2e8f0"
                  borderColor="#94a3b8"
                  borderWidth={0.3}
                  radius={2}
                  padding={{ top: 14, x: 2 }}
                >
                  <Text size={7} color="#64748b" align="center">
                    PHOTO
                  </Text>
                </Box>
              )}
              <Box flex={1}>
                <Stack gap={2.5}>
                  <Text name="fullName" size={20} color={NAVY}>
                    {fullName}
                  </Text>
                  <Stack gap={1}>
                    {contactRows.map((row, index) => (
                      <Text name={`contact-${index}`} size={8.5} color={BODY}>
                        {`${row.label} : ${row.value}`}
                      </Text>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Row>
          </Box>

          {/* Profil */}
          {personal.summary && (
            <Stack gap={2}>
              <SectionTitle title="PROFIL" />
              <Text name="summaryBlock" size={9} lineHeight={1.5} color={BODY} overflow="expand">
                {personal.summary}
              </Text>
            </Stack>
          )}

          {/* Expériences — le titre est fusionné avec le premier item pour ne jamais rester seul en bas de page */}
          {experiences.length > 0 && (
            <Stack gap={4}>
              {experiences.map((exp, index) => (
                <Stack gap={1}>
                  {index === 0 && <SectionTitle title="EXPÉRIENCE PROFESSIONNELLE" />}
                  <Row justifyContent="space-between">
                    <Text name={`experience-${index}-position`} size={10} color={DARK}>
                      {`${exp.position} — ${exp.company}`}
                    </Text>
                    <Text name={`experience-${index}-dates`} size={9} color={MUTED} align="right">
                      {`${exp.startDate} - ${exp.current ? "Présent" : exp.endDate}`}
                    </Text>
                  </Row>
                  {exp.location && (
                    <Text name={`experience-${index}-location`} size={8.5} color={MUTED}>
                      {exp.location}
                    </Text>
                  )}
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
          )}

          {/* Formation */}
          {education.length > 0 && (
            <Stack gap={2.5}>
              {education.map((edu, index) => (
                <Stack gap={0.5}>
                  {index === 0 && <SectionTitle title="FORMATION" />}
                  <Row justifyContent="space-between">
                    <Text name={`education-${index}-degree`} size={9.5} color={DARK}>
                      {`${edu.degree} — ${edu.institution}`}
                    </Text>
                    <Text name={`education-${index}-dates`} size={9} color={MUTED} align="right">
                      {`${edu.startDate} - ${edu.endDate}`}
                    </Text>
                  </Row>
                  {edu.description && (
                    <Text name={`education-${index}-description`} size={9} lineHeight={1.4} color={BODY} overflow="expand">
                      {edu.description}
                    </Text>
                  )}
                </Stack>
              ))}
            </Stack>
          )}

          {/* Projets */}
          {projects.length > 0 && (
            <Stack gap={2.5}>
              {projects.map((project, index) => (
                <Stack gap={0.5}>
                  {index === 0 && <SectionTitle title="PROJETS" />}
                  <Row justifyContent="space-between">
                    <Text name={`project-${index}-name`} size={9.5} color={DARK}>
                      {project.name}
                    </Text>
                    {project.link && (
                      <Text name={`project-${index}-link`} size={8} color={NAVY} align="right">
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
          )}

          {/* Compétences + Langues côte à côte */}
          <Row gap={10}>
            {skills.length > 0 && (
              <Box flex={1.4}>
                <Stack gap={2}>
                  <SectionTitle title="COMPÉTENCES" />
                  <Text name="skillsText" size={9} lineHeight={1.6} color={BODY} overflow="expand">
                    {skills.map((s) => `• ${s}`).join("\n")}
                  </Text>
                </Stack>
              </Box>
            )}

            {languages.length > 0 && (
              <Box flex={1}>
                <Stack gap={2}>
                  <SectionTitle title="LANGUES" />
                  <Text name="languagesText" size={9} lineHeight={1.6} color={BODY} overflow="expand">
                    {languages.map((l) => `• ${l.name} (${l.level})`).join("\n")}
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
