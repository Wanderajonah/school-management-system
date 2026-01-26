const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const User = require('../models/User');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Helper function to get random status based on weighted distribution
// ~75% present, ~15% absent, ~7% late, ~3% excused
const getRandomStatus = () => {
  const rand = Math.random();
  if (rand < 0.75) return 'present';
  if (rand < 0.90) return 'absent';
  if (rand < 0.97) return 'late';
  return 'excused';
};

// Helper function to format date (set hours to 0)
const formatDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Generate attendance for past 7 days
const generateAttendance = async () => {
  try {
    await connectDB();
    
    console.log('Fetching active classes...');
    const classes = await Class.find({ isActive: true });
    
    if (classes.length === 0) {
      console.log('No active classes found. Please create classes first.');
      process.exit(0);
    }
    
    console.log(`Found ${classes.length} active class(es)`);
    
    // Get a user to mark attendance (prefer admin, fallback to any user)
    let markedBy = null;
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      markedBy = adminUser._id;
    } else {
      const anyUser = await User.findOne();
      if (anyUser) {
        markedBy = anyUser._id;
      }
    }
    
    // Generate dates for past 30 days (including today) for better graph visualization
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(formatDate(date));
    }
    
    console.log(`Generating attendance for ${dates.length} days...`);
    
    let totalCreated = 0;
    let totalSkipped = 0;
    
    // Process each class
    for (const classObj of classes) {
      console.log(`\nProcessing class: ${classObj.name}`);
      
      // Get all active students in this class
      const students = await Student.find({
        class: classObj._id,
        status: 'Active',
      });
      
      if (students.length === 0) {
        console.log(`  No active students found in ${classObj.name}, skipping...`);
        continue;
      }
      
      console.log(`  Found ${students.length} active student(s)`);
      
      // Generate attendance for each date
      for (const date of dates) {
        // Check if attendance already exists for this date and class
        const existingAttendance = await Attendance.findOne({
          date: date,
          class: classObj._id,
          subject: null, // General attendance (no specific subject)
        });
        
        if (existingAttendance) {
          console.log(`  Attendance already exists for ${classObj.name} on ${date.toISOString().split('T')[0]}, skipping...`);
          totalSkipped++;
          continue;
        }
        
        // Generate attendance records for all students
        const records = students.map((student) => ({
          student: student._id,
          status: getRandomStatus(),
          remarks: '',
        }));
        
        // Create attendance record
        const attendance = await Attendance.create({
          date: date,
          class: classObj._id,
          subject: null, // General attendance
          records: records,
          markedBy: markedBy,
          term: 'First Term', // Default term
          academicYear: classObj.academicYear || '2024',
        });
        
        totalCreated++;
        
        // Calculate stats for this attendance record
        const stats = {
          present: records.filter((r) => r.status === 'present').length,
          absent: records.filter((r) => r.status === 'absent').length,
          late: records.filter((r) => r.status === 'late').length,
          excused: records.filter((r) => r.status === 'excused').length,
        };
        
        console.log(`  ✓ Created attendance for ${classObj.name} on ${date.toISOString().split('T')[0]} - Present: ${stats.present}, Absent: ${stats.absent}, Late: ${stats.late}, Excused: ${stats.excused}`);
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total attendance records created: ${totalCreated}`);
    console.log(`Total attendance records skipped (already exist): ${totalSkipped}`);
    console.log('\nAttendance data generation completed successfully!');
    console.log('You can now view the attendance charts on the dashboard.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error generating attendance:', error);
    process.exit(1);
  }
};

// Run the seeder
generateAttendance();

