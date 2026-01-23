const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const FeeStructure = require('../models/FeeStructure');

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

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@school.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Staff User',
    email: 'staff@school.com',
    password: 'staff123',
    role: 'staff',
  },
];

const classes = [
  { name: 'S1', description: 'Senior 1 - 11 Compulsory + 1 Elective', room: 'Room 101', academicYear: '2024' },
  { name: 'S2', description: 'Senior 2 - 11 Compulsory + 1 Elective', room: 'Room 102', academicYear: '2024' },
  { name: 'S3', description: 'Senior 3 - 7 Compulsory + 2 Electives', room: 'Room 201', academicYear: '2024' },
  { name: 'S4', description: 'Senior 4 - 7 Compulsory + 2 Electives', room: 'Room 202', academicYear: '2024' },
];

const subjects = [
  { name: 'English', code: 'ENG', department: 'Languages', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Mathematics', code: 'MATH', department: 'Science & Mathematics', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'History & Political Education', code: 'HPE', department: 'Social Studies', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Geography', code: 'GEO', department: 'Social Studies', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Physics', code: 'PHY', department: 'Science & Mathematics', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Biology (General Science)', code: 'BIO', department: 'Science & Mathematics', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Chemistry', code: 'CHEM', department: 'Science & Mathematics', type: 'Compulsory', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Physical Education', code: 'PE', department: 'Physical Education', type: 'Compulsory', classes: ['S1', 'S2'] },
  { name: 'Religious Education', code: 'RE', department: 'Religious Education', type: 'Compulsory', classes: ['S1', 'S2'] },
  { name: 'Entrepreneurship', code: 'ENT', department: 'Business Studies', type: 'Compulsory', classes: ['S1', 'S2'] },
  { name: 'Kiswahili', code: 'KIS', department: 'Languages', type: 'Compulsory', classes: ['S1', 'S2'] },
  { name: 'Agriculture', code: 'AGR', department: 'Practical (Pre-vocational)', type: 'Elective', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Information Communication Technology', code: 'ICT', department: 'Practical (Pre-vocational)', type: 'Elective', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Art and Design', code: 'ART', department: 'Practical (Pre-vocational)', type: 'Elective', classes: ['S1', 'S2', 'S3', 'S4'] },
  { name: 'Literature in English', code: 'LIT', department: 'Language Electives', type: 'Elective', classes: ['S1', 'S2', 'S3', 'S4'] },
];

const feeStructures = [
  { class: 'S1', academicYear: '2024', termFee: 50000, boardingFee: 30000, activitiesFee: 5000 },
  { class: 'S2', academicYear: '2024', termFee: 50000, boardingFee: 30000, activitiesFee: 5000 },
  { class: 'S3', academicYear: '2024', termFee: 55000, boardingFee: 30000, activitiesFee: 5000 },
  { class: 'S4', academicYear: '2024', termFee: 55000, boardingFee: 30000, activitiesFee: 5000 },
];

// Import data
const importData = async () => {
  try {
    // Wait for connection
    await connectDB();
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();
    await Teacher.deleteMany();
    await Student.deleteMany();
    await FeeStructure.deleteMany();

    console.log('Creating users...');
    await User.create(users);

    console.log('Creating classes...');
    const createdClasses = await Class.create(classes);

    console.log('Creating subjects...');
    await Subject.create(subjects);

    console.log('Creating fee structures...');
    await FeeStructure.create(feeStructures);

    // Create sample teachers
    console.log('Creating sample teachers...');
    const teachers = [
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@school.com', specialization: 'Mathematics', phone: '+1234567890', teacherId: 'TCH001' },
      { firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@school.com', specialization: 'Science', phone: '+1234567891', teacherId: 'TCH002' },
      { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@school.com', specialization: 'English', phone: '+1234567892', teacherId: 'TCH003' },
      { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@school.com', specialization: 'History', phone: '+1234567893', teacherId: 'TCH004' },
    ];
    const createdTeachers = await Teacher.create(teachers);

    // Update classes with class teachers
    for (let i = 0; i < createdClasses.length && i < createdTeachers.length; i++) {
      await Class.findByIdAndUpdate(createdClasses[i]._id, { classTeacher: createdTeachers[i]._id });
    }

    // Create sample students
    console.log('Creating sample students...');
    const students = [];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Miller'];

    for (let i = 0; i < 20; i++) {
      students.push({
        studentId: `STU${String(i + 1).padStart(3, '0')}`,
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        email: `student${i + 1}@school.com`,
        phone: `+12345678${String(i).padStart(2, '0')}`,
        class: createdClasses[i % createdClasses.length]._id,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        boardingStatus: i % 3 === 0 ? 'Boarding' : 'Day',
        status: 'Active',
        enrollmentDate: new Date('2024-01-15'),
      });
    }
    await Student.create(students);

    console.log('Data imported successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin: admin@school.com / admin123');
    console.log('Staff: staff@school.com / staff123');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // Wait for connection
    await connectDB();
    await User.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();
    await Teacher.deleteMany();
    await Student.deleteMany();
    await FeeStructure.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

// Run based on argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
