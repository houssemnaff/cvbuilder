import { generateCvPdf } from '@/lib/cv-pdf/generateCvPdf'
import type { ProfileData } from '@/components/cv/cv-preview'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { templateId, profileData } = await request.json()

    if (!templateId || !profileData) {
      return Response.json(
        { error: 'Template ID and profile data are required' },
        { status: 400 }
      )
    }

    if (!profileData.personal || typeof profileData.personal !== 'object') {
      return Response.json({ error: 'Invalid profile data structure' }, { status: 400 })
    }

    const pdfBytes = await generateCvPdf(templateId, profileData as ProfileData)

    const filename = `${profileData.personal.firstName}_${profileData.personal.lastName}_CV.pdf`

    return new Response(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[PDF Export] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('Template')) {
      return Response.json({ error: 'Invalid template selected' }, { status: 400 })
    }

    return Response.json(
      { error: 'Failed to generate PDF. Please try again.' },
      { status: 500 }
    )
  }
}
