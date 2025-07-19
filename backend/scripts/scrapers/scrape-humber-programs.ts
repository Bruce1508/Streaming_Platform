import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';

interface HumberProgram {
    name: string;
    credential: string;
    duration: string;
    campus: string[];
    url: string;
}

async function main() {
    const url = 'https://humber.ca/search/full-time-international-programs/by-availability.html?date=Fall%202025%20(Sep%20-%20Dec)';
    const browser = await puppeteer.launch({ headless: false }); // Show browser to see what's happening
    const page = await browser.newPage();
    
    console.log('🔄 Navigating to Humber International Programs page...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for the table to load
    console.log('⏳ Waiting for programs table to load...');
    await page.waitForSelector('table', { timeout: 30000 });

    // Wait a bit more for dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📊 Scraping program data...');
    const programsRaw = await page.evaluate(() => {
        // Look for table rows with program data
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        
        console.log(`Found ${rows.length} table rows`);
        
        return rows.map((row, index) => {
            const cells = row.querySelectorAll('td');
            
            if (cells.length < 5) {
                console.log(`Row ${index} has only ${cells.length} cells, skipping`);
                return null;
            }

            // Get program link from first cell
            const programLink = cells[0]?.querySelector('a');
            const programUrl = programLink?.getAttribute('href') || '';
            const fullUrl = programUrl.startsWith('http') ? programUrl : `https://humber.ca${programUrl}`;
            
            // Extract campus information from "International In Canada" and "International Out of Canada" columns
            const intlInCanada = cells[2]?.textContent?.trim() || '';
            const intlOutCanada = cells[3]?.textContent?.trim() || '';
            
            // Parse campus from these fields (e.g., "Open - North" -> "North")
            const campuses: string[] = [];
            if (intlInCanada.includes('North')) campuses.push('North');
            if (intlInCanada.includes('Lakeshore')) campuses.push('Lakeshore');
            if (intlInCanada.includes('Downtown')) campuses.push('Downtown');
            if (intlOutCanada.includes('North') && !campuses.includes('North')) campuses.push('North');
            if (intlOutCanada.includes('Lakeshore') && !campuses.includes('Lakeshore')) campuses.push('Lakeshore');
            if (intlOutCanada.includes('Downtown') && !campuses.includes('Downtown')) campuses.push('Downtown');
            
            // Default to main campus if no specific campus found
            if (campuses.length === 0) campuses.push('North');

            const program = {
                name: cells[0]?.textContent?.trim() || '',
                credential: cells[1]?.textContent?.trim() || '',
                duration: cells[4]?.textContent?.trim() || '', // Length column
                campus: campuses,
                url: fullUrl
            };
            
            console.log(`Program ${index}: ${program.name}`);
            return program;
        }).filter(program => program !== null && program.name !== '');
    });

    await browser.close();

    // Filter out null values and ensure type safety
    const programs: HumberProgram[] = programsRaw.filter((program): program is HumberProgram => program !== null);

    console.log(`✅ Scraped ${programs.length} programs`);
    
    // Save to output directory
    const outputDir = '../output/humber';
    await fs.ensureDir(outputDir);
    await fs.writeJSON(`${outputDir}/humber.json`, programs, { spaces: 2 });
    console.log('💾 Saved to:', `${outputDir}/humber.json`);
    
    // Show sample of scraped data
    if (programs.length > 0) {
        console.log('\n📋 Sample program:');
        console.log(JSON.stringify(programs[0], null, 2));
    }
}

main().catch(console.error); 