import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';
import * as path from 'path';

interface ProgramLink {
    name: string;
    url: string;
}

interface ProgramDetail extends ProgramLink {
    degree: string;
    experiential_learning: string;
    full_time_formats: string;
    part_time_formats: string;
}

async function scrapeProgramDetail(page: puppeteer.Page, program: ProgramLink): Promise<ProgramDetail> {
    await page.goto(program.url, { waitUntil: 'networkidle2' });

    // Lấy thông tin chi tiết
    const data = await page.evaluate(() => {
        function getTextByLabel(label: string): string {
            const strongs = Array.from(document.querySelectorAll('strong'));
            for (const el of strongs) {
                if (el.textContent && el.textContent.trim().toLowerCase().startsWith(label.toLowerCase())) {
                    // Lấy text sau strong
                    if (el.nextSibling && el.nextSibling.nodeType === Node.TEXT_NODE) {
                        return el.nextSibling.textContent?.trim() || '';
                    }
                    // Hoặc lấy phần còn lại của parent
                    return el.parentElement?.textContent?.replace(el.textContent, '').trim() || '';
                }
            }
            return '';
        }

        function getBoxValue(label: string): string {
            const box = Array.from(document.querySelectorAll('div, aside')).find(el => {
                const text = el.textContent || '';
                return text.includes('Requirements') && text.includes('Grade range');
            });
            if (box) {
                const bolds = Array.from(box.querySelectorAll('b, strong'));
                for (const el of bolds) {
                    if (el.textContent && el.textContent.trim().toLowerCase().startsWith(label.toLowerCase())) {
                        if (el.nextSibling && el.nextSibling.nodeType === Node.TEXT_NODE) {
                            return el.nextSibling.textContent?.trim() || '';
                        }
                    }
                }
            }
            return '';
        }

        return {
            degree: getTextByLabel('Degree:'),
            experiential_learning: getBoxValue('Experiential learning'),
            full_time_formats: getBoxValue('Full-time formats'),
            part_time_formats: getBoxValue('Part-time formats'),
        };
    });

    return {
        ...program,
        degree: data.degree,
        experiential_learning: data.experiential_learning,
        full_time_formats: data.full_time_formats,
        part_time_formats: data.part_time_formats,
    };
}

async function main() {
    const inputPath = path.join(__dirname, '../output/processed/tmu_program_links.json');
    const outputPath = path.join(__dirname, '../output/processed/tmu_programs_detail.json');
    const programLinks: ProgramLink[] = await fs.readJSON(inputPath);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const results: ProgramDetail[] = [];
    let count = 0;

    for (const program of programLinks) {
        count++;
        console.log(`🔍 Scraping ${count}/${programLinks.length}: ${program.name}`);
        try {
            const detail = await scrapeProgramDetail(page, program);
            results.push(detail);
            console.log(`✅ Done: ${program.name}`);
        } catch (err) {
            console.error(`❌ Error scraping ${program.name}:`, err);
        }
        await new Promise(res => setTimeout(res, 1000)); // Delay nhẹ tránh bị chặn
    }

    await fs.writeJSON(outputPath, results, { spaces: 2 });
    await browser.close();
    console.log(`🎉 Done! Output: ${outputPath}`);
}

main().catch(console.error);