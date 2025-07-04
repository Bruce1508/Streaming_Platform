import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';

interface HumberProgram {
    name: string;
    credential: string;
    length: string;
    location: string;
}

async function main() {
    const url = 'https://mediaarts.humber.ca/future-students/explore/full-time/all-programs.html';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scrape all program data
    const programs: HumberProgram[] = await page.evaluate(() => {
        // Each program is a <tr> in <tbody>
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            // 0: Program Name, 1: Credential, 2: Length, 3: Location, 4: Program Code
            return {
                name: cells[0]?.textContent?.trim() || '',
                credential: cells[1]?.textContent?.trim() || '',
                length: cells[2]?.textContent?.trim() || '',
                location: cells[3]?.textContent?.trim() || '',
            };
        });
    });

    await browser.close();

    // Save to JSON file
    await fs.writeJSON('humber_programs.json', programs, { spaces: 2 });
    console.log('✅ Scraped', programs.length, 'programs. Output: humber_programs.json');
}

main().catch(console.error); 