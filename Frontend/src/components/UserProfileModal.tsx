import { X, Mail, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../utils/api'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  photo?: string
  createdAt?: string
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && user) {
      fetchUserProfile()
    }
  }, [isOpen, user])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await api.getMe()
      if (response.success) {
        setProfile(response.data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Fallback to basic user data from context
      if (user) {
        setProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const displayProfile = profile || user

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        {loading ? (
          <div className="p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        ) : displayProfile ? (
          <div className="pt-12 pb-8 px-8">
            {/* Profile Header - Medium Style */}
            <div className="flex flex-col items-center mb-8">
              {/* Large Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-4 ring-4 ring-white shadow-lg">
                {displayProfile.photo ? (
                  <img
                    src={displayProfile.photo}
                    alt={displayProfile.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-primary-700">
                    {displayProfile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Name and Role */}
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                {displayProfile.name}
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium capitalize">
                {displayProfile.role}
              </div>
            </div>

            {/* Profile Information - Clean Card Style */}
            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </p>
                  <p className="text-gray-900 font-medium break-words">{displayProfile.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Role
                  </p>
                  <p className="text-gray-900 font-medium capitalize">{displayProfile.role}</p>
                </div>
              </div>

              {/* Phone - if available */}
              {displayProfile.phone && (
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 font-medium">{displayProfile.phone}</p>
                  </div>
                </div>
              )}

              {/* Member Since - if available */}
              {displayProfile.createdAt && (
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Member Since
                    </p>
                    <p className="text-gray-900 font-medium">
                      {new Date(displayProfile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-16 text-center text-gray-500">
            <p>No profile data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

