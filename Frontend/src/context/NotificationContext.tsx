import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: string
  link?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  markAsRead: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = 'school_notifications'

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Filter out notifications older than 7 days
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        return parsed.filter((n: Notification) => 
          new Date(n.timestamp).getTime() > sevenDaysAgo
        )
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error)
    }
    return []
  })

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error)
    }
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      timestamp: new Date().toISOString(),
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Optional: Play notification sound or show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
      })
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        clearAllNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

