import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import * as path from 'path';

interface Course {
    id: string;             // Generated from code
    code: string;           // "APS145" - from div
    name: string;           // "Applied Problem Solving" - from div > a
}

interface CourseRequirement {
    type: string;           // "General Education Course", "Professional Options"
    count: number;          // 1, 2, etc.
    description: string;    // "General Education Course (1)"
}

interface Semester {
    id: string;             // "semester1", "semester2"
    name: string;           // "Semester 1", "Semester 2"  
    courses: Course[];
    requirements?: CourseRequirement[];  // Additional course requirements
    totalCourses?: number;  // Total courses including requirements
}

interface ProgramCourses {
    programId: string;      // "CPA"
    programName: string;    // "Computer Programming & Analysis"
    semesters: Semester[];
}

interface Program {
    id: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery: string;
    credential: string;
    school: string;
}

interface ScrapingStats {
    total: number;
    success: number;
    failed: number;
    skipped: number;
    errors: string[];
}

class SenecaCourseScraper {
    private baseUrl = 'https://www.senecapolytechnic.ca';
    private outputDir = './output';
    private stats: ScrapingStats = {
        total: 0,
        success: 0,
        failed: 0,
        skipped: 0,
        errors: []
    };

    constructor() {
        this.ensureOutputDir();
    }

    private async ensureOutputDir() {
        await fs.ensureDir(this.outputDir);
        await fs.ensureDir(path.join(this.outputDir, 'raw'));
        await fs.ensureDir(path.join(this.outputDir, 'processed'));
        await fs.ensureDir(path.join(this.outputDir, 'processed/courses'));
    }

    async scrapeAllPrograms(): Promise<void> {
        console.log('🚀 Starting mass course scraping for all 195 programs...');

        try {
            // Load programs list
            const programs = await this.loadPrograms();
            console.log(`📋 Loaded ${programs.length} programs`);

            this.stats.total = programs.length;

            // Create batches for better organization
            const batchSize = 50;
            const batches = this.createBatches(programs, batchSize);

            console.log(`📦 Processing ${batches.length} batches of ${batchSize} programs each`);

            // Process each batch
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                const batchNumber = i + 1;
                
                console.log(`\n🔄 Processing batch ${batchNumber}/${batches.length} (${batch.length} programs)`);
                
                await this.processBatch(batch, batchNumber);
                
                // Save progress after each batch
                await this.saveProgress(batchNumber);
                
                // Rate limiting between batches
                if (i < batches.length - 1) {
                    console.log('⏳ Waiting 2 seconds before next batch...');
                    await this.delay(2000);
                }
            }

            // Final summary
            await this.printFinalSummary();

        } catch (error) {
            console.error('❌ Fatal error in mass scraping:', error);
            throw error;
        }
    }

    private async loadPrograms(): Promise<Program[]> {
        const programsPath = path.join(this.outputDir, 'processed/all_programs.json');
        
        if (!await fs.pathExists(programsPath)) {
            throw new Error(`Programs file not found: ${programsPath}`);
        }

        const programs = await fs.readJson(programsPath);
        return programs;
    }

    private createBatches<T>(array: T[], batchSize: number): T[][] {
        const batches: T[][] = [];
        for (let i = 0; i < array.length; i += batchSize) {
            batches.push(array.slice(i, i + batchSize));
        }
        return batches;
    }

    private async processBatch(programs: Program[], batchNumber: number): Promise<void> {
        const batchResults: ProgramCourses[] = [];

        for (let i = 0; i < programs.length; i++) {
            const program = programs[i];
            const programNumber = (batchNumber - 1) * 50 + i + 1;
            
            console.log(`\n[${programNumber}/${this.stats.total}] Processing: ${program.code} - ${program.name}`);

            try {
                // Check if courses page exists
                const coursesUrl = `${this.baseUrl}/programs/fulltime/${program.code}/courses.html`;
                
                // Skip if already processed
                const outputPath = path.join(this.outputDir, 'processed/courses', `${program.code.toLowerCase()}_courses.json`);
                if (await fs.pathExists(outputPath)) {
                    console.log(`⏭️  Already processed, skipping...`);
                    this.stats.skipped++;
                    continue;
                }

                const programCourses = await this.scrapeProgramCourses(coursesUrl, program.code);
                
                if (programCourses.semesters.length > 0) {
                    batchResults.push(programCourses);
                    await this.saveCourses(programCourses, path.join(this.outputDir, 'processed/courses'));
                    this.stats.success++;
                    
                    const totalCourses = programCourses.semesters.reduce((sum, sem) => sum + sem.courses.length, 0);
                    const totalRequirements = programCourses.semesters.reduce((sum, sem) => 
                        sum + (sem.requirements ? sem.requirements.reduce((reqSum, req) => reqSum + req.count, 0) : 0), 0);
                    
                    console.log(`✅ Success: ${programCourses.semesters.length} semesters, ${totalCourses} courses, ${totalRequirements} requirements`);
                } else {
                    console.log(`⚠️  No courses found - might be a non-course program`);
                    this.stats.skipped++;
                }

                // Rate limiting between programs
                await this.delay(1000);

            } catch (error) {
                console.error(`❌ Error processing ${program.code}:`, error);
                this.stats.failed++;
                this.stats.errors.push(`${program.code}: ${error}`);
                
                // Continue with next program
                continue;
            }
        }

        // Save batch results
        if (batchResults.length > 0) {
            const batchPath = path.join(this.outputDir, 'processed', `courses_batch_${batchNumber}.json`);
            await fs.writeJson(batchPath, batchResults, { spaces: 2 });
            console.log(`💾 Saved batch ${batchNumber} with ${batchResults.length} programs`);
        }
    }

    private async saveProgress(batchNumber: number): Promise<void> {
        const progressPath = path.join(this.outputDir, 'scraping_progress.json');
        const progress = {
            timestamp: new Date().toISOString(),
            completedBatches: batchNumber,
            stats: this.stats
        };
        
        await fs.writeJson(progressPath, progress, { spaces: 2 });
    }

    private async printFinalSummary(): Promise<void> {
        console.log('\n' + '='.repeat(60));
        console.log('🎉 MASS COURSE SCRAPING COMPLETED!');
        console.log('='.repeat(60));
        console.log(`📊 Total programs: ${this.stats.total}`);
        console.log(`✅ Successfully scraped: ${this.stats.success}`);
        console.log(`⏭️  Skipped (already processed): ${this.stats.skipped}`);
        console.log(`❌ Failed: ${this.stats.failed}`);
        console.log(`📈 Success rate: ${((this.stats.success / this.stats.total) * 100).toFixed(1)}%`);

        if (this.stats.errors.length > 0) {
            console.log('\n❌ Errors encountered:');
            this.stats.errors.slice(0, 10).forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
            if (this.stats.errors.length > 10) {
                console.log(`   ... and ${this.stats.errors.length - 10} more errors`);
            }
        }

        // Save final summary
        const summaryPath = path.join(this.outputDir, 'scraping_summary.json');
        await fs.writeJson(summaryPath, {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            errors: this.stats.errors
        }, { spaces: 2 });

        console.log(`\n💾 Full summary saved to: ${summaryPath}`);
        console.log('='.repeat(60));
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async testScrapeOneProgram(): Promise<void> {
        console.log('🧪 Testing enhanced course scraper with CPA program...');

        const testUrl = 'https://www.senecapolytechnic.ca/programs/fulltime/CPA/courses.html';
        const testCode = 'CPA';

        try {
            const programCourses = await this.scrapeProgramCourses(testUrl, testCode);

            console.log('\n📋 Enhanced extraction results:');
            console.log('Program:', programCourses.programName);
            console.log('Semesters:', programCourses.semesters.length);
            
            programCourses.semesters.forEach(semester => {
                console.log(`\n  ${semester.name}:`);
                console.log(`    - Fixed courses: ${semester.courses.length}`);
                
                if (semester.requirements && semester.requirements.length > 0) {
                    console.log(`    - Requirements:`);
                    semester.requirements.forEach(req => {
                        console.log(`      • ${req.description}`);
                    });
                }
                
                if (semester.totalCourses) {
                    console.log(`    - Total courses needed: ${semester.totalCourses}`);
                }
            });

            await this.saveCourses(programCourses, path.join(this.outputDir, 'raw'));
            console.log('\n✅ Enhanced test completed successfully!');

        } catch (error) {
            console.error('❌ Test failed:', error);
        }
    }

    async scrapeProgramCourses(programUrl: string, programId: string): Promise<ProgramCourses> {
        const response = await axios.get(programUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000 // 10 second timeout
        });

        const $ = cheerio.load(response.data);
        
        const programName = this.extractProgramName($);
        const semesters = this.extractSemesters($);

        return { programId, programName, semesters };
    }

    private extractProgramName($: cheerio.CheerioAPI): string {
        let programName = $('h1').first().text().trim();
        
        // Remove program code suffix like "(CPA)"
        programName = programName.replace(/\s*\([A-Z0-9]+\)\s*$/, '').trim();
        
        console.log(`📚 Program: "${programName}"`);
        return programName;
    }

    private extractSemesters($: cheerio.CheerioAPI): Semester[] {
        const semesters: Semester[] = [];
        
        $('table').each((tableIndex, table) => {
            const $table = $(table);
            const tableText = $table.text();
            
            if (/[A-Z]{3}\d{3}/.test(tableText)) {
                console.log(`\n📊 Analyzing table ${tableIndex + 1}...`);
                
                const result = this.extractFromTable($table, $);
                
                if (result.courses.length > 0) {
                    const precedingText = $table.prevAll().text();
                    let semesterName = `Semester ${tableIndex + 1}`;
                    
                    const semesterMatch = precedingText.match(/semester\s+(\d+)/i);
                    if (semesterMatch) {
                        semesterName = `Semester ${semesterMatch[1]}`;
                    }
                    
                    const totalRequiredCourses = result.requirements.reduce((sum, req) => sum + req.count, 0);
                    const totalCourses = result.courses.length + totalRequiredCourses;
                    
                    semesters.push({
                        id: `semester${tableIndex + 1}`,
                        name: semesterName,
                        courses: result.courses,
                        requirements: result.requirements.length > 0 ? result.requirements : undefined,
                        totalCourses: totalCourses > result.courses.length ? totalCourses : undefined
                    });
                    
                    console.log(`✅ Table ${tableIndex + 1}: ${result.courses.length} courses, ${result.requirements.length} requirements`);
                }
            }
        });

        return semesters;
    }

    private extractFromTable($table: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): { courses: Course[], requirements: CourseRequirement[] } {
        const courses: Course[] = [];
        const requirements: CourseRequirement[] = [];
        
        $table.find('tr').each((_, row) => {
            const $row = $(row);
            const rowText = $row.text().trim();
            
            if (/[A-Z]{3}\d{3}/.test(rowText)) {
                const course = this.extractCourse($row, $);
                if (course) courses.push(course);
            }
            else if (rowText.toLowerCase().includes('plus:')) {
                const requirement = this.extractRequirement($row, $);
                if (requirement) {
                    requirements.push(requirement);
                    console.log(`📋 Found: ${requirement.description}`);
                }
            }
        });
        
        return { courses, requirements };
    }

    private extractCourse($row: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): Course | null {
        let courseCode = '';
        let courseName = '';

        const cells = $row.find('td, th');
        
        cells.each((index, cell) => {
            const $cell = $(cell);
            const cellText = $cell.text().trim();
            
            const codeMatch = cellText.match(/^([A-Z]{3}\d{3})/);
            if (codeMatch && !courseCode) {
                courseCode = codeMatch[1];
            }
            
            const $link = $cell.find('a');
            if ($link.length > 0 && !courseName) {
                courseName = $link.text().trim();
            }
        });

        if (courseCode.includes(' or ')) {
            courseCode = courseCode.split(' or ')[0].trim();
        }

        if (!courseCode || !courseName) return null;

        return {
            id: courseCode.toLowerCase(),
            code: courseCode,
            name: courseName
        };
    }

    private extractRequirement($row: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): CourseRequirement | null {
        const rowText = $row.text().trim();
        
        const match = rowText.match(/plus:\s*(.+?)\s*\((\d+)\)/i);
        
        if (match) {
            const type = match[1].trim();
            const count = parseInt(match[2]);
            
            return {
                type: type,
                count: count,
                description: `${type} (${count})`
            };
        }
        
        return null;
    }

    async saveCourses(programCourses: ProgramCourses, outputDir: string): Promise<void> {
        await fs.ensureDir(outputDir);
        
        const filename = `${programCourses.programId.toLowerCase()}_courses.json`;
        const filepath = path.join(outputDir, filename);
        
        await fs.writeJson(filepath, programCourses, { spaces: 2 });
        
        console.log(`💾 Saved to: ${filepath}`);
        
        const totalCourses = programCourses.semesters.reduce((sum, sem) => sum + sem.courses.length, 0);
        const totalRequirements = programCourses.semesters.reduce((sum, sem) => 
            sum + (sem.requirements ? sem.requirements.reduce((reqSum, req) => reqSum + req.count, 0) : 0), 0);
        
        console.log(`📊 Fixed courses: ${totalCourses}`);
        console.log(`📊 Required courses: ${totalRequirements}`);
        console.log(`📊 Total courses: ${totalCourses + totalRequirements}`);
    }
}

async function main() {
    const scraper = new SenecaCourseScraper();
    
    // Check command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        // Test mode - single program
        await scraper.testScrapeOneProgram();
    } else if (args.includes('--all')) {
        // Mass scraping mode - all programs
        await scraper.scrapeAllPrograms();
    } else {
        // Default - show usage
        console.log('🔧 Seneca Course Scraper Usage:');
        console.log('  npm run scrape:test  - Test with single program (CPA)');
        console.log('  npm run scrape:all   - Scrape all 195 programs');
        console.log('');
        console.log('  Or use directly:');
        console.log('  npx tsx scrapers/course-scraper.ts --test');
        console.log('  npx tsx scrapers/course-scraper.ts --all');
    }
}

main().catch(console.error); 