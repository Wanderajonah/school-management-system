# School Management System - Setup Guide

This guide will help you set up and run both the backend and frontend of the School Management System.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher) - either local installation or MongoDB Atlas
- npm or yarn

## Backend Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `Backend` directory:
   ```bash
   cp .env.example .env
   ```
   
   Or create it manually with these contents:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/school_management
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Important:** 
   - Change `JWT_SECRET` to a strong random string in production
   - If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
   - If MongoDB is running on a different port, update the URI accordingly

4. **Start MongoDB:**
   
   **Local MongoDB:**
   ```bash
   # On Linux/Mac with systemd
   sudo systemctl start mongod
   
   # Or start manually
   mongod
   ```
   
   **Docker:**
   ```bash
   docker run -d --name mongo -p 27017:27017 mongo
   ```
   
   **MongoDB Atlas:**
   - No local setup needed, just use your Atlas connection string in `.env`

5. **Seed the database (optional but recommended):**
   ```bash
   npm run seed
   ```
   
   This creates sample data including:
   - Admin user: `admin@school.com` / `admin123`
   - Staff user: `staff@school.com` / `staff123`
   - Sample classes, subjects, teachers, and students

6. **Start the backend server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```
   
   The API will be available at `http://localhost:5000`
   Health check: `http://localhost:5000/api/health`

## Frontend Setup

1. **Navigate to the Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   
   Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   **Note:** The Vite proxy is already configured in `vite.config.ts`, so this is optional. The frontend will use `/api` which proxies to `http://localhost:5000/api` during development.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## Running Both Servers

You'll need to run both servers simultaneously:

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

## API Endpoints

The backend API is available at `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/logout` - Logout user

### Main Resources
- `/api/students` - Student management
- `/api/teachers` - Teacher management
- `/api/classes` - Class management
- `/api/subjects` - Subject management
- `/api/attendance` - Attendance tracking
- `/api/grades` - Grade management
- `/api/fees` - Fee management
- `/api/dashboard` - Dashboard statistics

See `Backend/README.md` for complete API documentation.

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running: `sudo systemctl status mongod` or `docker ps` (if using Docker)
- Check your `MONGODB_URI` in `.env` is correct
- For Atlas, ensure your IP is whitelisted and connection string is correct

**Port Already in Use:**
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or kill the process using port 5000: `lsof -ti:5000 | xargs kill`

**Seeder Timeout:**
- Make sure MongoDB is running before running the seeder
- Check your `MONGODB_URI` is correct

### Frontend Issues

**API Connection Errors:**
- Ensure the backend is running on port 5000
- Check browser console for CORS errors (backend CORS is configured for `http://localhost:5173`)
- Verify the Vite proxy is working (check `vite.config.ts`)

**Module Not Found:**
- Run `npm install` in the Frontend directory
- Clear `node_modules` and reinstall if issues persist

## Development Tips

1. **Backend API Testing:**
   - Use Postman, Insomnia, or curl to test API endpoints
   - Health check: `curl http://localhost:5000/api/health`

2. **Frontend Development:**
   - The frontend uses React with TypeScript
   - API calls are centralized in `Frontend/src/utils/api.ts`
   - Authentication state is managed via `AuthContext`

3. **Database:**
   - Use MongoDB Compass or mongosh to view database contents
   - Database name is specified in `MONGODB_URI`

## Production Deployment

For production:
1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment-specific MongoDB URI
5. Build frontend: `npm run build` in Frontend directory
6. Serve frontend build with a web server (nginx, etc.)

## Support

For issues or questions, check:
- Backend README: `Backend/README.md`
- Frontend documentation: `Frontend/CODE_DOCUMENTATION.md`
