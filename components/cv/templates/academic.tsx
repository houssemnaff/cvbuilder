/** @jsxImportSource @pdfme/jsx */
import type { ProfileData } from "../cv-preview"
import { Document, Page, Stack, Row, Box, Text, MultiVariableText, Footer } from "@pdfme/jsx"

interface TemplateProps {
  data: ProfileData
}

// Ligne horizontale fine (pas de composant Line natif → Box utilisé comme séparateur)
function HR() {
  return <Box  height={0.3} background="#d1d5db" />
}

export function AcademicTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  const fullName = `${personal.firstName} ${personal.lastName}`.trim()
  const contactLine1 = [personal.address, personal.city, personal.postalCode, personal.country]
    .filter(Boolean)
    .join(", ")

  return (
    <Document size="A4" margin={{ x: 18, y: 16 }}>
      <Footer>
        <Text size={7} align="right" color="#94a3b8">
          {"Page {currentPage} of {totalPages}"}
        </Text>
      </Footer>

      <Page>
        <Stack gap={5}>
          {/* Header — nom centré, majuscules espacées */}
          <Stack gap={4} alignItems="center">
            <Text name="fullName" size={24} color="#111827" align="center">
              {fullName.toUpperCase()}
            </Text>
            <HR />
          </Stack>

          {/* PROFIL + CONTACT côte à côte */}
          <Row gap={10}>
            {personal.summary && (
              <Box flex={1.4}>
                <Stack gap={2}>
                  <Text size={11} color="#111827">PROFIL</Text>
                  <Text name="summaryBlock" size={9} lineHeight={1.5} color="#374151" overflow="expand">
                    {personal.summary}
                  </Text>
                </Stack>
              </Box>
            )}

            <Box flex={1}>
              <Stack gap={2}>
                <Text size={11} color="#111827">CONTACT</Text>
                <Stack gap={1}>
                  {personal.phone && (
                    <Text name="phone" size={9} color="#374151">
                      {personal.phone}
                    </Text>
                  )}
                  {personal.email && (
                    <Text name="email" size={9} color="#374151">
                      {personal.email}
                    </Text>
                  )}
                  {personal.linkedin && (
                    <Text name="linkedin" size={9} color="#374151">
                      {personal.linkedin}
                    </Text>
                  )}
                  {contactLine1 && (
                    <Text name="contactLine1" size={9} color="#374151">
                      {contactLine1}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Row>

          <HR />

          {/* FORMATION — titre fusionné avec 1er item, dates alignées à droite, pas de description */}
          {education.length > 0 && (
            <Stack gap={2}>
              {education.map((edu, index) => (
                <Stack gap={0.5}>
                  {index === 0 && (
                    <Text size={11} color="#111827" padding={{ bottom: 2 }}>FORMATION</Text>
                  )}
                  <Row justifyContent="space-between">
                    <Text name={`education-${index}-degree`} size={9.5} color="#111827">
                      {`${edu.institution} - ${edu.degree.toUpperCase()}`}
                    </Text>
                    <Text name={`education-${index}-dates`} size={9} color="#6b7280" align="right">
                      {`${edu.startDate} - ${edu.endDate}`}
                    </Text>
                  </Row>
                </Stack>
              ))}
            </Stack>
          )}

          <HR />

          {/* EXPÉRIENCE PROFESSIONNELLE — titre fusionné, description en liste à puces */}
          {experiences.length > 0 && (
            <Stack gap={4}>
              {experiences.map((exp, index) => (
                <Stack gap={1}>
                  {index === 0 && (
                    <Text size={11} color="#111827" padding={{ bottom: 2 }}>
                      EXPÉRIENCES PROFESSIONNELLES
                    </Text>
                  )}
                  <Row justifyContent="space-between">
                    <Text name={`experience-${index}-position`} size={10} color="#111827">
                      {`${exp.company} - ${exp.position.toUpperCase()}`}
                    </Text>
                    <Text name={`experience-${index}-dates`} size={9} color="#6b7280" align="right">
                      {`${exp.startDate} - ${exp.current ? "Présent" : exp.endDate}`}
                    </Text>
                  </Row>
                  <Text
                    name={`experience-${index}-block`}
                    size={9}
                    lineHeight={1.5}
                    color="#374151"
                    overflow="expand"
                  >
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .map((line) => `• ${line}`)
                      .join("\n")}
                  </Text>
                </Stack>
              ))}
            </Stack>
          )}

          <HR />

          {/* Compétences + Langues — sur deux colonnes */}
          <Row gap={10}>
            {skills.length > 0 && (
              <Box flex={1.4}>
                <MultiVariableText
                  name="skillsText"
                  size={9}
                  lineHeight={1.6}
                  overflow="expand"
                  text={"COMPÉTENCES & LANGUES\n\n" + skills.map((_, i) => `• {skill${i}}`).join("\n")}
                  values={Object.fromEntries(skills.map((s, i) => [`skill${i}`, s]))}
                />
              </Box>
            )}

            {languages.length > 0 && (
              <Box flex={1}>
                <MultiVariableText
                  name="languagesText"
                  size={9}
                  lineHeight={1.6}
                  overflow="expand"
                  text={"\n\n" + languages.map((_, i) => `• {lang${i}}`).join("\n")}
                  values={Object.fromEntries(
                    languages.map((l, i) => [`lang${i}`, `${l.name} (${l.level})`])
                  )}
                />
              </Box>
            )}
          </Row>
        </Stack>
      </Page>
    </Document>
  )
}