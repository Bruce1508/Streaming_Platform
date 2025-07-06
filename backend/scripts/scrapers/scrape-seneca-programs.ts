import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import * as path from 'path';

interface ProgramData {
    id: string;
    name: string;
    code: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery: string;
    credential: string;
    school: string;
}

class SenecaProgramScraper {
    private baseUrl = 'https://www.senecapolytechnic.ca';
    private outputDir = './scripts/output';

    constructor() {
        this.ensureOutputDir();
    }

    private async ensureOutputDir() {
        await fs.ensureDir(this.outputDir);
        await fs.ensureDir(path.join(this.outputDir, 'raw'));
        await fs.ensureDir(path.join(this.outputDir, 'processed'));
    }

    async testScrapeOneProgram(): Promise<void> {
        console.log('🧪 Testing scraping with one program...');

        const testUrl = 'https://www.senecapolytechnic.ca/programs/fulltime/CPA.html';
        const testCode = 'CPA';

        try {
            const response = await axios.get(testUrl);
            const $ = cheerio.load(response.data);

            // Debug: In ra tất cả headings
            console.log('\n📋 All headings found:');
            $('h1, h2, h3, h4').each((index, element) => {
                console.log(`H${element.tagName.slice(-1)}: "${$(element).text().trim()}"`);
            });

            // Debug: In ra các paragraph đầu tiên
            console.log('\n📄 First few paragraphs:');
            $('p').slice(0, 5).each((index, element) => {
                const text = $(element).text().trim();
                console.log(`P${index + 1}: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
            });

            const programData: ProgramData = {
                id: testCode.toLowerCase(),
                code: testCode,
                name: $('h1').first().text().trim(),
                overview: this.extractOverview($),
                duration: this.extractFromSpan($, 'Duration'),
                campus: this.extractCampus($),
                delivery: this.extractFromSpan($, 'Delivery'),
                credential: this.extractCredential($),
                school: this.extractFromSpan($, 'School')
            };

            console.log('\n📋 Final extracted data:');
            console.log('Name:', programData.name);
            console.log('Overview length:', programData.overview.length);
            console.log('Overview preview:', programData.overview.substring(0, 200) + '...');

            // Save to file
            await fs.writeJSON(
                path.join(this.outputDir, 'raw', `${testCode}_test.json`),
                programData,
                { spaces: 2 }
            );

            console.log('✅ Test completed successfully!');

        } catch (error) {
            console.error('❌ Test failed:', error);
        }
    }

    private extractOverview($: any): string {
        let overview = '';

        console.log(`🔍 Looking for About the Program section...`);

        // Method 1: Tìm heading "About the Program"
        $('h1, h2, h3, h4').each((index, element) => {
            const heading = $(element).text().trim();
            console.log(`Found heading: "${heading}"`);

            if (heading.toLowerCase().includes('about the program') ||
                heading.toLowerCase().includes('about') ||
                heading.toLowerCase().includes('program')) {

                console.log(`✅ Found target heading: "${heading}"`);

                // Lấy tất cả thẻ p ngay sau heading này
                let nextElement = $(element).next();
                let attempts = 0;

                while (nextElement.length && attempts < 10) {
                    console.log(`Checking element: ${nextElement.prop('tagName')}, text: "${nextElement.text().substring(0, 50)}..."`);

                    if (nextElement.is('p')) {
                        const text = nextElement.text().trim();
                        if (text.length > 20) {
                            overview += text + ' ';
                            console.log(`Added paragraph: "${text.substring(0, 100)}..."`);
                        }
                    } else if (nextElement.is('div, section, article')) {
                        // Tìm tất cả thẻ p bên trong
                        nextElement.find('p').each((i, p) => {
                            const text = $(p).text().trim();
                            if (text.length > 20) {
                                overview += text + ' ';
                                console.log(`Added nested paragraph: "${text.substring(0, 100)}..."`);
                            }
                        });
                    }

                    // Dừng nếu gặp heading khác
                    if (nextElement.is('h1, h2, h3, h4')) {
                        console.log(`Stopped at next heading: "${nextElement.text()}"`);
                        break;
                    }

                    nextElement = nextElement.next();
                    attempts++;
                }

                if (overview.length > 0) {
                    console.log(`✅ Found overview (${overview.length} chars)`);
                    return false; // break loop
                }
            }
        });

        // Method 2: Nếu không tìm thấy, tìm trong table hoặc main content
        if (!overview) {
            console.log(`❌ Method 1 failed, trying Method 2...`);

            // Tìm trong table cells có nội dung dài
            $('td, .program-description, .about, .overview').each((index, element) => {
                const text = $(element).text().trim();
                if (text.length > 100 && text.length < 2000 &&
                    text.toLowerCase().includes('program') &&
                    !text.toLowerCase().includes('campus') &&
                    !text.toLowerCase().includes('starts in')) {
                    overview = text;
                    console.log(`✅ Found overview in table/description: "${text.substring(0, 100)}..."`);
                    return false;
                }
            });
        }

        // Method 3: Lấy paragraph đầu tiên có nội dung dài
        if (!overview) {
            console.log(`❌ Method 2 failed, trying Method 3...`);

            $('p').each((index, element) => {
                const text = $(element).text().trim();
                if (text.length > 100 && text.length < 2000 &&
                    text.toLowerCase().includes('program')) {
                    overview = text;
                    console.log(`✅ Found overview in first long paragraph: "${text.substring(0, 100)}..."`);
                    return false;
                }
            });
        }

        if (!overview) {
            console.log(`❌ Could not find overview`);
        }

        return overview.trim();
    }

    private extractFromSpan($: cheerio.CheerioAPI, field: string): string {
        let result = '';

        console.log(`🔍 Looking for field: ${field}`);

        // Method 1: Tìm trong thẻ span và a có text chứa field name
        $('span, a').each((index, element) => {
            const elementText = $(element).text().trim();

            // Tìm element có format "Field: Value" hoặc "Field Value"
            if (elementText.toLowerCase().includes(field.toLowerCase())) {
                // Nếu element chứa cả label và value
                if (elementText.includes(':')) {
                    const parts = elementText.split(':');
                    if (parts.length > 1) {
                        result = parts[1].trim();
                        console.log(`✅ Found ${field} in Method 1 (with colon):`, result);
                        return false;
                    }
                }
                // Nếu element chỉ chứa value (label ở element khác)
                else {
                    // Kiểm tra element trước hoặc sau có chứa field name không
                    const prevElement = $(element).prev('span, a, dt, label').text();
                    const nextElement = $(element).next('span, a, dt, label').text();
                    const parentText = $(element).parent().text();

                    if (prevElement.toLowerCase().includes(field.toLowerCase()) ||
                        nextElement.toLowerCase().includes(field.toLowerCase()) ||
                        parentText.toLowerCase().includes(field.toLowerCase())) {
                        result = elementText;
                        console.log(`✅ Found ${field} in Method 1 (context):`, result);
                        return false;
                    }
                }
            }
        });

        // Method 2: Tìm theo cấu trúc dt/dd hoặc label/value
        if (!result) {
            $(`dt:contains("${field}"), .label:contains("${field}"), .field-label:contains("${field}")`).each((index, element) => {
                const valueElement = $(element).next();
                if (valueElement.find('span, a').length > 0) {
                    result = valueElement.find('span, a').first().text().trim();
                    console.log(`✅ Found ${field} in Method 2:`, result);
                    return false;
                }
            });
        }

        // Method 3: Tìm trong structure có class program-info, program-details
        if (!result) {
            $(`.program-info span, .program-info a, .program-details span, .program-details a, .info-box span, .info-box a`).each((index, element) => {
                const parent = $(element).parent();
                const parentText = parent.text();

                if (parentText.toLowerCase().includes(field.toLowerCase())) {
                    result = $(element).text().trim();
                    console.log(`✅ Found ${field} in Method 3:`, result);
                    return false;
                }
            });
        }

        // Method 4: Tìm theo pattern cụ thể cho Campus (vì có thể là link)
        if (!result && field.toLowerCase() === 'campus') {
            $('a[href*="campus"], a[href*="location"]').each((index, element) => {
                const linkText = $(element).text().trim();
                if (linkText.length > 0 && linkText.length < 50) { // Giới hạn độ dài hợp lý
                    result = linkText;
                    console.log(`✅ Found Campus in Method 4 (campus link):`, result);
                    return false;
                }
            });
        }

        if (!result) {
            console.log(`❌ Could not find ${field}`);
        }

        return result;
    }

    private extractCampus($: cheerio.CheerioAPI): string[] {
        const campuses: string[] = [];

        // Method 1: Tìm trong program info summary (sidebar)
        $('.program-summary dd, .program-info dd').each((index, element) => {
            const prevLabel = $(element).prev('dt').text().toLowerCase();
            if (prevLabel.includes('campus')) {
                const campusText = $(element).text().trim();
                if (campusText && campusText.length < 30 &&
                    !campusText.toLowerCase().includes('location') &&
                    !campusText.toLowerCase().includes('campus')) {
                    campuses.push(campusText);
                }
            }
        });

        // Method 2: Tìm campus names cụ thể (danh sách campus thông dụng của Seneca)
        const senecaCampuses = ['Newnham', 'King', 'Markham', 'Seneca@York', 'Online'];

        $('*').each((index, element) => {
            const text = $(element).text().trim();
            const context = $(element).parent().text().toLowerCase();

            // Nếu context chứa "campus" và text là tên campus thực tế
            if (context.includes('campus') && senecaCampuses.includes(text)) {
                campuses.push(text);
            }
        });

        // Loại bỏ duplicate
        const uniqueCampuses = [...new Set(campuses)];

        console.log(`🏫 Found campuses: ${uniqueCampuses.join(', ')}`);

        return uniqueCampuses;
    }

    private extractCredential($: cheerio.CheerioAPI): string {
        let result = '';

        $('*').each((index, element) => {
            const isInHeaderNav = $(element).closest('header, nav, .header, .navigation, .nav, .menu').length > 0;
            if (isInHeaderNav) return;

            const text = $(element).text().trim();

            if (text.toLowerCase().includes('credential')) {
                // Tìm và extract credential
                let extracted = text.replace(/^.*credential[:\s]+/i, ''); // Bỏ phần trước "credential"

                // Dừng ở từ khóa tiếp theo
                const stopWords = ['school', 'duration', 'campus', 'starts', 'delivery'];

                stopWords.forEach(stopWord => {
                    const regex = new RegExp(`\\s+${stopWord}`, 'i');
                    extracted = extracted.split(regex)[0];
                });

                // Dọn dẹp kết quả
                extracted = extracted.trim();

                if (extracted.length > 10 && extracted.length < 100) {
                    result = extracted;
                    console.log(`✅ Found credential: "${result}"`);
                    return false;
                }
            }
        });

        return result;
    }

    async scrapeNextBatch(startIndex: number = 50, batchSize: number = 50): Promise<void> {
        console.log(`🚀 Starting to scrape batch ${startIndex + 1} to ${startIndex + batchSize}...`);

        try {
            // 1. Lấy danh sách tất cả programs từ trang chủ
            const programsListUrl = 'https://www.senecapolytechnic.ca/programs/alphabetical.html';
            const response = await axios.get(programsListUrl);
            const $ = cheerio.load(response.data);

            const programLinks: { name: string, code: string, url: string }[] = [];

            // Tìm tất cả link programs
            $('a[href*="/programs/fulltime/"]').each((index, element) => {
                const href = $(element).attr('href');
                const name = $(element).text().trim();

                if (href && href.includes('.html')) {
                    const code = href.match(/\/([A-Z0-9]+)\.html$/)?.[1];
                    if (code && name.length > 0) {
                        programLinks.push({
                            name,
                            code,
                            url: href.startsWith('http') ? href : this.baseUrl + href
                        });
                    }
                }
            });

            console.log(`📋 Found total ${programLinks.length} programs`);
            console.log(`🎯 Will scrape programs ${startIndex + 1} to ${Math.min(startIndex + batchSize, programLinks.length)}`);

            // Load existing data if available
            const existingDataPath = path.join(this.outputDir, 'processed', 'all_programs.json');
            let allProgramsData: ProgramData[] = [];

            if (await fs.pathExists(existingDataPath)) {
                allProgramsData = await fs.readJSON(existingDataPath);
                console.log(`📂 Loaded ${allProgramsData.length} existing programs`);
            }

            // 2. Scrape batch programs
            const endIndex = Math.min(startIndex + batchSize, programLinks.length);
            const newProgramsData: ProgramData[] = [];

            for (let i = startIndex; i < endIndex; i++) {
                const program = programLinks[i];
                console.log(`\n🔍 Scraping ${i + 1}/${programLinks.length}: ${program.name} (${program.code})`);

                // Check if already exists
                const alreadyExists = allProgramsData.find(p => p.code === program.code);
                if (alreadyExists) {
                    console.log(`⏭️ Already exists, skipping: ${program.code}`);
                    continue;
                }

                try {
                    const programData = await this.scrapeSingleProgram(program.url, program.code);
                    if (programData) {
                        newProgramsData.push(programData);
                        allProgramsData.push(programData);
                        console.log(`✅ Successfully scraped: ${program.code}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to scrape ${program.code}:`, error);
                }

                // Delay 2 giây giữa các request
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // 3. Save updated data
            await fs.writeJSON(
                existingDataPath,
                allProgramsData,
                { spaces: 2 }
            );

            // 4. Also save just the new batch
            const batchFileName = `programs_batch_${startIndex + 1}-${startIndex + newProgramsData.length}.json`;
            await fs.writeJSON(
                path.join(this.outputDir, 'processed', batchFileName),
                newProgramsData,
                { spaces: 2 }
            );

            console.log(`\n🎉 Batch scraping completed!`);
            console.log(`✅ New programs scraped: ${newProgramsData.length}`);
            console.log(`📊 Total programs now: ${allProgramsData.length}`);
            console.log(`📁 Updated: ${existingDataPath}`);
            console.log(`📁 New batch: ${path.join(this.outputDir, 'processed', batchFileName)}`);

        } catch (error) {
            console.error('❌ Batch scraping failed:', error);
        }
    }

    async scrapeAllPrograms(): Promise<void> {
        console.log('🚀 Starting to scrape ALL Seneca programs...');

        try {
            // 1. Lấy danh sách tất cả programs từ trang chủ
            const programsListUrl = 'https://www.senecapolytechnic.ca/programs/alphabetical.html';
            const response = await axios.get(programsListUrl);
            const $ = cheerio.load(response.data);

            const programLinks: { name: string, code: string, url: string }[] = [];

            // Tìm tất cả link programs
            $('a[href*="/programs/fulltime/"]').each((index, element) => {
                const href = $(element).attr('href');
                const name = $(element).text().trim();

                if (href && href.includes('.html')) {
                    const code = href.match(/\/([A-Z0-9]+)\.html$/)?.[1];
                    if (code && name.length > 0) {
                        programLinks.push({
                            name,
                            code,
                            url: href.startsWith('http') ? href : this.baseUrl + href
                        });
                    }
                }
            });

            console.log(`📋 Found ${programLinks.length} programs to scrape`);

            // Load existing data if available
            const existingDataPath = path.join(this.outputDir, 'processed', 'all_programs.json');
            let allProgramsData: ProgramData[] = [];

            if (await fs.pathExists(existingDataPath)) {
                allProgramsData = await fs.readJSON(existingDataPath);
                console.log(`📂 Loaded ${allProgramsData.length} existing programs`);
            }

            const newProgramsData: ProgramData[] = [];

            // 2. Scrape từng program (với delay để không bị block)
            for (let i = 0; i < Math.min(programLinks.length, 50); i++) { // Giới hạn 50 programs đầu tiên
                const program = programLinks[i];
                console.log(`\n🔍 Scraping ${i + 1}/${programLinks.length}: ${program.name} (${program.code})`);

                // Check if already exists
                const alreadyExists = allProgramsData.find(p => p.code === program.code);
                if (alreadyExists) {
                    console.log(`⏭️ Already exists, skipping: ${program.code}`);
                    continue;
                }

                try {
                    const programData = await this.scrapeSingleProgram(program.url, program.code);
                    if (programData) {
                        allProgramsData.push(programData);
                        newProgramsData.push(programData);
                        console.log(`✅ Successfully scraped: ${program.code}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to scrape ${program.code}:`, error);
                }

                // Delay 2 giây giữa các request
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // 3. Save tất cả data (append to existing)
            await fs.writeJSON(
                existingDataPath,
                allProgramsData,
                { spaces: 2 }
            );

            console.log(`\n🎉 Scraping completed!`);
            console.log(`✅ New programs scraped: ${newProgramsData.length}`);
            console.log(`📊 Total programs now: ${allProgramsData.length}`);
            console.log(`📁 Updated: ${existingDataPath}`);

        } catch (error) {
            console.error('❌ Scraping failed:', error);
        }
    }

    private async scrapeSingleProgram(url: string, code: string): Promise<ProgramData | null> {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            return {
                id: code.toLowerCase(),
                code: code,
                name: $('h1').first().text().trim(),
                overview: this.extractOverview($),
                duration: this.extractFromSpan($, 'Duration'),
                campus: this.extractCampus($),
                delivery: this.extractFromSpan($, 'Delivery'),
                credential: this.extractCredential($),
                school: this.extractFromSpan($, 'School')
            };
        } catch (error) {
            console.error(`Error scraping ${code}:`, error);
            return null;
        }
    }
}

// Main execution
async function main() {
    console.log('🚀 Starting Seneca scraper...');

    const scraper = new SenecaProgramScraper();

    // Chọn một trong các options:
    
    // Option 1: Test 1 program
    // await scraper.testScrapeOneProgram();
    
    // Option 2: Scrape batch đầu tiên (0-49) - sẽ append vào file hiện có
    // await scraper.scrapeAllPrograms();
    
    // Option 3: Scrape batch tiếp theo (50-99)
    // await scraper.scrapeNextBatch(50, 50);
    
    // Option 4: Scrape batch 3 (100-149)
    // await scraper.scrapeNextBatch(100, 50);
    
    // Option 5: Scrape batch 4 (150-199)
    await scraper.scrapeNextBatch(150, 50);
    
    // Option 6: Scrape batch cuối (200-195) - nếu có 195 programs
    // await scraper.scrapeNextBatch(200, 50);
}

// Run script
main().catch(console.error);

export { SenecaProgramScraper };