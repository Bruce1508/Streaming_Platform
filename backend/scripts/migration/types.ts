// scripts/migration/types.ts

export interface MigrationResult {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
    duration: number;
}

export interface AcademicMigrationConfig {
    clearExistingData: boolean;
    seedSampleData: boolean;
    batchSize: number;
    logLevel: 'verbose' | 'normal' | 'quiet';
}

export interface DatabaseBackup {
    timestamp: Date;
    collections: string[];
    filePath?: string;
}

// Progress tracking
export class MigrationProgress {
    private current = 0;
    private total = 0;
    private startTime = Date.now();
    
    constructor(total: number) {
        this.total = total;
    }
    
    update(increment = 1): void {
        this.current += increment;
        const percentage = ((this.current / this.total) * 100).toFixed(1);
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
        
        process.stdout.write(`\r⏳ Progress: ${this.current}/${this.total} (${percentage}%) - ${elapsed}s`);
        
        if (this.current >= this.total) {
            console.log('\n✅ Step completed');
        }
    }
    
    reset(newTotal: number): void {
        this.current = 0;
        this.total = newTotal;
        this.startTime = Date.now();
    }
}