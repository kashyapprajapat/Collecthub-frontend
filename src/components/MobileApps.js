'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Smartphone, Star, Calendar, Trash2, Download } from 'lucide-react'

export default function MobileApps() {
  const [apps, setApps] = useState([
    {
      id: 1,
      name: "Instagram",
      category: "Social Media",
      platform: "iOS & Android",
      rating: 4,
      size: "32 MB",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Spotify",
      category: "Music",
      platform: "iOS & Android",
      rating: 5,
      size: "28 MB",
      dateAdded: "2024-01-10"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newApp, setNewApp] = useState({
    name: '',
    category: '',
    platform: '',
    rating: 5,
    size: ''
  })

  const addApp = () => {
    if (newApp.name && newApp.category) {
      setApps([...apps, {
        id: Date.now(),
        ...newApp,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setNewApp({ name: '', category: '', platform: '', rating: 5, size: '' })
      setShowAddForm(false)
    }
  }

  const deleteApp = (id) => {
    setApps(apps.filter(app => app.id !== id))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Mobile Apps Collection</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add App
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Mobile App</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="App Name"
              value={newApp.name}
              onChange={(e) => setNewApp({...newApp, name: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Category"
              value={newApp.category}
              onChange={(e) => setNewApp({...newApp, category: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={newApp.platform}
              onChange={(e) => setNewApp({...newApp, platform: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Platform</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
              <option value="iOS & Android">iOS & Android</option>
            </select>
            <input
              type="text"
              placeholder="App Size (e.g., 25 MB)"
              value={newApp.size}
              onChange={(e) => setNewApp({...newApp, size: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={newApp.rating}
              onChange={(e) => setNewApp({...newApp, rating: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addApp} className="bg-green-600 hover:bg-green-700">
              Add App
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-400">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{app.name}</h3>
              <Button
                onClick={() => deleteApp(app.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Category:</strong> {app.category}</p>
              <p><strong>Platform:</strong> {app.platform}</p>
              {app.size && (
                <div className="flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  <strong>Size:</strong> {app.size}
                </div>
              )}
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(app.rating)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {app.dateAdded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No apps in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first mobile app to get started!</p>
        </div>
      )}
    </div>
  )
}