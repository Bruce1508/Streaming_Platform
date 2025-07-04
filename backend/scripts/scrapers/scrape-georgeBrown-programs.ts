import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';

interface GeorgeBrownProgram {
    name: string;
    credential: string;
    international: string;
    overview: string;
    duration: string;
}

async function main() {
    const url = 'https://www.georgebrown.ca/programs/program-finder?type=fulltime';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the table to load
    await page.waitForSelector('table tbody');

    // Get all main program rows (not expanded rows)
    const programRowSelectors = await page.$$eval('table tbody tr', rows =>
        rows
            .map((row, idx) => ({
                idx,
                isMain: !row.classList.contains('expanded-row') && row.querySelector('td a, td .title, td .program-title')
            }))
            .filter(r => r.isMain)
            .map(r => r.idx)
    );

    const programs: GeorgeBrownProgram[] = [];

    for (const rowIdx of programRowSelectors) {
        // Get selectors for this row and the expanded row
        const mainRowSelector = `table tbody tr:nth-child(${rowIdx + 1})`;
        const expandBtn = await page.$(`${mainRowSelector} button, ${mainRowSelector} .fa-chevron-down`);

        // Extract name, credential, international from main row
        const [name, credential, international] = await page.$$eval(
            `${mainRowSelector} td`,
            tds => tds.slice(1, 4).map(td => td.textContent?.trim() || '')
        );

        // Expand details if possible
        if (expandBtn) {
            await expandBtn.click();
            // Wait for expanded row to appear right after main row
            await page.waitForSelector(`table tbody tr.expanded-row:nth-child(${rowIdx + 2})`, { timeout: 2000 }).catch(() => {});
        }

        // Get overview and duration from expanded row (immediately after main row)
        let overview = '';
        let duration = '';
        const expandedRow = await page.$(`table tbody tr.expanded-row:nth-child(${rowIdx + 2})`);
        if (expandedRow) {
            const expandedText = await expandedRow.evaluate(row => row.innerText);
            // Overview: first non-empty line not starting with 'Duration:'
            overview = expandedText.split('\n').find(line => line && !/^Duration:/i.test(line)) || '';
            // Duration: line starting with 'Duration:'
            const durationLine = expandedText.split('\n').find(line => /^Duration:/i.test(line));
            duration = durationLine ? durationLine.replace(/^Duration:\s*/i, '') : '';
        }

        programs.push({ name, credential, international, overview, duration });

        // Collapse if needed
        if (expandBtn) {
            await expandBtn.click();
        }
    }

    await browser.close();
    await fs.writeJson('georgebrown_programs.json', programs, { spaces: 2 });
    console.log('Done! Data saved to georgebrown_programs.json');
}

main();
