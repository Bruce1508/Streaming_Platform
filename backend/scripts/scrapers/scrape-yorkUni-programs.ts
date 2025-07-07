import * as puppeteer from 'puppeteer';
import * as fs from 'fs-extra';

interface YorkProgram {
    name: string;
    degree: string;
    offeredBy: string;
    campus: string;
    experientialEducation: string;
    url: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeAllYorkUniversityPrograms() {
    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;
    
    const programs: YorkProgram[] = [];
    let successCount = 0;
    let errorCount = 0;
    let restartCount = 0;
    
    // Function để khởi tạo lại browser
    const initBrowser = async () => {
        if (browser) {
            try {
                await browser.close();
            } catch (e:any) {
                console.log('Error closing browser:', e.message);
            }
        }
        
        browser = await puppeteer.launch({ 
            headless: false,
            slowMo: 300,
            protocolTimeout: 120000, // 2 minutes
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-extensions',
                '--disable-images', // Tăng tốc
                '--disable-javascript', // Có thể disable nếu không cần JS
            ]
        });
        
        page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        // Disable images để tăng tốc
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if(req.resourceType() == 'image' || req.resourceType() == 'stylesheet' || req.resourceType() == 'font'){
                req.abort();
            } else {
                req.continue();
            }
        });
        
        restartCount++;
        console.log(`🔄 Browser initialized (restart #${restartCount})`);
    };
    
    try {
        await initBrowser();
        
        console.log('🚀 Getting program list...');
        await page!.goto('https://futurestudents.yorku.ca/program-search', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        
        await delay(3000);
        
        // Lấy program links
        const programLinks = await page!.evaluate(() => {
            const results: { name: string; url: string }[] = [];
            const programElements = document.querySelectorAll('a[href*="/program/"]');
            
            programElements.forEach(element => {
                const href = element.getAttribute('href') || '';
                
                if (href && !href.includes('program-search')) {
                    const urlParts = href.split('/');
                    const programSlug = urlParts[urlParts.length - 1];
                    const programName = programSlug
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    const elementText = element.textContent?.trim() || '';
                    const finalName = elementText.length > 0 && elementText !== 'Learn More' ? elementText : programName;
                    
                    const fullUrl = href.startsWith('http') ? href : `https://futurestudents.yorku.ca${href}`;
                    results.push({ name: finalName, url: fullUrl });
                }
            });
            
            return results.filter((item, index, self) => 
                self.findIndex(t => t.url === item.url) === index
            );
        });
        
        console.log(`🎯 Found ${programLinks.length} programs to scrape`);
        
        // Save checkpoint để resume nếu cần
        await fs.writeJson('york_program_links.json', programLinks);
        
        for (let i = 0; i < programLinks.length; i++) {
            let retryCount = 0;
            const maxRetries = 3;
            let success = false;
            
            while (!success && retryCount < maxRetries) {
                try {
                    const programLink = programLinks[i];
                    
                    // Progress logging
                    if ((i + 1) % 20 === 0 || i === 0) {
                        console.log(`\n📈 Progress: ${i + 1}/${programLinks.length} (${Math.round((i + 1)/programLinks.length * 100)}%)`);
                        console.log(`✅ Success: ${successCount} | ❌ Errors: ${errorCount} | 🔄 Restarts: ${restartCount}`);
                        
                        // Restart browser mỗi 50 programs để tránh memory leaks
                        if ((i + 1) % 50 === 0) {
                            console.log('🔄 Restarting browser for stability...');
                            await initBrowser();
                        }
                    }
                    
                    console.log(`[${i + 1}] ${programLink.name} ${retryCount > 0 ? `(retry ${retryCount})` : ''}`);
                    
                    await page!.goto(programLink.url, {
                        waitUntil: 'domcontentloaded',
                        timeout: 45000 // Tăng timeout
                    });
                    
                    await delay(2000);
                    
                    const programDetails = await page!.evaluate((linkName) => {
                        const details = {
                            name: linkName,
                            degree: '',
                            offeredBy: '',
                            campus: '',
                            experientialEducation: ''
                        };
                        
                        // Get program name
                        const nameSelectors = ['h1.program__title', 'h1'];
                        for (const selector of nameSelectors) {
                            const element = document.querySelector(selector);
                            if (element) {
                                const nameText = element.textContent?.trim() || '';
                                if (nameText && nameText !== 'Future Students' && nameText.length > 2) {
                                    details.name = nameText;
                                    break;
                                }
                            }
                        }
                        
                        // Validation function
                        const isValidValue = (value: string, fieldType: string): boolean => {
                            if (!value || value.length < 2) return false;
                            
                            const falsePhrases = [
                                'and share their experiences at York',
                                'studies or separately',
                                'Additional details',
                                'are available here'
                            ];
                            
                            if (falsePhrases.some(phrase => value.includes(phrase))) return false;
                            
                            switch (fieldType) {
                                case 'degree':
                                    return value.length <= 20 && /^[A-Za-z, ]+$/.test(value);
                                case 'campus':
                                    const validCampuses = ['Keele Campus', 'Glendon Campus', 'Markham Campus'];
                                    return validCampuses.some(campus => value.includes(campus));
                                case 'offeredBy':
                                    return value.includes('Faculty') || value.includes('School');
                                default:
                                    return true;
                            }
                        };
                        
                        // Extract details
                        const allElements = Array.from(document.querySelectorAll('*'));
                        
                        allElements.forEach(element => {
                            const prevElement = element.previousElementSibling;
                            const prevText = prevElement?.textContent?.trim() || '';
                            const currentText = element.textContent?.trim() || '';
                            
                            switch (prevText) {
                                case 'Offered by':
                                    if (!details.offeredBy && isValidValue(currentText, 'offeredBy')) {
                                        details.offeredBy = currentText;
                                    }
                                    break;
                                case 'Offered at':
                                    if (!details.campus) {
                                        let campusText = '';
                                        if (element.tagName === 'UL') {
                                            const firstLi = element.querySelector('li');
                                            campusText = firstLi?.textContent?.trim() || '';
                                        } else {
                                            campusText = currentText;
                                        }
                                        if (isValidValue(campusText, 'campus')) {
                                            details.campus = campusText;
                                        }
                                    }
                                    break;
                                case 'Degrees offered':
                                    if (!details.degree && isValidValue(currentText, 'degree')) {
                                        details.degree = currentText;
                                    }
                                    break;
                                case 'Experiential Education':
                                    if (!details.experientialEducation && currentText.length > 0) {
                                        const cleanText = currentText
                                            .replace(/\n\s*/g, ', ')
                                            .replace(/\s{2,}/g, ' ')
                                            .trim();
                                        details.experientialEducation = cleanText;
                                    }
                                    break;
                            }
                        });
                        
                        return details;
                    }, programLink.name);
                    
                    const program: YorkProgram = {
                        name: programDetails.name,
                        degree: programDetails.degree,
                        offeredBy: programDetails.offeredBy,
                        campus: programDetails.campus,
                        experientialEducation: programDetails.experientialEducation,
                        url: programLink.url
                    };
                    
                    programs.push(program);
                    successCount++;
                    success = true;
                    
                    // Save progress mỗi 10 programs
                    if ((i + 1) % 10 === 0) {
                        await fs.writeJson('york_university_programs_progress.json', {
                            programs,
                            metadata: {
                                lastProcessedIndex: i,
                                totalPrograms: programLinks.length,
                                successCount,
                                errorCount,
                                timestamp: new Date().toISOString()
                            }
                        });
                    }
                    
                } catch (error:any) {
                    retryCount++;
                    console.error(`❌ Error [${i + 1}] (attempt ${retryCount}): ${error.message}`);
                    
                    if (retryCount >= maxRetries) {
                        console.log(`⚠️ Max retries reached for ${programLinks[i].name}, skipping...`);
                        errorCount++;
                        success = true; // Exit retry loop
                    } else {
                        // Wait before retry
                        await delay(5000);
                        
                        // Restart browser if needed
                        if (error.message.includes('Protocol') || error.message.includes('timeout')) {
                            console.log('🔄 Restarting browser due to protocol error...');
                            await initBrowser();
                        }
                    }
                }
            }
        }
        
    } catch (error:any) {
        console.error('Fatal error:', error);
    } finally {
        const browserInstance = browser as puppeteer.Browser | null;
        if (browserInstance) {
            await browserInstance.close();
        }
    }
    
    // Save final results
    await fs.writeJson('york_university_all_programs_final.json', programs, { spaces: 2 });
    
    // Final analysis
    console.log(`\n🎉 SCRAPING COMPLETED!`);
    console.log(`📊 Final Statistics:`);
    console.log(`   Total processed: ${programs.length}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Browser restarts: ${restartCount}`);
    
    const complete = programs.filter(p => p.name && p.degree && p.offeredBy && p.campus);
    console.log(`   Complete programs: ${complete.length} (${Math.round(complete.length/programs.length*100)}%)`);
    
    console.log(`\n💾 Final data saved to: york_university_all_programs_final.json`);
    
    return programs;
}

scrapeAllYorkUniversityPrograms().catch(console.error);