import { X, Upload, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import api, { getImageUrl } from '../utils/api'
import { useNotifications } from '../context/NotificationContext'

interface Event {
  _id?: string
  id?: string
  title: string
  description?: string
  date: string
  image?: string
}

interface EventFormModalProps {
  isOpen: boolean
  onClose: () => void
  onEventAdded: () => void
  event?: Event | null
}

export default function EventFormModal({ isOpen, onClose, onEventAdded, event }: EventFormModalProps) {
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const isEditing = !!event

  // Populate form when editing
  useEffect(() => {
    if (isOpen && event) {
      const eventDate = new Date(event.date).toISOString().split('T')[0]
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: eventDate,
        image: event.image || '',
      })
      
      // Set image preview if event has an image
      if (event.image) {
        const imageUrl = getImageUrl(event.image)
        setImagePreview(imageUrl ?? null)
      } else {
        setImagePreview(null)
      }
      setImageFile(null)
    } else if (isOpen && !event) {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        date: '',
        image: '',
      })
      setImageFile(null)
      setImagePreview(null)
    }
  }, [isOpen, event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addNotification({
          title: 'Invalid File',
          message: 'Please select an image file',
          type: 'error',
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addNotification({
          title: 'File Too Large',
          message: 'Image must be less than 5MB',
          type: 'error',
        })
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      addNotification({
        title: 'Validation Error',
        message: 'Please enter an event title',
        type: 'error',
      })
      return
    }

    if (!formData.date) {
      addNotification({
        title: 'Validation Error',
        message: 'Please select an event date',
        type: 'error',
      })
      return
    }

    try {
      setLoading(true)

      let imageUrl = formData.image

      // Upload image if provided
      if (imageFile) {
        const uploadResponse = await api.uploadEventImage(imageFile)
        if (uploadResponse.success && uploadResponse.data?.path) {
          imageUrl = uploadResponse.data.path
        }
      }

      let response
      if (isEditing && event) {
        // Update event
        const eventId = event._id || event.id
        if (!eventId) {
          addNotification({
            title: 'Error',
            message: 'Event ID is missing',
            type: 'error',
          })
          setLoading(false)
          return
        }
        response = await api.updateEvent(eventId, {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image: imageUrl || formData.image,
        })
      } else {
        // Create event
        response = await api.createEvent({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image: imageUrl,
        })
      }

      if (response.success) {
        addNotification({
          title: 'Success',
          message: isEditing ? 'Event updated successfully' : 'Event created successfully',
          type: 'success',
        })
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          date: '',
          image: '',
        })
        setImageFile(null)
        setImagePreview(null)
        
        onEventAdded()
        onClose()
      }
    } catch (error: any) {
      console.error('Error creating event:', error)
      addNotification({
        title: 'Error',
        message: error.message || 'Failed to create event',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        date: '',
        image: '',
      })
      setImageFile(null)
      setImagePreview(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="label">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., School Annual Sports Day"
              required
              disabled={loading}
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows={4}
              placeholder="Describe the event..."
              disabled={loading}
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="label">
              Event Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field pl-10"
                required
                disabled={loading}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Event Image</label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

