/**
 * PDF Export Print Styles Utility
 * These styles ensure consistent print rendering across all CV templates
 * Used by Puppeteer to generate high-fidelity PDFs
 */

export const PRINT_STYLES = `
@page {
  size: A4;
  margin: 12mm;
}

@media print {
  /* Force exact colors and backgrounds */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body, html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* Prevent sections from being split across pages */
  .cv-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .cv-item {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Controlled page breaks */
  .page-break {
    page-break-before: always;
    break-before: page;
  }

  /* Hide unprintable elements */
  .no-print {
    display: none !important;
  }

  /* Optimize heading spacing */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    orphans: 3;
    widows: 3;
  }

  /* Improve paragraph rendering */
  p {
    orphans: 2;
    widows: 2;
    page-break-inside: avoid;
  }

  /* Remove unnecessary whitespace */
  body > * > * {
    margin-top: 0;
  }

  /* Ensure links don't show URLs */
  a[href]:after {
    content: '';
  }

  /* Optimize table rendering */
  table {
    page-break-inside: avoid;
    border-collapse: collapse;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }

  tr {
    page-break-inside: avoid;
  }

  /* Remove box shadows for cleaner print */
  box-shadow: none !important;
}
`

/**
 * Get className for print-safe pagination
 * Use on individual items in repeated sections
 */
export const PRINT_ITEM_CLASS = 'cv-item break-inside-avoid'

/**
 * Get className for print-safe sections
 * Use on sections that can span multiple items
 */
export const PRINT_SECTION_CLASS = 'cv-section'

/**
 * Get className for forced page breaks
 * Use when you want to start content on a new page
 */
export const PAGE_BREAK_CLASS = 'page-break'
