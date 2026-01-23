import { Save, Bell, Lock, User, School } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Full Name</label>
            <input type="text" defaultValue="Admin User" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" defaultValue="admin@school.com" className="input-field" />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input type="tel" defaultValue="+1234567890" className="input-field" />
          </div>
          <div>
            <label className="label">Role</label>
            <input type="text" defaultValue="Administrator" className="input-field" disabled />
          </div>
        </div>
        <div className="mt-6">
          <button className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* School Information */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <School className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">School Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">School Name</label>
            <input type="text" defaultValue="EduManage School" className="input-field" />
          </div>
          <div>
            <label className="label">School Code</label>
            <input type="text" defaultValue="EMS001" className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Address</label>
            <textarea
              defaultValue="123 Education Street, City, State 12345"
              className="input-field"
              rows={3}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" defaultValue="+1234567890" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" defaultValue="info@school.com" className="input-field" />
          </div>
        </div>
        <div className="mt-6">
          <button className="btn-primary flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive push notifications in browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input-field" />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input-field" />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input-field" />
          </div>
          <button className="btn-primary">Change Password</button>
        </div>
      </div>
    </div>
  )
}



