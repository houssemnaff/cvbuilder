// This file demonstrates how to test the PDF export functionality
// Run this after starting the development server

/**
 * TEST CASE 1: Generate PDF via API (Direct)
 * 
 * Requirements:
 * 1. Start dev server: npm run dev
 * 2. Run this code in browser console or use curl
 */

// Example: Browser Console
async function testPDFExport() {
  const sampleProfile = {
    personal: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "+33 1 23 45 67 89",
      address: "123 Rue de Paris",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      linkedin: "linkedin.com/in/jeandupont",
      website: "jeandupont.com",
      summary: "Professionnel expérimenté avec 10 ans d'expérience en développement logiciel et gestion de projets."
    },
    experiences: [
      {
        id: "1",
        position: "Développeur Senior",
        company: "TechCorp France",
        location: "Paris",
        startDate: "2020",
        endDate: "2024",
        current: true,
        description: "Responsable du développement de solutions web scalables. Gestion d'équipe de 5 développeurs."
      },
      {
        id: "2",
        position: "Développeur Full Stack",
        company: "WebSolutions",
        location: "Lyon",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Développement d'applications React et Node.js pour clients Fortune 500."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Master Informatique",
        institution: "Université Pierre et Marie Curie",
        location: "Paris",
        startDate: "2010",
        endDate: "2012",
        description: "Spécialisation en Développement Logiciel Avancé"
      },
      {
        id: "2",
        degree: "Licence Informatique",
        institution: "Université Paris-Sud",
        location: "Orsay",
        startDate: "2007",
        endDate: "2010",
        description: ""
      }
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Next.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Leadership",
      "Agile/Scrum"
    ],
    languages: [
      { id: "1", name: "Français", level: "Natif" },
      { id: "2", name: "Anglais", level: "Courant" },
      { id: "3", name: "Allemand", level: "Intermédiaire" }
    ]
  }

  try {
    console.log('📄 Generating PDF with Puppeteer...')
    
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: 'professional',
        profileData: sampleProfile
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Unknown error')
    }

    const blob = await response.blob()
    console.log('✅ PDF generated successfully. Size:', blob.size, 'bytes')

    // Verify it's actually a PDF
    const header = await blob.slice(0, 4).text()
    console.log('PDF Header:', header, header.includes('%PDF') ? '✓' : '✗')

    // Download the PDF
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'test-cv.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('✅ PDF downloader completed!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run in browser: testPDFExport()


/**
 * TEST CASE 2: Via cURL
 */

/*
# Save current Puppeteer test to file
curl -X POST http://localhost:3000/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "modern-minimal",
    "profileData": {
      "personal": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1 555-123-4567",
        "address": "123 Main St",
        "city": "New York",
        "postalCode": "10001",
        "country": "USA",
        "linkedin": "linkedin.com/in/johndoe",
        "website": "johndoe.com",
        "summary": "Experienced software engineer with expertise in full-stack development."
      },
      "experiences": [
        {
          "id": "1",
          "position": "Senior Engineer",
          "company": "TechCorp",
          "location": "New York",
          "startDate": "2020",
          "endDate": "2024",
          "current": true,
          "description": "Led development of microservices architecture."
        }
      ],
      "education": [
        {
          "id": "1",
          "degree": "BS Computer Science",
          "institution": "MIT",
          "location": "Cambridge, MA",
          "startDate": "2012",
          "endDate": "2016",
          "description": ""
        }
      ],
      "skills": ["JavaScript", "React", "Node.js", "AWS"],
      "languages": [
        {"id": "1", "name": "English", "level": "Native"},
        {"id": "2", "name": "Spanish", "level": "Fluent"}
      ]
    }
  }' \
  --output test.pdf
*/


/**
 * TEST CASE 3: Template Compatibility
 * 
 * Test all templates to ensure they render correctly
 */

const TEMPLATE_IDS = [
  'modern-minimal',
  'professional',
  'creative',
  'executive',
  'timeline',
  'two-column',
  'canadian',
  'academic',
  'developer'
]

async function testAllTemplates() {
  const sampleProfile = {
    personal: {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "+1 234-567-8900",
      address: "123 Test St",
      city: "TestCity",
      postalCode: "12345",
      country: "TestCountry",
      linkedin: "linkedin.com/in/testuser",
      website: "testuser.com",
      summary: "This is a test profile for all templates."
    },
    experiences: [
      {
        id: "1",
        position: "Test Position",
        company: "Test Company",
        location: "Test Location",
        startDate: "2023",
        endDate: "2024",
        current: true,
        description: "Test description."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Test Degree",
        institution: "Test Institution",
        location: "Test Location",
        startDate: "2020",
        endDate: "2023",
        description: "Test description"
      }
    ],
    skills: ["Skill1", "Skill2", "Skill3"],
    languages: [
      { id: "1", name: "English", level: "Native" }
    ]
  }

  console.log('🧪 Testing all templates...')

  for (const templateId of TEMPLATE_IDS) {
    try {
      console.log(`⏳ Testing ${templateId}...`)
      
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          profileData: sampleProfile
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        console.log(`✅ ${templateId}: ${blob.size} bytes`)
      } else {
        const error = await response.json()
        console.log(`❌ ${templateId}: ${error.error}`)
      }
    } catch (error) {
      console.log(`❌ ${templateId}: ${error}`)
    }
  }

  console.log('✅ Template testing complete!')
}

// Run in browser: testAllTemplates()


/**
 * EXPECTED RESULTS
 * 
 * ✅ All templates should generate PDFs without errors
 * ✅ PDF sizes should be between 50-500 KB depending on content
 * ✅ First request takes ~4-5 seconds (browser warmup)
 * ✅ Subsequent requests take ~2-3 seconds (cached browser)
 * ✅ PDFs should be downloadable and viewable
 */
