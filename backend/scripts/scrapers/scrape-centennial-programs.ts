import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';
import * as path from 'path';

interface CentennialProgram {
    id: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery: string;
    credential: string;
    school: string;
    url?: string;
}

async function main() {
    try {
        // Load existing programs
        const existingDataPath = path.join(__dirname, '../output/centennial/centennial_programs_manual.json');
        const existingPrograms: CentennialProgram[] = await fs.readJSON(existingDataPath);
        console.log(`✅ Loaded ${existingPrograms.length} existing programs`);

        const browser = await puppeteer.launch({ 
            headless: false, 
            slowMo: 100 
        });
        const page = await browser.newPage();

        // Navigate to Centennial programs page
        await page.goto('https://www.centennialcollege.ca/programs-courses/full-time', { 
            waitUntil: 'networkidle2' 
        });

        console.log('🔍 Scraping program URLs...');

        // Get all program links
        const programLinks = await page.evaluate(() => {
            const links: { name: string; url: string }[] = [];
            const programElements = document.querySelectorAll('a[href*="/programs-courses/full-time/"]');
            
            programElements.forEach(link => {
                const href = link.getAttribute('href');
                const name = link.textContent?.trim();
                if (href && name && href.includes('/programs-courses/full-time/') && !href.endsWith('/full-time')) {
                    links.push({
                        name: name,
                        url: href.startsWith('http') ? href : `https://www.centennialcollege.ca${href}`
                    });
                }
            });
            return links;
        });

        console.log(`📋 Found ${programLinks.length} program links`);

        // Match URLs with existing programs
        let matchedCount = 0;
        for (const program of existingPrograms) {
            // Try to find matching URL by name similarity
            const matchingLink = programLinks.find(link => {
                const linkName = link.name.toLowerCase().replace(/[^\w\s]/g, '');
                const programName = program.name.toLowerCase().replace(/[^\w\s]/g, '');
                return linkName.includes(programName.substring(0, 15)) || 
                       programName.includes(linkName.substring(0, 15));
            });

            if (matchingLink) {
                program.url = matchingLink.url;
                matchedCount++;
            }
        }

        await browser.close();

        console.log(`✅ Matched ${matchedCount} programs with URLs`);

        // Save updated data
        await fs.writeJSON(existingDataPath, existingPrograms, { spaces: 2 });
        console.log('✅ Updated centennial_programs_manual.json with URLs');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main().catch(console.error); 