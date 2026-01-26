import { Bell, Search, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import UserProfileModal from './UserProfileModal'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '../context/NotificationContext'

interface HeaderProps {
  onMenuClick: () => void
}

function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { notifications, unreadCount, removeNotification, clearAllNotifications } = useNotifications()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfileClick = () => {
    setShowProfileModal(true)
    setShowDropdown(false)
  }

  const handleUserIconClick = () => {
    setShowDropdown(!showDropdown)
    setShowNotifications(false)
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    setShowDropdown(false)
  }

  const handleNotificationItemClick = (notificationId: string, link?: string) => {
    // Remove notification after viewing
    removeNotification(notificationId)
    
    // Navigate if link exists
    if (link) {
      navigate(link)
    }
    setShowNotifications(false)
  }

  const handleClearAll = () => {
    clearAllNotifications()
    setShowNotifications(false)
  }

  const formatNotificationTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showDropdown || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown, showNotifications])

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button or what we can call a hamburger menu. when you browse on a bigger screen (lg) it will stay hidden*/}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
             strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="relative text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationItemClick(notification.id, notification.link)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                !notification.read ? 'bg-blue-500' : 'bg-transparent'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <span
                                  className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${getNotificationColor(
                                    notification.type
                                  )}`}
                                >
                                  {notification.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatNotificationTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center space-x-3">
              <div 
                className="text-right hidden sm:block cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleUserIconClick}
                title="User Menu"
              >
                <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</div>
              </div>
              <div 
                className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-200 transition-colors"
                onClick={handleUserIconClick}
                title="User Menu"
              >
                <User className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.email || ''}</p>
                </div>

                {/* Profile Option */}
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>View Profile</span>
                </button>

                {/* Logout Option */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </header>
  )
}
export default Header;



