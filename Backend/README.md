# School Management System - Backend API

A RESTful API built with Express.js and MongoDB for managing school operations including students, teachers, classes, attendance, grades, and fees.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👨‍🎓 **Student Management** - CRUD operations, enrollment, transfers
- 👨‍🏫 **Teacher Management** - CRUD operations, subject/class assignments
- 🏫 **Class Management** - Class creation, student promotion, scheduling
- 📚 **Subject Management** - Compulsory and elective subjects
- 📋 **Attendance Tracking** - Daily attendance with statistics
- 📊 **Grades & Report Cards** - Grade entry, report card generation
- 💰 **Fee Management** - Fee structures, payments, receipts
- 📈 **Dashboard Analytics** - Stats, recent activities, charts

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done)

2. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment variables:**
   
   Copy the example env file and modify as needed:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/school_management
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB:**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Linux/Mac
   sudo systemctl start mongod
   
   # Or using MongoDB service
   mongod
   ```

6. **Seed the database (optional):**
   ```bash
   npm run seed
   ```
   This creates sample data including:
   - Admin user: `admin@school.com` / `admin123`
   - Staff user: `staff@school.com` / `staff123`
   - Sample classes, subjects, teachers, and students

7. **Start the server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/updatedetails` | Update user details |
| PUT | `/api/auth/updatepassword` | Update password |
| GET | `/api/auth/logout` | Logout user |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/stats` | Get student statistics |
| GET | `/api/students/class/:classId` | Get students by class |
| PUT | `/api/students/:id/transfer` | Transfer student |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers/:id` | Get single teacher |
| POST | `/api/teachers` | Create teacher |
| PUT | `/api/teachers/:id` | Update teacher |
| DELETE | `/api/teachers/:id` | Delete teacher |
| GET | `/api/teachers/stats` | Get teacher statistics |
| PUT | `/api/teachers/:id/subjects` | Assign subjects |
| PUT | `/api/teachers/:id/classes` | Assign classes |

### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes |
| GET | `/api/classes/:id` | Get single class |
| POST | `/api/classes` | Create class |
| PUT | `/api/classes/:id` | Update class |
| DELETE | `/api/classes/:id` | Delete class |
| GET | `/api/classes/stats` | Get class statistics |
| GET | `/api/classes/:id/students` | Get students in class |
| POST | `/api/classes/:id/promote` | Promote students |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | Get all subjects |
| GET | `/api/subjects/:id` | Get single subject |
| POST | `/api/subjects` | Create subject |
| PUT | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |
| GET | `/api/subjects/departments` | Get all departments |
| GET | `/api/subjects/class/:className` | Get subjects by class |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get attendance records |
| GET | `/api/attendance/:id` | Get single record |
| POST | `/api/attendance` | Mark attendance |
| PUT | `/api/attendance/:id` | Update attendance |
| DELETE | `/api/attendance/:id` | Delete attendance |
| GET | `/api/attendance/today` | Get today's attendance |
| GET | `/api/attendance/stats/:classId` | Get class stats |
| GET | `/api/attendance/student/:studentId` | Get student attendance |

### Grades
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grades` | Get all grades |
| GET | `/api/grades/:id` | Get single grade |
| POST | `/api/grades` | Create grade |
| POST | `/api/grades/bulk` | Create bulk grades |
| PUT | `/api/grades/:id` | Update grade |
| DELETE | `/api/grades/:id` | Delete grade |
| GET | `/api/grades/student/:studentId` | Get student grades |
| GET | `/api/grades/report-card/:studentId` | Get report card |

### Fees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fees/structure` | Get fee structures |
| POST | `/api/fees/structure` | Create fee structure |
| PUT | `/api/fees/structure/:id` | Update fee structure |
| DELETE | `/api/fees/structure/:id` | Delete fee structure |
| GET | `/api/fees/payments` | Get all payments |
| POST | `/api/fees/payments/initialize` | Initialize payment |
| POST | `/api/fees/payments/:id/pay` | Record payment |
| GET | `/api/fees/stats` | Get payment statistics |
| GET | `/api/fees/arrears` | Get students with arrears |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard stats |
| GET | `/api/dashboard/activities` | Get recent activities |
| GET | `/api/dashboard/attendance-overview` | Get attendance chart data |
| GET | `/api/dashboard/class-distribution` | Get class distribution |

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### User Roles
- **admin** - Full access to all endpoints
- **teacher** - Access to relevant teaching endpoints
- **staff** - Limited access to non-admin endpoints

## Query Parameters

Most GET endpoints support these query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10 or 20)
- `search` - Search term
- `status` - Filter by status
- Additional filters specific to each endpoint

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Validation errors return an array of errors:

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Clear all data from database
npm run seed -- -d
```

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   ├── classController.js
│   │   ├── subjectController.js
│   │   ├── attendanceController.js
│   │   ├── gradeController.js
│   │   ├── feeController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   ├── error.js        # Error handler
│   │   ├── asyncHandler.js # Async wrapper
│   │   └── validate.js     # Validation rules
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Class.js
│   │   ├── Subject.js
│   │   ├── Attendance.js
│   │   ├── Grade.js
│   │   ├── FeeStructure.js
│   │   ├── Payment.js
│   │   └── index.js
│   ├── routes/             # Express routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── classRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── gradeRoutes.js
│   │   ├── feeRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── index.js
│   ├── utils/
│   │   └── seeder.js       # Database seeder
│   └── server.js           # Entry point
├── .env                    # Environment variables
├── .env.example            # Example env file
├── .gitignore
├── package.json
└── README.md
```

## License

ISC
