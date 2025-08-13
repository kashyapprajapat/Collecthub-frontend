'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Smartphone, Star, Calendar, Trash2, Edit, X, Check, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MobileApps() {
  const [apps, setApps] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  
  const [newApp, setNewApp] = useState({
    appName: '',
    category: '',
    platform: '',
    reason: ''
  })

  const [editApp, setEditApp] = useState({
    appName: '',
    category: '',
    platform: '',
    reason: ''
  })

  // Get user from localStorage
  const getUser = () => {
    try {
      const user = localStorage.getItem('collecthub_user')
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  // Show message with auto-hide
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // Fetch all mobile apps
  const fetchApps = async () => {
    const user = getUser()
    if (!user) {
      showMessage('Please log in to view your apps', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/MobileApps/user/${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setApps(data.data || [])
      } else {
        showMessage('Failed to fetch apps', 'error')
      }
    } catch (error) {
      console.error('Error fetching apps:', error)
      showMessage('Error fetching apps', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Load apps on component mount
  useEffect(() => {
    fetchApps()
  }, [])

  // Add new app
  const addApp = async () => {
    const user = getUser()
    if (!user) {
      showMessage('Please log in to add apps', 'error')
      return
    }

    if (!newApp.appName || !newApp.category || !newApp.platform) {
      showMessage('Please fill in all required fields', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://collecthubdotnet.onrender.com/api/MobileApps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify({
          userId: user.id,
          ...newApp
        })
      })

      const data = await response.json()
      
      if (data.success) {
        showMessage('App added successfully!')
        setNewApp({ appName: '', category: '', platform: '', reason: '' })
        setShowAddForm(false)
        await fetchApps() // Refresh the list
      } else {
        showMessage('Failed to add app', 'error')
      }
    } catch (error) {
      console.error('Error adding app:', error)
      showMessage('Error adding app', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Update app
  const updateApp = async (appId) => {
    const user = getUser()
    if (!user) {
      showMessage('Please log in to update apps', 'error')
      return
    }

    if (!editApp.appName || !editApp.category || !editApp.platform) {
      showMessage('Please fill in all required fields', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/MobileApps/${appId}/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify(editApp)
      })

      const data = await response.json()
      
      if (data.success) {
        showMessage('App updated successfully!')
        setEditingApp(null)
        setEditApp({ appName: '', category: '', platform: '', reason: '' })
        await fetchApps() // Refresh the list
      } else {
        showMessage('Failed to update app', 'error')
      }
    } catch (error) {
      console.error('Error updating app:', error)
      showMessage('Error updating app', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Delete app
  const deleteApp = async (appId) => {
    setLoading(true)
    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/MobileApps/${appId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        showMessage('App deleted successfully!')
        await fetchApps() // Refresh the list
      } else {
        showMessage('Failed to delete app', 'error')
      }
    } catch (error) {
      console.error('Error deleting app:', error)
      showMessage('Error deleting app', 'error')
    } finally {
      setLoading(false)
      setDeleteConfirm(null)
    }
  }

  // Start editing an app
  const startEditing = (app) => {
    setEditingApp(app.id)
    setEditApp({
      appName: app.appName,
      category: app.category,
      platform: app.platform,
      reason: app.reason || ''
    })
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingApp(null)
    setEditApp({ appName: '', category: '', platform: '', reason: '' })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mobile Apps Collection
              </h1>
              <p className="text-gray-600 mt-1">Manage your personal app collection</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl px-6 py-3"
            disabled={loading}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add App
          </Button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`transform transition-all duration-300 ease-in-out ${message ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <Alert className={`border-l-4 ${message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} rounded-xl shadow-lg`}>
              <AlertTriangle className={`h-4 w-4 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transform transition-all duration-500 ease-out animate-in slide-in-from-top">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Mobile App
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">App Name *</label>
                  <input
                    type="text"
                    placeholder="Enter app name"
                    value={newApp.appName}
                    onChange={(e) => setNewApp({...newApp, appName: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category *</label>
                  <input
                    type="text"
                    placeholder="e.g., Social Media, Gaming"
                    value={newApp.category}
                    onChange={(e) => setNewApp({...newApp, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Platform *</label>
                  <select
                    value={newApp.platform}
                    onChange={(e) => setNewApp({...newApp, platform: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  >
                    <option value="">Select Platform</option>
                    <option value="ios">iOS</option>
                    <option value="Android">Android</option>
                    <option value="Cross-platform">Cross-platform</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Reason</label>
                  <input
                    type="text"
                    placeholder="Why do you use this app?"
                    value={newApp.reason}
                    onChange={(e) => setNewApp({...newApp, reason: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button 
                  onClick={addApp} 
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? 'Adding...' : 'Add App'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddForm(false)
                    setNewApp({ appName: '', category: '', platform: '', reason: '' })
                  }} 
                  variant="outline"
                  className="border-2 border-gray-200 hover:bg-gray-50 px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-3 mx-auto w-fit mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete App</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete &quot;{deleteConfirm.appName}&quot;? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => deleteApp(deleteConfirm.id)}
                    disabled={loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-3"
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm(null)}
                    variant="outline"
                    className="flex-1 border-2 border-gray-200 hover:bg-gray-50 rounded-xl py-3"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apps Grid */}
        {loading && apps.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your apps...</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-6 mx-auto w-fit mb-6">
              <Smartphone className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No apps in your collection</h3>
            <p className="text-gray-500 mb-6">Start building your mobile app library today!</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First App
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100 overflow-hidden">
                {editingApp === app.id ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editApp.appName}
                        onChange={(e) => setEditApp({...editApp, appName: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="App Name"
                      />
                      <input
                        type="text"
                        value={editApp.category}
                        onChange={(e) => setEditApp({...editApp, category: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Category"
                      />
                      <select
                        value={editApp.platform}
                        onChange={(e) => setEditApp({...editApp, platform: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ios">iOS</option>
                        <option value="Android">Android</option>
                        <option value="Cross-platform">Cross-platform</option>
                      </select>
                      <input
                        type="text"
                        value={editApp.reason}
                        onChange={(e) => setEditApp({...editApp, reason: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Reason"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => updateApp(app.id)}
                          disabled={loading}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          size="sm"
                          variant="outline"
                          className="border-gray-200 hover:bg-gray-50 rounded-xl"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl text-white truncate">{app.appName}</h3>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            onClick={() => startEditing(app)}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 rounded-lg p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm(app)}
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-red-500/20 rounded-lg p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Category:</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {app.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Platform:</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {app.platform}
                        </span>
                      </div>
                      {app.reason && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Reason:</span>
                          <p className="text-sm text-gray-600 mt-1 italic">&quot;{app.reason}&quot;</p>
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <Calendar className="w-3 h-3 mr-1" />
                        Added: {formatDate(app.createdAt)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}