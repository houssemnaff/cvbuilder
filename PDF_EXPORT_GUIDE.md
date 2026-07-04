# CVBuilder - Puppeteer PDF Export Integration

## Overview

This document describes the Puppeteer-based PDF generation system integrated into CVBuilder. This system generates high-fidelity, vector-based PDFs with exact layout preservation.

## Architecture

### Components

1. **API Route**: `/app/api/export-pdf/route.ts`
   - Server-side PDF generation using Puppeteer
   - Accepts HTTP POST requests with template ID and profile data
   - Returns downloadable PDF blob
   - Handles browser instance pooling for performance

2. **Template Renderer**: `/lib/render-template-to-html.ts`
   - Converts React components to static HTML
   - Uses `renderToStaticMarkup` from `react-dom/server`
   - Wraps HTML with comprehensive print styles
   - Supports all 9 CV templates

3. **Print Styles**: `/lib/print-styles.ts`
   - Utility with reusable print CSS classes
   - Ensures consistent pagination across templates
   - Prevents section splitting across pages

4. **Frontend Integration**: `components/cv/cv-actions.tsx`
   - Triggers PDF export via button click
   - Sends template ID and profile data to API
   - Handles file download on client side
   - Shows user feedback (toast notifications)

### Data Flow

```
User clicks "Export PDF"
         ↓
cv-actions.handleExportPDF()
         ↓
POST /api/export-pdf
         ↓
render-template-to-html (React → HTML)
         ↓
Puppeteer (HTML → PDF)
         ↓
Response blob
         ↓
Browser downloads PDF
```

## Key Features

### 1. Vector-Based Output
- Uses Puppeteer's Chromium print engine
- Output is selectable text (not image)
- Preserves fonts, colors, and exact layout
- Full print background and color preservation

### 2. Responsive Pagination
- Automatic multi-page flow based on content
- Sections don't split across pages (via `break-inside: avoid`)
- Controlled page breaks via `.page-break` class
- Unknown content length handled gracefully

### 3. Print Optimization
- Exact A4 dimensions with 12mm margins
- `@page` CSS rules ensure consistency
- `-webkit-print-color-adjust: exact` for color preservation
- Minimal reflow on print rendering

### 4. Browser Pooling
- Single persistent Puppeteer browser instance
- Reused across requests for better performance
- Automatic cleanup on disconnection
- Graceful fallback if instance fails

## Configuration

### PDF Settings

```typescript
// A4 format, 12mm margins, print background visible
{
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: {
    top: '12mm',
    right: '12mm',
    bottom: '12mm',
    left: '12mm',
  }
}
```

### Page Setup

```css
@page {
  size: A4;
  margin: 12mm;
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### Viewport

- Width: 794px (A4 at 96 DPI)
- Height: 1123px (A4 at 96 DPI)
- Device scale: 1:1

## Template Support

All 9 CV templates are supported:

1. **modern-minimal** - Clean, minimal design
2. **professional** - Traditional professional layout
3. **creative** - Two-column creative design
4. **executive** - Header-focused executive style
5. **timeline** - Timeline-based layout
6. **two-column** - Sidebar with content layout
7. **canadian** - ATS-optimized Canadian format
8. **academic** - Academic CV format
9. **developer** - Terminal-style developer CV

Each template:
- Has `id="cv-content-container"` for Puppeteer targeting
- Uses `.cv-section` for major sections
- Uses `.cv-item` for individual items
- Includes `break-inside-avoid` for pagination control

## Usage

### From Client (React Component)

```typescript
// cv-actions.tsx automatically handles this
const handleExportPDF = async () => {
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: 'modern-minimal',
      profileData: {
        personal: { firstName: 'John', ... },
        experiences: [...],
        education: [...],
        skills: [...],
        languages: [...]
      }
    })
  })

  const blob = await response.blob()
  // Trigger download
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'CV.pdf'
  link.click()
}
```

### From API

```bash
curl -X POST http://localhost:3000/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "professional",
    "profileData": { ... }
  }' \
  --output cv.pdf
```

## Pagination Strategy

### Avoiding Split Content

```html
<!-- This won't split across pages -->
<div class="cv-item break-inside-avoid">
  <h3>Job Title</h3>
  <p>Description text</p>
</div>
```

### Forcing Page Breaks

```html
<!-- Start new page here -->
<div class="page-break"></div>
```

### Section Grouping

```html
<!-- All items in section try to stay together -->
<div class="cv-section">
  <div class="cv-item break-inside-avoid">Item 1</div>
  <div class="cv-item break-inside-avoid">Item 2</div>
</div>
```

## CSS Classes Reference

| Class | Purpose | Usage |
|-------|---------|-------|
| `cv-section` | Major section grouping | Wraps all items in a category |
| `cv-item` | Individual items | Each experience, education, skill |
| `break-inside-avoid` | Prevent splitting | Applied to items and sections |
| `page-break` | Forced page break | Empty div to start new page |
| `no-print` | Hide from PDF | Elements not needed in print |

## Style Preservation

All template styles are preserved in the PDF:

- ✅ Tailwind CSS classes (converted to inline styles)
- ✅ Background colors and gradients
- ✅ Font sizes and weights
- ✅ Spacing and margins
- ✅ Borders and separators
- ✅ Custom colors

## Error Handling

The API provides clear error messages:

```json
{
  "error": "Template \"invalid-template\" not found"
}
```

Common errors:
- **400**: Missing template ID or profile data
- **400**: Invalid profile data structure
- **400**: Invalid template ID
- **500**: PDF generation failed (Puppeteer error)

## Performance Considerations

### Optimization Tips

1. **Browser Pooling**
   - Reuses browser instance across requests
   - Much faster than launching new browser per PDF
   - Typical time: 2-5 seconds per PDF

2. **Content Loading**
   - Uses `waitUntil: 'networkidle0'`
   - Ensures fonts and images are fully loaded
   - May add 1-2 seconds for external resources

3. **Caching**
   - Consider caching generated PDFs by profile hash
   - Implement Redis or similar for large volumes
   - Current implementation: on-demand generation

### Typical Performance

| Operation | Time |
|-----------|------|
| Browser startup | ~3 seconds (first) |
| Create page | ~200ms |
| Set content | ~100ms |
| Generate PDF | ~500ms |
| **Total** | **~4-5 seconds** |

## Troubleshooting

### PDF Missing Text

**Cause**: Fonts not loaded before rendering
**Solution**: Increase `waitUntil` delay or pre-load fonts

### Broken Layout

**Cause**: `vh` units or position: fixed
**Solution**: Use `mm`/`px` units, avoid fixed positioning

### Colors Not Showing

**Cause**: Print color adjustment disabled
**Solution**: Add `-webkit-print-color-adjust: exact !important;`

### Content Cut Off

**Cause**: Sections not marked with `break-inside-avoid`
**Solution**: Add class to all `.cv-item` and `.cv-section`

### Timeout Errors

**Cause**: Large images or slow network
**Solution**: Optimize images, increase timeout
```typescript
// In route.ts, increase timeout if needed
// Set timeout in Next.js config
```

## Future Enhancements

- [ ] Caching generated PDFs
- [ ] Support for custom logos/images
- [ ] Multiple language support
- [ ] Watermark support
- [ ] Digital signature support
- [ ] Batch PDF generation
- [ ] PDF A/3 compliance
- [ ] Custom page sizes (Letter, A3, etc.)

## Dependencies

- `puppeteer@latest` - Chromium-based PDF generation
- `react-dom/server` - Server-side React rendering
- `next@16+` - API routes and server functions

## Installation

```bash
npm install puppeteer
# or
yarn add puppeteer
# or
pnpm add puppeteer
```

## Deployment Notes

### Serverless Functions

If deploying to serverless (AWS Lambda, Vercel, etc.):
- Consider using `@sparticuz/chromium-min` instead of Puppeteer
- Or use managed PDF services (AWS Lambda Layers, etc.)
- Chrome binary must be available in runtime environment

### Environment Variables

```bash
# Optional: Custom Chrome path (for custom builds)
CHROME_BIN=/path/to/chrome

# Optional: Disable sandbox for Docker/Linux
PUPPETEER_ARGS=--no-sandbox
```

### Docker

```dockerfile
FROM node:18-alpine

# Install dependencies for Puppeteer
RUN apk add --no-cache \
  chromium \
  noto-fonts \
  noto-fonts-cjk

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "start"]
```

## Security Considerations

- ✅ Input validation on template ID
- ✅ Validation of profile data structure
- ✅ No arbitrary code execution
- ✅ Browser sandbox enabled
- ⚠️ Large PDFs could cause memory issues
- ⚠️ Consider rate limiting for production

## Testing

Test the PDF export:

```bash
# Development
npm run dev

# Navigate to: http://localhost:3000/dashboard/cvs
# Click export button on any CV

# Or test via curl:
curl -X POST http://localhost:3000/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"templateId":"modern-minimal","profileData":{...}}' \
  > test.pdf
```

## Support & Debugging

Enable debug logging:

```typescript
// In route.ts
console.log('[PDF Export] Starting generation for template:', templateId)
// Already implemented with helpful error messages
```

## License

Same as CVBuilder project.

## References

- [Puppeteer Documentation](https://pptr.dev/)
- [Chromium Print API](https://developer.chrome.com/docs/puppeteer/api/puppeteer.pdfoptions/)
- [CSS Print Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries_for_accessibility#print)
- [React SSR](https://react.dev/reference/react-dom/server)
