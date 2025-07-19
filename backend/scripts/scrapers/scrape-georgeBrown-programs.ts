import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';

interface GeorgeBrownProgram {
    name: string;
    credential: string;
    international: string;
    duration: string;
    programId: string;
    url: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeGeorgeBrownPrograms() {
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 300, // Giảm tốc độ
        devtools: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('Navigating to page...');
    await page.goto('https://www.georgebrown.ca/programs/program-finder?type=fulltime', {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });
    
    console.log('Page loaded, waiting for content...');
    await delay(5000);
    
    // Kiểm tra table
    const tableExists = await page.evaluate(() => {
        const table = document.querySelector('table');
        const tbody = document.querySelector('tbody');
        const rows = document.querySelectorAll('tbody tr');
        
        return {
            hasTable: !!table,
            hasTbody: !!tbody,
            rowCount: rows.length
        };
    });
    
    console.log('Table check result:', tableExists);
    
    if (!tableExists.hasTable || !tableExists.hasTbody) {
        console.log('❌ Table not found!');
        await browser.close();
        return [];
    }
    
    console.log(`Found ${tableExists.rowCount} rows`);
    
    // Lấy basic data trước
    const programs = await page.evaluate(() => {
        const results: any[] = [];
        const rows = document.querySelectorAll('tbody tr.program-row');
        
        rows.forEach((row, index) => {
            try {
                const programId = row.getAttribute('data-program-year-id') || '';
                const programLink = row.querySelector('a.program-title-link');
                const programName = programLink?.textContent?.trim() || '';
                const programUrl = programLink?.getAttribute('href') || '';
                const credentialCell = row.querySelector('td.views-field-field-credential');
                const credential = credentialCell?.textContent?.trim() || '';
                const internationalCell = row.querySelector('td.views-field-field-intern-students-can-apply .intern-availability');
                const international = internationalCell?.textContent?.trim() || '';
                
                if (programName) {
                    results.push({
                        name: programName,
                        credential,
                        international,
                        duration: '',
                        programId,
                        url: programUrl.startsWith('http') ? programUrl : `https://www.georgebrown.ca${programUrl}`,
                        processed: false // Thêm flag để track
                    });
                }
            } catch (error:any) {
                console.error(`Error processing row ${index + 1}:`, error);
            }
        });
        
        return results;
    });
    
    console.log(`✓ Successfully scraped ${programs.length} programs without expansion`);
    
    // Xử lý duration cho TẤT CẢ programs
    console.log('\n--- Processing durations for ALL programs ---');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < programs.length; i++) { // KHÔNG giới hạn số lượng
        try {
            const program = programs[i];
            console.log(`\n[${i + 1}/${programs.length}] Processing: ${program.name}`);
            
            // Strategy mới: Tìm lại row mỗi lần để tránh stale elements
            const result = await page.evaluate((programId, programName) => {
                // Tìm row bằng programId
                const row = document.querySelector(`tr.program-row[data-program-year-id="${programId}"]`);
                if (!row) {
                    console.log('Row not found by programId, trying by name...');
                    // Fallback: Tìm bằng tên program
                    const allRows = document.querySelectorAll('tbody tr.program-row');
                    for (const r of allRows) {
                        const link = r.querySelector('a.program-title-link');
                        if (link && link.textContent?.includes(programName.substring(0, 20))) {
                            return { row: r, found: true };
                        }
                    }
                    return { row: null, found: false };
                }
                return { row, found: true };
            }, program.programId, program.name);
            
            if (!result.found) {
                console.log(`❌ Row not found for: ${program.name}`);
                failCount++;
                continue;
            }
            
            // Click expand với retry mechanism
            let expandSuccess = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    await page.evaluate((programId) => {
                        const row = document.querySelector(`tr.program-row[data-program-year-id="${programId}"]`);
                        if (row) {
                            const expandButton = row.querySelector('a.program-title');
                            if (expandButton) {
                                (expandButton as HTMLElement).click();
                                return true;
                            }
                        }
                        return false;
                    }, program.programId);
                    
                    // Đợi lâu hơn cho expand animation
                    await delay(3000);
                    
                    // Check xem expanded row có xuất hiện không
                    const expandedExists = await page.evaluate((programId) => {
                        const expandedRow = document.querySelector(`tr.program-overview[data-program-year-id="${programId}"]`);
                        return !!expandedRow;
                    }, program.programId);
                    
                    if (expandedExists) {
                        expandSuccess = true;
                        break;
                    } else {
                        console.log(`Attempt ${attempt} failed, retrying...`);
                        await delay(1000);
                    }
                } catch (e:any) {
                    console.log(`Expand attempt ${attempt} error:`, e.message);
                }
            }
            
            if (!expandSuccess) {
                console.log(`❌ Failed to expand after 3 attempts: ${program.name}`);
                failCount++;
                continue;
            }
            
            // Lấy duration
            const duration = await page.evaluate((programId) => {
                const expandedRow = document.querySelector(`tr.program-overview[data-program-year-id="${programId}"]`);
                
                if (expandedRow) {
                    const fullText = expandedRow.textContent || '';
                    
                    // Method 1: Tìm "Duration:" và lấy text sau nó
                    const durationMatch1 = fullText.match(/Duration:\s*([^\n\r]+)/i);
                    if (durationMatch1) {
                        let duration = durationMatch1[1].trim();
                        duration = duration.replace(/\s*(View full Program details|Add to Comparison).*$/i, '');
                        if (duration) {
                            return duration;
                        }
                    }
                    
                    // Method 2: Tìm pattern "X year(s) (Y semester(s))"
                    const durationMatch2 = fullText.match(/(\d+\s+years?\s*\(\s*\d+\s+semesters?\s*\))/i);
                    if (durationMatch2) {
                        return durationMatch2[1].trim();
                    }
                    
                    // Method 3: Tìm chỉ "X year(s)"
                    const durationMatch3 = fullText.match(/(\d+\s+years?)/i);
                    if (durationMatch3) {
                        return durationMatch3[1].trim();
                    }
                    
                    return '';
                } else {
                    return '';
                }
            }, program.programId);
            
            program.duration = duration;
            program.processed = true;
            
            if (duration) {
                console.log(`✅ Duration found: "${duration}"`);
                successCount++;
            } else {
                console.log(`⚠️ No duration found`);
                failCount++;
            }
            
            // Collapse lại
            await page.evaluate((programId) => {
                const row = document.querySelector(`tr.program-row[data-program-year-id="${programId}"]`);
                if (row) {
                    const expandButton = row.querySelector('a.program-title');
                    if (expandButton) {
                        (expandButton as HTMLElement).click();
                    }
                }
            }, program.programId);
            
            // Đợi collapse animation
            await delay(1500);
            
            // Progress report mỗi 10 programs
            if ((i + 1) % 10 === 0) {
                console.log(`\n📊 Progress: ${i + 1}/${programs.length} | Success: ${successCount} | Failed: ${failCount}`);
            }
            
        } catch (error:any) {
            console.error(`❌ Error processing ${programs[i].name}:`, error.message);
            failCount++;
        }
    }
    
    await browser.close();
    
    // Cleanup và save
    const cleanPrograms = programs.map(p => ({
        name: p.name,
        credential: p.credential,
        international: p.international,
        duration: p.duration,
        programId: p.programId,
        url: p.url
    }));
    
    await fs.writeJson('georgebrown_programs_complete.json', cleanPrograms, { spaces: 2 });
    
    console.log(`\n🎉 COMPLETED!`);
    console.log(`📈 Total programs: ${programs.length}`);
    console.log(`✅ Successfully got duration: ${successCount}`);
    console.log(`❌ Failed to get duration: ${failCount}`);
    console.log(`📊 Success rate: ${Math.round((successCount/programs.length) * 100)}%`);
    
    // Show programs with duration
    const programsWithDuration = cleanPrograms.filter(p => p.duration);
    console.log(`\n📄 Sample programs with duration:`);
    programsWithDuration.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   Duration: ${p.duration}`);
    });
    
    return cleanPrograms;
}

scrapeGeorgeBrownPrograms().catch(console.error);