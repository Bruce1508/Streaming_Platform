import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runAcademicMigration, printMigrationSummary } from './01-academic-migration';
import { migrateEnrollments, printEnrollmentSummary } from './02-enrollment-migration';

dotenv.config();

interface FullMigrationStats {
    academic: {
        schoolsCreated: number;
        programsCreated: number;
        coursesCreated: number;
        materialsConverted: number;
        usersUpdated: number;
    };
    enrollment: {
        enrollmentsCreated: number;
        usersEnrolled: number;
        coursesUsed: number;
    };
    totalDuration: number;
}

async function runAllMigrations(): Promise<void> {
    const startTime = Date.now();

    console.log('🚀 Starting Complete Database Migration Pipeline...\n');
    console.log('⚠️  This will clear existing academic data and recreate it');
    console.log('⚠️  Make sure you have a backup if needed\n');

    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log('✅ Connected to MongoDB\n');

        const stats: FullMigrationStats = {
            academic: {
                schoolsCreated: 0,
                programsCreated: 0,
                coursesCreated: 0,
                materialsConverted: 0,
                usersUpdated: 0
            },
            enrollment: {
                enrollmentsCreated: 0,
                usersEnrolled: 0,
                coursesUsed: 0
            },
            totalDuration: 0
        };

        // Step 1: Academic structure migration
        console.log('📚 STEP 1: Academic Structure Migration');
        console.log('='.repeat(50));
        const academicStats = await runAcademicMigration();
        stats.academic = {
            schoolsCreated: academicStats.schoolsCreated,
            programsCreated: academicStats.programsCreated,
            coursesCreated: academicStats.coursesCreated,
            materialsConverted: academicStats.sampleMaterialsCreated,
            usersUpdated: academicStats.usersUpdated
        };
        printMigrationSummary(academicStats);

        console.log('\n⏳ Waiting 2 seconds before next step...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 2: Enrollment migration
        console.log('🎓 STEP 2: Enrollment Migration');
        console.log('='.repeat(50));
        const enrollmentStats = await migrateEnrollments();
        stats.enrollment = enrollmentStats;
        printEnrollmentSummary(enrollmentStats);

        stats.totalDuration = Date.now() - startTime;

        // Print final summary
        printFinalSummary(stats);

        console.log('\n🎉 All migrations completed successfully!');
        console.log('\n📝 Next Development Steps:');
        console.log('1. 🔧 Update API endpoints to use new academic models');
        console.log('2. 🎨 Update frontend to show academic context');
        console.log('3. 📤 Test material upload with academic fields');
        console.log('4. 🔍 Test new filtering and search features');
        console.log('5. 📊 Create academic dashboard components');

    } catch (error) {
        console.error('❌ Migration pipeline failed:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

function printFinalSummary(stats: FullMigrationStats): void {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 COMPLETE MIGRATION SUMMARY');
    console.log('='.repeat(60));

    console.log('\n📚 Academic Data:');
    console.log(`   🏫 Schools: ${stats.academic.schoolsCreated}`);
    console.log(`   🎓 Programs: ${stats.academic.programsCreated}`);
    console.log(`   📖 Courses: ${stats.academic.coursesCreated}`);
    console.log(`   📄 Materials Converted: ${stats.academic.materialsConverted}`);
    console.log(`   👥 Users Updated: ${stats.academic.usersUpdated}`);

    console.log('\n🎓 Enrollment Data:');
    console.log(`   📝 Enrollments: ${stats.enrollment.enrollmentsCreated}`);
    console.log(`   👨‍🎓 Students Enrolled: ${stats.enrollment.usersEnrolled}`);
    console.log(`   📚 Active Courses: ${stats.enrollment.coursesUsed}`);
    console.log('\n⏱️ Performance:');
    console.log(`   ⚡ Total Duration: ${(stats.totalDuration / 1000).toFixed(2)}s`);
    console.log(`   📊 Items per second: ${((stats.academic.schoolsCreated + stats.academic.programsCreated + stats.academic.coursesCreated + stats.enrollment.enrollmentsCreated) / (stats.totalDuration / 1000)).toFixed(1)}`);

    console.log('\n🎯 Database Ready For:');
    console.log('   ✅ Academic material uploads');
    console.log('   ✅ Course-based filtering');
    console.log('   ✅ Student enrollment tracking');
    console.log('   ✅ Program-specific content');
    console.log('   ✅ Academic dashboard features');
}

// Add graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️ Migration interrupted by user');
    await mongoose.connection.close();
    process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
    console.error('❌ Unhandled rejection:', reason);
    await mongoose.connection.close();
    process.exit(1);
});

// Run all migrations
runAllMigrations();