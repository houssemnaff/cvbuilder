import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server.edge'
import { ModernMinimalTemplate } from '@/components/cv/templates/modern-minimal'
import { ProfessionalTemplate } from '@/components/cv/templates/professional'
import { CreativeTemplate } from '@/components/cv/templates/creative'
import { ExecutiveTemplate } from '@/components/cv/templates/executive'
import { TimelineTemplate } from '@/components/cv/templates/timeline'
import { TwoColumnTemplate } from '@/components/cv/templates/towcolumn'
import { CanadianTemplate } from '@/components/cv/templates/canadian'
import { AcademicTemplate } from '@/components/cv/templates/academic'
import { DeveloperTemplate } from '@/components/cv/templates/developper'
import type { ProfileData } from '@/components/cv/cv-preview'

interface TemplateMap {
  [key: string]: React.ComponentType<{ data: ProfileData }>
}

const TEMPLATE_MAP: TemplateMap = {
  'modern-minimal': ModernMinimalTemplate,
  'professional': ProfessionalTemplate,
  'creative': CreativeTemplate,
  'executive': ExecutiveTemplate,
  'timeline': TimelineTemplate,
  'two-column': TwoColumnTemplate,
  'canadian': CanadianTemplate,
  'academic': AcademicTemplate,
  'developer': DeveloperTemplate,
}

/**
 * Render a CV template to static HTML with print styling
 * This is used server-side to generate PDFs via Puppeteer
 */
export function renderTemplateToHTML(templateId: string, profileData: ProfileData): string {
  const Template = TEMPLATE_MAP[templateId]

  if (!Template) {
    throw new Error(`Template "${templateId}" not found`)
  }

  const componentHTML = renderToStaticMarkup(React.createElement(Template, { data: profileData }))

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${profileData.personal.firstName} ${profileData.personal.lastName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    html, body {
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.5;
      color: #333;
    }

    /* Paginated container generated before PDF export */
    .cv-container {
      width: 100%;
      background: white;
    }

    .cv-page {
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      background: white;
      position: relative;
      margin: 0 auto;
    }

    .cv-page-content {
      width: 100%;
      height: 100%;
      padding: 12mm 10mm;
      box-sizing: border-box;
      overflow: hidden;
    }

    @page {
      size: A4;
      margin: 12mm 10mm; /* ✅ Only define margin here, not in both places */
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .cv-section, .cv-item, .break-inside-avoid {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      .cv-page {
        margin: 0;
        page-break-after: always;
        break-after: page;
      }

      .cv-page:last-child {
        page-break-after: auto;
        break-after: auto;
      }

      .page-break {
        page-break-before: always;
        break-before: page;
      }

      .no-print {
        display: none !important;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }

      p {
        orphans: 2;
        widows: 2;
      }
    }

    @media screen {
      body { background: #f5f5f5; }
      .cv-container {
        width: 210mm;
        background: white;
        margin: 20px auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        overflow: auto;
      }

      .cv-page + .cv-page {
        margin-top: 20px;
      }
    }

    /* ✅ Fix 2: HR / divider lines — the most important fix */
    hr {
      display: block !important;
      border: none !important;
      border-top: 1px solid #d1d5db !important;
      background-color: #d1d5db !important;
      height: 1px !important;
      margin: 0 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    /* ✅ Fix 3: Tailwind border-b classes */
    .border-b { border-bottom: 1px solid #e5e7eb !important; }
    .border-b-2 { border-bottom: 2px solid #e5e7eb !important; }
    .border-t { border-top: 1px solid #e5e7eb !important; }
    .border-t-2 { border-top: 2px solid #e5e7eb !important; }

    /* Border colors */
    .border-gray-100 { border-color: #f3f4f6 !important; }
    .border-gray-200 { border-color: #e5e7eb !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
    .border-gray-400 { border-color: #9ca3af !important; }
    .border-gray-500 { border-color: #6b7280 !important; }
    .border-gray-700 { border-color: #374151 !important; }
    .border-gray-800 { border-color: #1f2937 !important; }
    .border-gray-900 { border-color: #111827 !important; }

    /* ✅ Fix 4: Tailwind divide utilities */
    .divide-y > * + * { border-top: 1px solid #e5e7eb !important; }
    .divide-y-2 > * + * { border-top: 2px solid #e5e7eb !important; }
    .divide-gray-100 > * + * { border-color: #f3f4f6 !important; }
    .divide-gray-200 > * + * { border-color: #e5e7eb !important; }
    .divide-gray-300 > * + * { border-color: #d1d5db !important; }

    /* Colors */
    .text-gray-900 { color: #111827; }
    .text-gray-800 { color: #1f2937; }
    .text-gray-700 { color: #374151; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-400 { color: #9ca3af; }
    .bg-white { background-color: white; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .bg-gray-900 { background-color: #111827; }

    /* Spacing */
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-4 { margin-top: 1rem; }
    .pb-1 { padding-bottom: 0.25rem; }
    .pb-2 { padding-bottom: 0.5rem; }
    .pb-4 { padding-bottom: 1rem; }
    .pb-6 { padding-bottom: 1.5rem; }
    .pt-2 { padding-top: 0.5rem; }
    .pt-4 { padding-top: 1rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    .p-12 { padding: 3rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }

    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .space-x-3 > * + * { margin-left: 0.75rem; }
    .gap-1 { gap: 0.25rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }

    /* Typography */
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .font-normal { font-weight: 400; }
    .font-light { font-weight: 300; }
    .text-5xl { font-size: 3rem; line-height: 1; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .uppercase { text-transform: uppercase; }
    .lowercase { text-transform: lowercase; }
    .capitalize { text-transform: capitalize; }
    .tracking-wide { letter-spacing: 0.025em; }
    .tracking-wider { letter-spacing: 0.05em; }
    .tracking-widest { letter-spacing: 0.1em; }
    .italic { font-style: italic; }
    .not-italic { font-style: normal; }
    .leading-tight { line-height: 1.25; }
    .leading-snug { line-height: 1.375; }
    .leading-normal { line-height: 1.5; }
    .leading-relaxed { line-height: 1.625; }
    .leading-loose { line-height: 2; }

    /* Layout */
    .flex { display: flex; }
    .inline-flex { display: inline-flex; }
    .grid { display: grid; }
    .block { display: block; }
    .inline-block { display: inline-block; }
    .hidden { display: none; }
    .flex-col { flex-direction: column; }
    .flex-row { flex-direction: row; }
    .flex-wrap { flex-wrap: wrap; }
    .flex-1 { flex: 1 1 0%; }
    .flex-shrink-0 { flex-shrink: 0; }
    .shrink-0 { flex-shrink: 0; }
    .flex-grow { flex-grow: 1; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .justify-start { justify-content: flex-start; }
    .justify-end { justify-content: flex-end; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .self-start { align-self: flex-start; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .col-span-1 { grid-column: span 1 / span 1; }
    .col-span-2 { grid-column: span 2 / span 2; }

    /* Sizing */
    .w-full { width: 100%; }
    .w-1\/3 { width: 33.333333%; }
    .w-2\/3 { width: 66.666667%; }
    .w-1\/4 { width: 25%; }
    .w-3\/4 { width: 75%; }
    .w-2 { width: 0.5rem; }
    .w-3 { width: 0.75rem; }
    .w-4 { width: 1rem; }
    .h-2 { height: 0.5rem; }
    .h-3 { height: 0.75rem; }
    .h-4 { height: 1rem; }
    .h-full { height: 100%; }
    .min-h-screen { min-height: 100vh; }
    .max-w-3xl { max-width: 48rem; }
    .max-w-4xl { max-width: 56rem; }

    /* Misc */
    .rounded { border-radius: 0.25rem; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-full { border-radius: 9999px; }
    .overflow-hidden { overflow: hidden; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .list-disc { list-style-type: disc; }
    .list-inside { list-style-position: inside; }
    .list-outside { list-style-position: outside; }
    .pl-4 { padding-left: 1rem; }
    .pl-5 { padding-left: 1.25rem; }
    .pl-6 { padding-left: 1.5rem; }
    .ml-1 { margin-left: 0.25rem; }
    .ml-2 { margin-left: 0.5rem; }
    .ml-4 { margin-left: 1rem; }
    .mr-1 { margin-right: 0.25rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mr-4 { margin-right: 1rem; }
    .opacity-75 { opacity: 0.75; }
    .opacity-50 { opacity: 0.5; }
    .wrap-break-word { overflow-wrap: break-word; word-break: break-word; }

    .bg-linear-to-r {
      background-image: linear-gradient(to right, var(--tw-gradient-from, transparent), var(--tw-gradient-to, transparent));
    }

    .bg-linear-to-b {
      background-image: linear-gradient(to bottom, var(--tw-gradient-from, transparent), var(--tw-gradient-to, transparent));
    }

    .from-slate-800 { --tw-gradient-from: #1e293b; }
    .to-slate-700 { --tw-gradient-to: #334155; }
    .from-slate-50 { --tw-gradient-from: #f8fafc; }
    .from-blue-600 { --tw-gradient-from: #2563eb; }
    .to-indigo-600 { --tw-gradient-to: #4f46e5; }
    .from-gray-50 { --tw-gradient-from: #f9fafb; }
    .to-blue-50 { --tw-gradient-to: #eff6ff; }
    .to-indigo-400 { --tw-gradient-to: #818cf8; }
    .from-blue-400 { --tw-gradient-from: #60a5fa; }
    .to-transparent { --tw-gradient-to: transparent; }

    a { color: inherit; text-decoration: none; }
    a[href]:after { content: ''; }

    .cv-section, .cv-item {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    ${componentHTML}
  </div>
</body>
</html>`

  return html
}
