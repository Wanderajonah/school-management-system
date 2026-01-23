import { useState } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = [
  { time: '8:00 AM - 9:00 AM', period: 1 },
  { time: '9:00 AM - 10:00 AM', period: 2 },
  { time: '10:00 AM - 11:00 AM', period: 3 },
  { time: '11:00 AM - 12:00 PM', period: 4 },
  { time: '1:00 PM - 2:00 PM', period: 5 },
  { time: '2:00 PM - 3:00 PM', period: 6 },
]

const scheduleData: Record<string, Record<number, { subject: string; teacher: string; room: string; class: string }>> = {
  Monday: {
    1: { subject: 'English', teacher: 'Ms. Emily Davis', room: 'Room 101', class: 'S1' },
    2: { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 102', class: 'S1' },
    3: { subject: 'History & Political Education', teacher: 'Mr. James Wilson', room: 'Room 201', class: 'S1' },
    4: { subject: 'Geography', teacher: 'Mrs. Patricia Brown', room: 'Room 103', class: 'S1' },
  },
  Tuesday: {
    1: { subject: 'Physics', teacher: 'Mr. Michael Brown', room: 'Room 104', class: 'S1' },
    2: { subject: 'Biology (General Science)', teacher: 'Dr. Robert Lee', room: 'Room 105', class: 'S1' },
    3: { subject: 'Chemistry', teacher: 'Ms. Lisa Chen', room: 'Room 106', class: 'S1' },
    5: { subject: 'Physical Education', teacher: 'Mr. David Park', room: 'Gym', class: 'S1' },
  },
  Wednesday: {
    1: { subject: 'English', teacher: 'Ms. Emily Davis', room: 'Room 101', class: 'S1' },
    2: { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 102', class: 'S1' },
    3: { subject: 'Religious Education', teacher: 'Rev. John Smith', room: 'Room 107', class: 'S1' },
    4: { subject: 'Entrepreneurship', teacher: 'Mrs. Mary Johnson', room: 'Room 108', class: 'S1' },
  },
  Thursday: {
    1: { subject: 'Kiswahili', teacher: 'Mr. Hassan Ali', room: 'Room 109', class: 'S1' },
    2: { subject: 'History & Political Education', teacher: 'Mr. James Wilson', room: 'Room 201', class: 'S1' },
    3: { subject: 'Geography', teacher: 'Mrs. Patricia Brown', room: 'Room 103', class: 'S1' },
    5: { subject: 'Agriculture', teacher: 'Mr. Peter Ochieng', room: 'Room 301', class: 'S1' },
  },
  Friday: {
    1: { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 102', class: 'S1' },
    2: { subject: 'Physics', teacher: 'Mr. Michael Brown', room: 'Room 104', class: 'S1' },
    3: { subject: 'Chemistry', teacher: 'Ms. Lisa Chen', room: 'Room 106', class: 'S1' },
    6: { subject: 'Information Communication Technology', teacher: 'Mr. Tech Expert', room: 'Room 302', class: 'S1' },
  },
}

export default function Schedule() {
  const [selectedClass, setSelectedClass] = useState('S1')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">View class schedules and timetables</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-field"
          >
            <option value="S1">S1 - Senior 1</option>
            <option value="S2">S2 - Senior 2</option>
            <option value="S3">S3 - Senior 3</option>
            <option value="S4">S4 - Senior 4</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Export Schedule</span>
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((slot) => (
                <tr key={slot.period} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {slot.time}
                  </td>
                  {days.map((day) => {
                    const schedule = scheduleData[day]?.[slot.period]
                    return (
                      <td key={day} className="px-6 py-4">
                        {schedule ? (
                          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                            <div className="font-medium text-primary-900 text-sm">{schedule.subject}</div>
                            <div className="text-xs text-primary-700 mt-1">{schedule.teacher}</div>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-primary-600">
                              <MapPin className="w-3 h-3" />
                              <span>{schedule.room}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">-</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary-50 border border-primary-200 rounded"></div>
            <span className="text-sm text-gray-600">Scheduled Class</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-gray-600">Free Period</span>
          </div>
        </div>
      </div>
    </div>
  )
}



