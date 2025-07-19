import puppeteer, { Browser, Page } from 'puppeteer';
import { promises as fs } from 'fs';
import * as path from 'path';

interface ProgramData {
  name: string;
  url: string;
  faculty?: string;
  duration?: string;
  credential?: string;
  hasCoOp?: boolean;
  programOptions?: string[];
  description?: string;
}

class UManitobaScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();

    // Set user agent to avoid detection
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  }

  async scrapeMainPage(): Promise<ProgramData[]> {
    if (!this.page) throw new Error('Page not initialized');

    console.log('Trying to find the actual programs listing page...');

    // First, try the main page to see if there's a link to a programs directory
    await this.page.goto('https://umanitoba.ca/explore/programs-of-study/undergraduate', {
      waitUntil: 'networkidle2'
    });

    // Look for a programs directory or search page
    const programsListUrl = await this.page.evaluate(() => {
      // Look for links that might lead to a full programs list
      const possibleLinks = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent?.trim().toLowerCase(),
        href: a.getAttribute('href')
      })).filter(link =>
        link.text && link.href && (
          link.text.includes('all programs') ||
          link.text.includes('program search') ||
          link.text.includes('browse programs') ||
          link.text.includes('programs list') ||
          link.href.includes('programs') && link.href.includes('search')
        )
      );

      return possibleLinks.length > 0 ? possibleLinks[0].href : null;
    });

    if (programsListUrl) {
      console.log('Found programs list URL:', programsListUrl);
      const fullUrl = programsListUrl.startsWith('http') ? programsListUrl : `https://umanitoba.ca${programsListUrl}`;
      await this.page.goto(fullUrl, { waitUntil: 'networkidle2' });
    } else {
      console.log('No specific programs list found, staying on main page...');
    }

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Debug: Take a screenshot to see what we're working with
    const screenshotPath = path.join(process.cwd(), 'backend', 'scripts', 'debug-page.png') as `${string}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved as debug-page.png');

    // Debug: Check page content
    const pageTitle = await this.page.title();
    console.log('Page title:', pageTitle);

    // Debug: Print all text content to understand page structure
    const pageStructure = await this.page.evaluate(() => {
      // Get all faculties/schools mentioned on the page
      const faculties = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.textContent?.trim()).filter(Boolean);

      // Get all links that might be programs
      const allLinks = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent?.trim(),
        href: a.getAttribute('href')
      })).filter(link => link.href && link.href.includes('/explore/programs-of-study/'));

      return {
        faculties: faculties.slice(0, 20), // First 20 headings
        programLinks: allLinks.slice(0, 50) // First 50 program links
      };
    });

    console.log('Page faculties/headings:', pageStructure.faculties);
    console.log('Program links found:', pageStructure.programLinks.length);
    console.log('Sample program links:', pageStructure.programLinks.slice(0, 10));

    // Extract program information from the carousel structure we saw in web search
    const programsFromPage = await this.page.evaluate(() => {
      const programs: { name: string; url: string; faculty?: string }[] = [];

      // The page shows faculties in a carousel structure
      // Let's look for all text that mentions specific programs
      const allText = document.body.innerText || '';
      const lines = allText.split('\n').map(line => line.trim()).filter(Boolean);

      // Complete University of Manitoba programs list - 136 programs total
      const realPrograms = [
        'Accounting (BComm) (Honours)',
        'Actuarial Mathematics (BSc)',
        'Actuarial Mathematics (Business) (BComm) (Honours)',
        'Aging (interfaculty option)',
        'Agribusiness (BSc)',
        'Agroecology (BSc)',
        'Agronomy (BSc)',
        'Animal Systems (BSc)',
        'Anthropology (BA)',
        'Applied Mathematics (BSc)',
        'Art History (BA)',
        'Art History (BFA)',
        'Asian Studies (BA)',
        'Athletic Therapy (BKin)',
        'Bachelor of Education (BEd)',
        'Biochemistry (BSc)',
        'Biological Sciences (BSc)',
        'Biosystems Engineering (BSc)',
        'Business Analytics (BComm) (Honours)',
        'Canadian Studies (BA)',
        'Catholic Studies (Minor)',
        'Central and East European Studies (BA)',
        'Chemistry (BSc)',
        'Civil Engineering (BSc)',
        'Classics (BA)',
        'Commerce (BComm) (Honours)',
        'Computer Engineering (BSc)',
        'Computer Science (BSc)',
        'Criminology (BA)',
        'Data Science (BSc)',
        'Dental Hygiene Degree Completion Program (BScDH)',
        'Dentistry (BSc)',
        'Dentistry (DMD)',
        'Dentistry (DMD/PhD)',
        'Diploma in Agriculture',
        'Diploma in Dental Hygiene',
        'Earth Sciences (BSc)',
        'Economics (BA)',
        'Electrical Engineering (BSc)',
        'Engineering (BSc)',
        'English (BA)',
        'Entrepreneurship & Innovation Major (BComm) (Honours)',
        'Environmental Design (BEnvD)',
        'Environmental Geoscience (BSc)',
        'Environmental Science (BEnvSC)',
        'Environmental Studies (BEnvST)',
        'Film Studies (BA)',
        'Finance (BComm) (Honours)',
        'Fine Arts Studio Program (BFA, diploma)',
        'Food Science (BSc)',
        'French (BA)',
        'General (BSc)',
        'Generalist (Business) (BComm) (Honours)',
        'Genetics (BSc)',
        'Geography (BA)',
        'Geology (BSc)',
        'Geophysics (BSc)',
        'German (BA)',
        'Global Political Economy (BA)',
        'Health Sciences (BHSc)',
        'Health Studies (BHSt)',
        'History (BA)',
        'Human Nutritional Sciences (BSc)',
        'Human Resource Management/Industrial Relations (BComm) (Honours)',
        'Icelandic (BA)',
        'Indigenous Business Studies (BComm) (Honours)',
        'Indigenous Governance (BA)',
        'Indigenous Languages (Minor)',
        'Indigenous Studies (BA)',
        'International Business (BComm) (Honours)',
        'International Dentist Degree Program (IDDP)',
        'International Medical Graduate (IMG) Programs',
        'Italian Studies (BA)',
        'Jazz Studies (BJazz)',
        'Judaic Studies (Minor)',
        'Juris Doctor (JD)',
        'Kinesiology (BKin)',
        'Labour Studies (BA)',
        'Latin American Studies (Minor)',
        'Leadership and Organizations (BComm) (Honours)',
        'Leadership for Business and Organizations (Minor)',
        'Linguistics (BA)',
        'Logistics and Supply Chain Management (BComm) (Honours)',
        'Management Information Systems (BComm) (Honours)',
        'Management Minor for Non-Business Students',
        'Marketing (BComm) (Honours)',
        'Mathematics (BSc)',
        'Mechanical Engineering (BSc)',
        'Medicine (BSc Med)',
        'Medicine (MD)',
        'Medieval and Early Modern Studies (BA)',
        'Micro-Certificate in Essentials in Advanced Patient Care for Pharmacists',
        'Micro-Certificate in Songmaking',
        'Micro-Diploma in Canadian Private Law',
        'Micro-Diploma in Canadian Public Law',
        'Micro-Diploma in German Language, Life and Culture',
        'Micro-Diploma in Mythology and Folktale',
        'Micro-Diploma in Workplace Health and Safety',
        'Microbiology (BSc)',
        'Midwifery (BMid)',
        'Music (BMus)',
        'Music (Post-Baccalaureate Diploma in Performance)',
        'Music minor',
        'Nursing (BN)',
        'Pharmacy (PharmD)',
        'Philosophy (BA)',
        'Physical Education (BPE)',
        'Physical Geography (BSc)',
        'Physics and Astronomy (BSc)',
        'Plant Biotechnology (BSc)',
        'Polish (Minor)',
        'Political Studies (BA)',
        'Post-Baccalaureate Diploma in Education (PBDE)',
        'Post-Baccalaureate Diploma in Medical Physiology and Pathophysiology',
        'Pre-Veterinary studies',
        'Psychology (BA)',
        'Psychology (BSc)',
        'Recreation Management and Community Development (BRMCD)',
        'Recreation Studies (Minor)',
        'Religion (BA)',
        'Respiratory Therapy (BRT)',
        'Russian (BA)',
        'Social Work – Distance Delivery (BSW)',
        'Social Work – Fort Garry campus (BSW)',
        'Social Work – Inner City Program at William Norrie Centre (BSW)',
        'Social Work – Northern Program in Thompson (BSW)',
        'Sociology (BA)',
        'Spanish (BA)',
        'Sport, Physical Activity and Recreation in the Community Certificate (SPARC)',
        'Statistics (BSc)',
        'Strategy and Global Management (BComm) (Honours)',
        'Theatre (BA)',
        'Ukrainian (BA)',
        'Ukrainian Canadian Heritage Studies (BA)',
        'University 1',
        'Women\'s and Gender Studies (BA)'
      ];

      // Convert program names to URLs using the pattern: lowercase with dashes
      realPrograms.forEach(programName => {
        // Skip certain non-standard programs that may not have individual pages
        if (programName.includes('(Minor)') ||
          programName.includes('Micro-Certificate') ||
          programName.includes('Micro-Diploma') ||
          programName.includes('minor') ||
          programName.includes('(interfaculty option)') ||
          programName.includes('Pre-Veterinary studies') ||
          programName.includes('University 1')) {
          console.log(`Skipping non-standard program: ${programName}`);
          return;
        }

        // Convert program name to URL slug
        let urlSlug = programName
          .toLowerCase()
          .replace(/\s*\([^)]*\)/g, '') // Remove degree abbreviations like (BSc)
          .replace(/[^a-z0-9\s]/g, '') // Remove special characters like &, –, /
          .replace(/\s+/g, '-') // Replace spaces with dashes
          .replace(/-+/g, '-') // Replace multiple dashes with single
          .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

        // Add degree abbreviation back to URL
        const degreeMatch = programName.match(/\(([^)]+)\)/);
        if (degreeMatch) {
          let degree = degreeMatch[1].toLowerCase();
          // Handle complex degree names
          degree = degree.replace(/[^a-z0-9]/g, ''); // Remove spaces, slashes, etc
          urlSlug = `${urlSlug}-${degree}`;
        }

        const url = `https://umanitoba.ca/explore/programs-of-study/${urlSlug}`;

        // Determine faculty based on degree type and program name
        let faculty = 'Unknown Faculty';
        if (programName.includes('(BSc)') || programName.includes('(BEnvSC)') || programName.includes('(BHSc)')) {
          if (programName.includes('Engineering')) {
            faculty = 'Price Faculty of Engineering';
          } else if (programName.includes('Agri') || programName.includes('Food') || programName.includes('Plant') || programName.includes('Animal')) {
            faculty = 'Faculty of Agricultural and Food Sciences';
          } else if (programName.includes('Environmental') || programName.includes('Earth') || programName.includes('Geology') || programName.includes('Geophysics')) {
            faculty = 'Clayton H. Riddell Faculty of Environment, Earth, and Resources';
          } else {
            faculty = 'Faculty of Science';
          }
        } else if (programName.includes('(BA)')) {
          faculty = 'Faculty of Arts';
        } else if (programName.includes('(BComm)')) {
          faculty = 'Asper School of Business';
        } else if (programName.includes('(BEd)') || programName.includes('Education')) {
          faculty = 'Faculty of Education';
        } else if (programName.includes('(DMD)') || programName.includes('(MD)') || programName.includes('(BN)') ||
          programName.includes('(PharmD)') || programName.includes('(BRT)') || programName.includes('(BMid)') ||
          programName.includes('Dental') || programName.includes('Medicine') || programName.includes('Nursing') ||
          programName.includes('Pharmacy') || programName.includes('Respiratory') || programName.includes('Midwifery')) {
          faculty = 'Rady Faculty of Health Sciences';
        } else if (programName.includes('(BKin)') || programName.includes('(BPE)') || programName.includes('(BRMCD)') ||
          programName.includes('Athletic') || programName.includes('Physical Education') || programName.includes('Recreation')) {
          faculty = 'Faculty of Kinesiology and Recreation Management';
        } else if (programName.includes('(BEnvD)') || programName.includes('Environmental Design')) {
          faculty = 'Faculty of Architecture';
        } else if (programName.includes('(BFA)') || programName.includes('Art History') || programName.includes('Fine Arts')) {
          faculty = 'School of Art';
        } else if (programName.includes('(BMus)') || programName.includes('(BJazz)') || programName.includes('Music') || programName.includes('Jazz')) {
          faculty = 'Desautels Faculty of Music';
        } else if (programName.includes('(BSW)') || programName.includes('Social Work')) {
          faculty = 'Faculty of Social Work';
        } else if (programName.includes('(JD)') || programName.includes('Juris Doctor')) {
          faculty = 'Robson Hall, Faculty of Law';
        } else if (programName.includes('Diploma') || programName.includes('Post-Baccalaureate')) {
          faculty = 'Extended Education';
        }

        programs.push({
          name: programName,
          url: url,
          faculty: faculty
        });
      });

      return programs;
    });

    console.log(`Generated ${programsFromPage.length} program URLs from 136 total UM programs`);
    console.log('Sample URLs generated:');
    programsFromPage.slice(0, 10).forEach(p => {
      console.log(`- ${p.name} → ${p.url}`);
    });
    let allProgramLinks = programsFromPage;

    // Validate a few sample URLs to make sure our pattern is correct
    console.log('Validating sample program URLs...');
    const sampleUrls = allProgramLinks.slice(0, 5); // Test first 5 URLs

    for (const program of sampleUrls) {
      try {
        console.log(`Testing: ${program.url}`);
        await this.page.goto(program.url, { waitUntil: 'networkidle2', timeout: 8000 });

        const isValid = await this.page.evaluate(() => {
          const title = document.title.toLowerCase();
          const hasContent = document.querySelectorAll('p, div, section').length > 10;
          const isNotFound = title.includes('404') || title.includes('not found') || title.includes('error');

          return {
            valid: hasContent && !isNotFound,
            title: document.title,
            h1: document.querySelector('h1')?.textContent?.trim() || ''
          };
        });

        if (isValid.valid) {
          console.log(`✅ Valid: ${program.name} - ${isValid.title}`);
        } else {
          console.log(`❌ Invalid: ${program.url} - ${isValid.title}`);
          // Remove invalid programs from the list
          const index = allProgramLinks.findIndex(p => p.url === program.url);
          if (index > -1) {
            allProgramLinks.splice(index, 1);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Be respectful
      } catch (error) {
        console.log(`❌ Error testing ${program.url}: ${error}`);
        // Remove problematic URLs
        const index = allProgramLinks.findIndex(p => p.url === program.url);
        if (index > -1) {
          allProgramLinks.splice(index, 1);
        }
      }
    }

    const programLinks = allProgramLinks;

    console.log(`Found ${programLinks.length} program links`);
    return programLinks;
  }

  async scrapeProgramDetails(program: ProgramData): Promise<ProgramData> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      console.log(`Scraping details for: ${program.name}`);
      await this.page.goto(program.url, { waitUntil: 'networkidle2' });

      // Wait a bit for content to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if page loaded successfully (not 404)
      const pageStatus = await this.page.evaluate(() => {
        const title = document.title.toLowerCase();
        const bodyText = document.body.textContent?.toLowerCase() || '';

        return {
          is404: title.includes('404') || title.includes('not found') ||
            bodyText.includes('page not found') || bodyText.includes('404'),
          title: document.title,
          hasContent: document.querySelectorAll('p, div, section').length > 10
        };
      });

      if (pageStatus.is404 || !pageStatus.hasContent) {
        console.log(`❌ Page appears to be 404 or empty: ${program.url}`);
        return { ...program, description: 'Page not found or empty' };
      }

      console.log(`✅ Page loaded successfully: ${pageStatus.title}`);

      const details = await this.page.evaluate(() => {
        let duration = '';
        let credential = '';
        let hasCoOp = false;
        let programOptions: string[] = [];
        let description = '';

        // Debug: Print all text content to understand page structure
        console.log('=== PAGE STRUCTURE DEBUG ===');

        // Get all headings
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName,
          text: h.textContent?.trim()
        }));
        console.log('Headings found:', headings);

        // Get all strong/bold text that might contain program info
        const strongTexts = Array.from(document.querySelectorAll('strong, b, .font-bold, [class*="bold"]')).map(s => s.textContent?.trim()).filter(Boolean);
        console.log('Strong texts:', strongTexts.slice(0, 20));

        // Custom function to find text more broadly
        const findElementByText = (searchText: string) => {
          const elements = document.querySelectorAll('*');
          for (const element of elements) {
            const text = element.textContent?.toLowerCase() || '';
            if (text.includes(searchText.toLowerCase()) && element.children.length === 0) {
              return element;
            }
          }
          return null;
        };

        // Look for duration with multiple patterns
        const durationPatterns = [
          'expected duration', 'duration', 'length', 'years', 'program length',
          'completion time', 'study period', '4 years', '3 years', '2 years'
        ];

        for (const pattern of durationPatterns) {
          const element = findElementByText(pattern);
          if (element) {
            const parent = element.closest('div, section, p, li, td');
            if (parent) {
              const text = parent.textContent || '';
              console.log(`Found duration context for "${pattern}": ${text.substring(0, 200)}`);

              const yearMatch = text.match(/(\d+(?:\.\d+)?\s*(?:to\s+\d+(?:\.\d+)?)?\s*years?)/i);
              const monthMatch = text.match(/(\d+\s*months?)/i);

              if (yearMatch) {
                duration = yearMatch[1];
                console.log(`Extracted duration: ${duration}`);
                break;
              } else if (monthMatch && !duration) {
                duration = monthMatch[1];
              }
            }
          }
        }

        // Look for credential information in title and content
        const h1Text = document.querySelector('h1')?.textContent || '';
        const pageTitle = document.title || '';
        const allText = [h1Text, pageTitle, ...strongTexts].join(' ');

        console.log('Title analysis:', h1Text);
        console.log('Credential search in:', allText.substring(0, 300));

        // Extract credential from title/heading
        if (allText.includes('Bachelor')) {
          credential = 'Bachelor';
          if (allText.includes('Honours')) credential += ' (Honours)';
          if (allText.includes('BComm')) credential = 'Bachelor of Commerce';
          if (allText.includes('BA')) credential = 'Bachelor of Arts';
          if (allText.includes('BSc')) credential = 'Bachelor of Science';
          if (allText.includes('BFA')) credential = 'Bachelor of Fine Arts';
        } else if (allText.includes('Master')) {
          credential = 'Master';
        } else if (allText.includes('Diploma')) {
          credential = 'Diploma';
          if (allText.includes('Advanced')) credential = 'Advanced Diploma';
        } else if (allText.includes('Certificate')) {
          credential = 'Certificate';
        }

        // Look for co-op information more broadly
        const coopPatterns = ['co-op', 'cooperative', 'work-integrated learning', 'internship', 'practicum'];
        const fullPageText = document.body.textContent?.toLowerCase() || '';

        for (const pattern of coopPatterns) {
          if (fullPageText.includes(pattern)) {
            hasCoOp = true;
            console.log(`Found co-op indicator: ${pattern}`);
            break;
          }
        }

        // Look for program options/tracks
        const optionsKeywords = ['program options', 'specializations', 'tracks', 'streams', 'concentrations'];
        for (const keyword of optionsKeywords) {
          const element = findElementByText(keyword);
          if (element) {
            const section = element.closest('section, div');
            if (section) {
              const listItems = section.querySelectorAll('li, .option, p');
              listItems.forEach(item => {
                const text = item.textContent?.trim();
                if (text && text.length > 10 && text.length < 100) {
                  programOptions.push(text);
                  if (text.toLowerCase().includes('co-op')) hasCoOp = true;
                }
              });
            }
          }
        }

        // Get better description
        const descParagraphs = Array.from(document.querySelectorAll('p')).filter(p => {
          const text = p.textContent?.trim() || '';
          return text.length > 50 && !text.toLowerCase().includes('university of manitoba campuses');
        });

        if (descParagraphs.length > 0) {
          description = descParagraphs[0].textContent?.trim().substring(0, 500) || '';
        }

        console.log('=== EXTRACTION RESULTS ===');
        console.log('Duration:', duration);
        console.log('Credential:', credential);
        console.log('Co-op:', hasCoOp);
        console.log('Options:', programOptions);

        return {
          duration,
          credential,
          hasCoOp,
          programOptions,
          description
        };
      });

      return {
        ...program,
        ...details
      };

    } catch (error) {
      console.error(`Error scraping ${program.name}:`, error);
      return program;
    }
  }

  async scrapeAll(): Promise<ProgramData[]> {
    try {
      await this.init();

      // Get all program links from main page
      const programs = await this.scrapeMainPage();

      // Scrape details for each program
      const detailedPrograms: ProgramData[] = [];

      for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        console.log(`Processing ${i + 1}/${programs.length}: ${program.name}`);

        const detailedProgram = await this.scrapeProgramDetails(program);
        detailedPrograms.push(detailedProgram);

        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return detailedPrograms;

    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async saveToFile(data: ProgramData[], filename: string = 'umanitoba_programs.json') {
    const outputDir = path.join(process.cwd(), 'backend', 'scripts', 'output');
    const outputPath = path.join(outputDir, filename);

    // Create output directory if it doesn't exist
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }

    await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data saved to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const scraper = new UManitobaScraper();

  try {
    console.log('Starting University of Manitoba programs scraper...');
    const programs = await scraper.scrapeAll();

    console.log(`Successfully scraped ${programs.length} programs`);

    // Save to JSON file
    await scraper.saveToFile(programs);

    // Print summary
    console.log('\n=== SCRAPING SUMMARY ===');
    console.log(`Total programs: ${programs.length}`);
    console.log(`Programs with co-op: ${programs.filter(p => p.hasCoOp).length}`);
    console.log(`Programs with duration info: ${programs.filter(p => p.duration).length}`);
    console.log(`Programs with credential info: ${programs.filter(p => p.credential).length}`);

  } catch (error) {
    console.error('Scraping failed:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export default UManitobaScraper; 