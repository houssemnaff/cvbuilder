import puppeteer, { type Browser } from 'puppeteer'
import { PDFDocument } from 'pdf-lib'
import { renderTemplateToHTML } from '@/lib/render-template-to-html'
import type { ProfileData } from '@/components/cv/cv-preview'

export const runtime = 'nodejs'

let browserInstance: Browser | null = null

async function getBrowserInstance(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) return browserInstance

  browserInstance = await puppeteer.launch({
    headless: true, // ✅ évite l'erreur TS sur 'new'
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--disable-extensions',
    ],
  })

  return browserInstance
}

async function generatePDFFromHTML(html: string): Promise<Uint8Array> {
  const browser = await getBrowserInstance()
  const page = await browser.newPage()

  try {
    page.setDefaultNavigationTimeout(60000)
    page.setDefaultTimeout(60000)

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    })

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
    const headContent = headMatch?.[1] ?? ''

    await page.evaluate(() => {
      const MM_TO_PX = 96 / 25.4
      const PAGE_HEIGHT_MM = 297
      const PAGE_WIDTH_MM = 210
      const PADDING_TOP_MM = 12
      const PADDING_BOTTOM_MM = 12
      const PADDING_X_MM = 10

      const pageHeightPx = PAGE_HEIGHT_MM * MM_TO_PX
      const pageWidthPx = PAGE_WIDTH_MM * MM_TO_PX
      const contentMaxHeightPx = (PAGE_HEIGHT_MM - PADDING_TOP_MM - PADDING_BOTTOM_MM) * MM_TO_PX

      const cvContainer = document.querySelector<HTMLElement>('.cv-container')
      const contentRoot = cvContainer?.querySelector<HTMLElement>('#cv-content-container')

      if (!cvContainer || !contentRoot) {
        return
      }

      const allBlocks = Array.from(contentRoot.querySelectorAll<HTMLElement>('[data-cv-block]'))
      const leafBlocks = allBlocks.filter((block) => block.querySelector('[data-cv-block]') === null)

      const blocks: HTMLElement[] = leafBlocks.length > 0
        ? leafBlocks
        : Array.from(contentRoot.children).filter((node): node is HTMLElement => node instanceof HTMLElement)

      if (blocks.length === 0) {
        return
      }

      const createPage = () => {
        const cvPage = document.createElement('div')
        cvPage.className = 'cv-page'
        cvPage.style.width = `${pageWidthPx}px`
        cvPage.style.height = `${pageHeightPx}px`

        const pageContent = document.createElement('div')
        pageContent.className = 'cv-page-content'
        pageContent.style.padding = `${PADDING_TOP_MM}mm ${PADDING_X_MM}mm`

        cvPage.appendChild(pageContent)
        return { cvPage, pageContent }
      }

      const paginatedPages: HTMLElement[] = []
      let { cvPage: currentPage, pageContent: currentPageContent } = createPage()
      let currentHeight = 0

      for (const block of blocks) {
        const measuredHeight = Math.max(block.getBoundingClientRect().height, 1)

        if (currentHeight > 0 && currentHeight + measuredHeight > contentMaxHeightPx) {
          paginatedPages.push(currentPage)
          const nextPage = createPage()
          currentPage = nextPage.cvPage
          currentPageContent = nextPage.pageContent
          currentHeight = 0
        }

        currentPageContent.appendChild(block)
        currentHeight += measuredHeight
      }

      paginatedPages.push(currentPage)

      cvContainer.innerHTML = ''
      for (const pagedNode of paginatedPages) {
        cvContainer.appendChild(pagedNode)
      }
    })

    // ✅ Fix 1: Inject CSS to force borders/lines to render in PDF
    await page.addStyleTag({
      content: `
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        hr, [class*="divider"], [class*="separator"] {
          display: block !important;
          height: 1px !important;
          min-height: 1px !important;
          border: none !important;
          border-top: 1px solid #d1d5db !important;
          background-color: #d1d5db !important;
          visibility: visible !important;
          opacity: 1 !important;
          margin: 8px 0 !important;
        }
      `,
    })

    const pageFragments = await page.$$eval('.cv-page', (nodes) => nodes.map((node) => node.outerHTML))

    if (pageFragments.length <= 1) {
      const pdfBytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      })

      return pdfBytes
    }

    const perPagePdfs: Uint8Array[] = []

    for (const fragment of pageFragments) {
      const singlePageHTML = `<!DOCTYPE html>
<html lang="fr">
<head>${headContent}</head>
<body>
  <div class="cv-container">${fragment}</div>
</body>
</html>`

      await page.setViewport({
        width: 794,
        height: 1123,
        deviceScaleFactor: 1,
      })

      await page.setContent(singlePageHTML, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      })

      const pagePdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      })

      perPagePdfs.push(pagePdf)
    }

    const mergedPdf = await PDFDocument.create()

    for (const pdfBuffer of perPagePdfs) {
      const sourcePdf = await PDFDocument.load(pdfBuffer)
      const pageIndices = sourcePdf.getPageIndices()
      const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices)
      for (const copiedPage of copiedPages) {
        mergedPdf.addPage(copiedPage)
      }
    }

    return await mergedPdf.save()
  } finally {
    await page.close()
  }
}

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

    const html = renderTemplateToHTML(templateId, profileData as ProfileData)
    const pdfBytes = await generatePDFFromHTML(html)

    const filename = `${profileData.personal.firstName}_${profileData.personal.lastName}_CV.pdf`

    return new Response(new Blob([Buffer.from(pdfBytes)], { type: 'application/pdf' }), {
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