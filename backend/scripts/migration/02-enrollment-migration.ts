// scripts/migration/02-enrollment-migration.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from '../../src/models/User';
import { Course } from '../../src/models/Course';
import { Enrollment } from '../../src/models/Enrollment';

interface EnrollmentStats {
    enrollmentsCreated: number;
    usersEnrolled: number;
    coursesUsed: number;
}

export async function migrateEnrollments(): Promise<EnrollmentStats> {
    try {
        console.log('🎓 Starting Enrollment Migration...');
        
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URL!);
        }
        
        const stats: EnrollmentStats = {
            enrollmentsCreated: 0,
            usersEnrolled: 0,
            coursesUsed: 0
        };
        
        // Clear existing enrollments
        await Enrollment.deleteMany({});
        console.log('🗑️ Cleared existing enrollments');
        
        const users = await User.find({ 'academic.school': { $exists: true } });
        console.log(`Found ${users.length} users with academic data`);
        
        const usedCourseIds = new Set<string>();
        
        for (const user of users) {
            try {
                if (!user.academic?.program) continue;
                
                // Get courses for user's program
                const courses = await Course.find({ 
                    program: user.academic.program,
                    semester: { $lte: (user.academic.currentSemester || 1) } // Enrolled based on current semester
                }).limit(6); // Enroll in up to 6 courses
                
                let userEnrollments = 0;
                
                for (const course of courses) {
                    const enrollmentDate = new Date();
                    enrollmentDate.setTime(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Random date within last year
                    
                    // Generate realistic grades (80% pass rate)
                    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
                    const passGrades = grades.slice(0, -2); // Exclude D and F
                    const shouldPass = Math.random() > 0.2;
                    const grade = shouldPass ? 
                        passGrades[Math.floor(Math.random() * passGrades.length)] : 
                        grades[Math.floor(Math.random() * grades.length)];
                    
                    await Enrollment.create({
                        student: user._id,
                        course: course._id,
                        academic: {
                            school: user.academic.school,
                            program: user.academic.program,
                            academicYear: `${user.academic.enrollmentYear || new Date().getFullYear()}`,
                            term: 'Fall'
                        },
                        enrollmentDate,
                        status: Math.random() > 0.1 ? 'active' : 'completed', // 90% active, 10% completed
                        grade: Math.random() > 0.3 ? grade : undefined, // 70% have grades
                        attendance: {
                            totalClasses: Math.floor(Math.random() * 20) + 30, // 30-50 classes
                            attendedClasses: 0
                        },
                        assignments: [],
                        midtermGrade: Math.random() > 0.5 ? passGrades[Math.floor(Math.random() * passGrades.length)] : undefined,
                        finalGrade: Math.random() > 0.3 ? grade : undefined
                    });
                    
                    stats.enrollmentsCreated++;
                    userEnrollments++;
                    usedCourseIds.add(course._id.toString());
                }
                
                if (userEnrollments > 0) {
                    stats.usersEnrolled++;
                }
                
            } catch (error) {
                console.error(`Error creating enrollments for user ${user._id}:`, error);
            }
        }
        
        stats.coursesUsed = usedCourseIds.size;
        
        console.log('✅ Enrollment migration completed successfully!');
        return stats;
        
    } catch (error) {
        console.error('❌ Enrollment migration failed:', error);
        throw error;
    }
}

export function printEnrollmentSummary(stats: EnrollmentStats): void {
    console.log('\n📊 Enrollment Migration Summary:');
    console.log(`🎓 Enrollments created: ${stats.enrollmentsCreated}`);
    console.log(`👥 Users enrolled: ${stats.usersEnrolled}`);
    console.log(`📚 Courses used: ${stats.coursesUsed}`);
    console.log(`📈 Avg enrollments per user: ${(stats.enrollmentsCreated / stats.usersEnrolled || 0).toFixed(1)}`);
}

// Run migration if called directly
if (require.main === module) {
    migrateEnrollments()
        .then((stats) => {
            printEnrollmentSummary(stats);
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Enrollment migration failed:', error);
            process.exit(1);
        });
}