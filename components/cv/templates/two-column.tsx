/** @jsxImportSource @pdfme/jsx */
import type { ProfileData } from "../cv-preview"
import { Document, Page, Stack, Row, Box, Text, Footer } from "@pdfme/jsx"

interface TemplateProps {
  data: ProfileData
}

const SIDEBAR_BG = "#1f2937"
const SIDEBAR_TEXT = "#e5e7eb"
const SIDEBAR_MUTED = "#9ca3af"
const ACCENT = "#f59e0b"
const DARK = "#111827"
const BODY = "#374151"
const MUTED = "#6b7280"

// Titre de section de la colonne principale
function MainTitle({ title }: { title: string }) {
  return (
    <Stack gap={1.5}>
      <Text size={11} color={DARK} spacing={0.6}>
        {title}
      </Text>
      <Box height={0.6} width={14} background={ACCENT} />
    </Stack>
  )
}

// Titre de section de la barre latérale
function SideTitle({ title }: { title: string }) {
  return (
    <Stack gap={1.5}>
      <Text size={10} color={ACCENT} spacing={0.6}>
        {title}
      </Text>
      <Box height={0.4} background="#374151" />
    </Stack>
  )
}

export function TwoColumnTemplate({ data }: TemplateProps) {
  const { personal, experiences, education, skills, languages } = data

  const fullName = `${personal.firstName} ${personal.lastName}`.trim()
  const addressLine = [personal.address, personal.postalCode, personal.city, personal.country]
    .filter(Boolean)
    .join(", ")
  const contactItems = [personal.phone, personal.email, addressLine, personal.linkedin, personal.website].filter(
    Boolean,
  )

  return (
    <Document size="A4" margin={{ x: 14, y: 14 }}>
      <Footer>
        <Text size={7} align="right" color="#94a3b8">
          {"Page {currentPage} of {totalPages}"}
        </Text>
      </Footer>

      <Page>
        <Row gap={8}>
          {/* Barre latérale sombre */}
          <Box flex={1} background={SIDEBAR_BG} padding={6} radius={2}>
            <Stack gap={6}>
              <Stack gap={1}>
                <Text name="fullName" size={17} color="#ffffff" lineHeight={1.2} overflow="expand">
                  {fullName}
                </Text>
                <Box height={0.6} width={14} background={ACCENT} />
              </Stack>

              {contactItems.length > 0 && (
                <Stack gap={2}>
                  <SideTitle title="CONTACT" />
                  <Text name="contactBlock" size={8.5} lineHeight={1.6} color={SIDEBAR_TEXT} overflow="expand">
                    {contactItems.join("\n")}
                  </Text>
                </Stack>
              )}

              {skills.length > 0 && (
                <Stack gap={2}>
                  <SideTitle title="COMPÉTENCES" />
                  <Text name="skillsText" size={8.5} lineHeight={1.7} color={SIDEBAR_TEXT} overflow="expand">
                    {skills.map((s) => `• ${s}`).join("\n")}
                  </Text>
                </Stack>
              )}

              {languages.length > 0 && (
                <Stack gap={2}>
                  <SideTitle title="LANGUES" />
                  <Text name="languagesText" size={8.5} lineHeight={1.7} color={SIDEBAR_TEXT} overflow="expand">
                    {languages.map((l) => `${l.name} — ${l.level}`).join("\n")}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Box>

          {/* Colonne principale */}
          <Box flex={2.2}>
            <Stack gap={6}>
              {personal.summary && (
                <Stack gap={2}>
                  <MainTitle title="PROFIL" />
                  <Text name="summaryBlock" size={9} lineHeight={1.5} color={BODY} overflow="expand">
                    {personal.summary}
                  </Text>
                </Stack>
              )}

              {experiences.length > 0 && (
                <Stack gap={2}>
                  <MainTitle title="EXPÉRIENCE PROFESSIONNELLE" />
                  <Stack gap={4}>
                    {experiences.map((exp, index) => (
                      <Stack gap={1}>
                        <Text name={`experience-${index}-position`} size={10} color={DARK}>
                          {exp.position}
                        </Text>
                        <Row justifyContent="space-between">
                          <Text name={`experience-${index}-company`} size={9} color={MUTED}>
                            {[exp.company, exp.location].filter(Boolean).join(" — ")}
                          </Text>
                          <Text name={`experience-${index}-dates`} size={9} color={MUTED} align="right">
                            {`${exp.startDate} - ${exp.current ? "Présent" : exp.endDate}`}
                          </Text>
                        </Row>
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

              {education.length > 0 && (
                <Stack gap={2}>
                  <MainTitle title="FORMATION" />
                  <Stack gap={2.5}>
                    {education.map((edu, index) => (
                      <Stack gap={0.5}>
                        <Text name={`education-${index}-degree`} size={9.5} color={DARK}>
                          {edu.degree}
                        </Text>
                        <Row justifyContent="space-between">
                          <Text name={`education-${index}-institution`} size={9} color={MUTED}>
                            {[edu.institution, edu.location].filter(Boolean).join(" — ")}
                          </Text>
                          <Text name={`education-${index}-dates`} size={9} color={MUTED} align="right">
                            {`${edu.startDate} - ${edu.endDate}`}
                          </Text>
                        </Row>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Box>
        </Row>
      </Page>
    </Document>
  )
}
