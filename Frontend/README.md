# School Management System - Frontend

A modern, responsive school management system frontend built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard** - Overview of key metrics and recent activities
- **Student Management** - Complete student records and profiles
- **Teacher Management** - Teacher information and assignments
- **Class Management** - Class schedules and student lists
- **Attendance Tracking** - Mark and monitor student attendance
- **Grades Management** - Record and track student grades
- **Schedule/Timetable** - View class schedules
- **Reports** - Generate various reports
- **Settings** - System and user preferences

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx    # Main layout wrapper
│   ├── Sidebar.tsx   # Navigation sidebar
│   └── Header.tsx    # Top header bar
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Students.tsx
│   ├── Teachers.tsx
│   ├── Classes.tsx
│   ├── Attendance.tsx
│   ├── Grades.tsx
│   ├── Schedule.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── App.tsx           # Main app component with routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Features Overview

### Dashboard
- Key statistics cards
- Recent activities feed
- Quick action buttons
- Attendance overview chart placeholder

### Student Management
- List view with search and filters
- Student detail pages
- Add/Edit student functionality
- Student profile information

### Teacher Management
- Teacher cards with key information
- Teacher detail pages
- Class assignments
- Professional information

### Class Management
- Class cards with schedules
- Class detail pages
- Student lists per class
- Room assignments

### Attendance
- Mark attendance by class and date
- Present/Absent/Late status
- Attendance statistics
- Quick status changes

### Grades
- Grade entry and management
- Filter by class and subject
- Grade visualization
- Assignment tracking

### Schedule
- Weekly timetable view
- Class schedules
- Room assignments
- Export functionality

### Reports
- Multiple report types
- Report generation
- Download reports
- Report history

### Settings
- Profile management
- School information
- Notification preferences
- Security settings

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme. The primary color is defined in the `primary` color palette.

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Add a menu item in `src/components/Sidebar.tsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.



