'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Music, Star, Calendar, Trash2, Clock, User, Edit3, Save, X, AlertTriangle } from 'lucide-react'

export default function MusicCollection() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTrack, setEditingTrack] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, trackId: null, trackName: '' })
  
  const [newTrack, setNewTrack] = useState({
    musicName: '',
    singer: '',
    reason: ''
  })

  const [editTrack, setEditTrack] = useState({
    musicName: '',
    singer: '',
    reason: ''
  })

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('collecthub_user')
      if (userData) {
        const user = JSON.parse(userData)
        return user.id
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
    return null
  }

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000)
  }

  const fetchTracks = async () => {
    const userId = getUserId()
    if (!userId) {
      showAlert('User not found. Please login again.', 'error')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/FavMusic?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setTracks(data.data || [])
      } else {
        showAlert('Failed to fetch music collection', 'error')
      }
    } catch (error) {
      console.error('Error fetching tracks:', error)
      showAlert('Error loading music collection', 'error')
    } finally {
      setLoading(false)
    }
  }

  const addTrack = async () => {
    if (!newTrack.musicName || !newTrack.singer) {
      showAlert('Please fill in music name and singer', 'error')
      return
    }

    const userId = getUserId()
    if (!userId) {
      showAlert('User not found. Please login again.', 'error')
      return
    }

    try {
      const response = await fetch('https://collecthubdotnet.onrender.com/api/FavMusic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...newTrack
        })
      })

      const data = await response.json()
      
      if (data.success) {
        showAlert('Track added successfully!', 'success')
        setNewTrack({ musicName: '', singer: '', reason: '' })
        setShowAddForm(false)
        fetchTracks() // Reload tracks
      } else {
        showAlert('Failed to add track', 'error')
      }
    } catch (error) {
      console.error('Error adding track:', error)
      showAlert('Error adding track', 'error')
    }
  }

  const startEdit = (track) => {
    setEditingTrack(track.id)
    setEditTrack({
      musicName: track.musicName,
      singer: track.singer,
      reason: track.reason || ''
    })
  }

  const cancelEdit = () => {
    setEditingTrack(null)
    setEditTrack({ musicName: '', singer: '', reason: '' })
  }

  const updateTrack = async (trackId) => {
    if (!editTrack.musicName || !editTrack.singer) {
      showAlert('Please fill in music name and singer', 'error')
      return
    }

    const userId = getUserId()
    if (!userId) {
      showAlert('User not found. Please login again.', 'error')
      return
    }

    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/FavMusic/${trackId}?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editTrack)
      })

      const data = await response.json()
      
      if (data.success) {
        showAlert('Track updated successfully!', 'success')
        setEditingTrack(null)
        fetchTracks() // Reload tracks
      } else {
        showAlert('Failed to update track', 'error')
      }
    } catch (error) {
      console.error('Error updating track:', error)
      showAlert('Error updating track', 'error')
    }
  }

  const confirmDelete = (track) => {
    setDeleteConfirm({ 
      show: true, 
      trackId: track.id, 
      trackName: track.musicName 
    })
  }

  const deleteTrack = async () => {
    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/FavMusic/${deleteConfirm.trackId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        showAlert('Track deleted successfully!', 'success')
        fetchTracks() // Reload tracks
      } else {
        showAlert('Failed to delete track', 'error')
      }
    } catch (error) {
      console.error('Error deleting track:', error)
      showAlert('Error deleting track', 'error')
    } finally {
      setDeleteConfirm({ show: false, trackId: null, trackName: '' })
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <Alert className={`${alert.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
            <AlertDescription className={alert.type === 'error' ? 'text-red-700' : 'text-green-700'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 animate-in fade-in duration-200 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;<strong>{deleteConfirm.trackName}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={deleteTrack}
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                Yes, Delete
              </Button>
              <Button 
                onClick={() => setDeleteConfirm({ show: false, trackId: null, trackName: '' })}
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Music className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Music Collection</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Track
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Track</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Music Name *</label>
              <input
                type="text"
                placeholder="Enter music name"
                value={newTrack.musicName}
                onChange={(e) => setNewTrack({...newTrack, musicName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Singer *</label>
              <input
                type="text"
                placeholder="Enter singer name"
                value={newTrack.singer}
                onChange={(e) => setNewTrack({...newTrack, singer: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <textarea
                placeholder="Why do you love this song?"
                value={newTrack.reason}
                onChange={(e) => setNewTrack({...newTrack, reason: e.target.value})}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button 
              onClick={addTrack} 
              className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Track
            </Button>
            <Button 
              onClick={() => {
                setShowAddForm(false)
                setNewTrack({ musicName: '', singer: '', reason: '' })
              }} 
              variant="outline"
              className="transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-green-400 group">
            {editingTrack === track.id ? (
              // Edit Form
              <div className="space-y-3 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={editTrack.musicName}
                  onChange={(e) => setEditTrack({...editTrack, musicName: e.target.value})}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={editTrack.singer}
                  onChange={(e) => setEditTrack({...editTrack, singer: e.target.value})}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <textarea
                  value={editTrack.reason}
                  onChange={(e) => setEditTrack({...editTrack, reason: e.target.value})}
                  rows={2}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateTrack(track.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Display Mode
              <>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                    {track.musicName}
                  </h3>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      onClick={() => startEdit(track)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-500 hover:bg-blue-50 p-1 h-auto"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => confirmDelete(track)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 p-1 h-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-2 text-green-500" />
                    <strong>Singer:</strong> <span className="ml-1">{track.singer}</span>
                  </div>
                  {track.reason && (
                    <div className="mt-3">
                      <strong className="text-gray-700">Why I love it:</strong>
                      <p className="text-gray-600 text-sm mt-1 italic bg-gray-50 p-2 rounded">
                        &quot;{track.reason}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tracks.length === 0 && (
        <div className="text-center py-12 animate-in fade-in duration-500">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No tracks in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first favorite song to get started!</p>
        </div>
      )}
    </div>
  )
}