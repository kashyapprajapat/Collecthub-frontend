'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Youtube, Star, Calendar, Trash2, Users, Play } from 'lucide-react'

export default function YoutubeChannels() {
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: "Fireship",
      category: "Programming",
      subscribers: "2.8M",
      description: "High-intensity code tutorials",
      channelUrl: "https://youtube.com/@Fireship",
      rating: 5,
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Marques Brownlee",
      category: "Technology",
      subscribers: "17.2M",
      description: "Tech reviews and insights",
      channelUrl: "https://youtube.com/@mkbhd",
      rating: 5,
      dateAdded: "2024-01-10"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newChannel, setNewChannel] = useState({
    name: '',
    category: '',
    subscribers: '',
    description: '',
    channelUrl: '',
    rating: 5
  })

  const addChannel = () => {
    if (newChannel.name && newChannel.category) {
      setChannels([...channels, {
        id: Date.now(),
        ...newChannel,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setNewChannel({ name: '', category: '', subscribers: '', description: '', channelUrl: '', rating: 5 })
      setShowAddForm(false)
    }
  }

  const deleteChannel = (id) => {
    setChannels(channels.filter(channel => channel.id !== id))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ))
  }

  const formatSubscribers = (subs) => {
    if (!subs) return 'Unknown'
    return subs.includes('K') || subs.includes('M') || subs.includes('B') ? subs : `${subs} subscribers`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Youtube className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">YouTube Channels</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Channel
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New YouTube Channel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Channel Name"
              value={newChannel.name}
              onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Category (e.g., Tech, Gaming)"
              value={newChannel.category}
              onChange={(e) => setNewChannel({...newChannel, category: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Subscribers (e.g., 1.2M)"
              value={newChannel.subscribers}
              onChange={(e) => setNewChannel({...newChannel, subscribers: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="url"
              placeholder="Channel URL"
              value={newChannel.channelUrl}
              onChange={(e) => setNewChannel({...newChannel, channelUrl: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description"
              value={newChannel.description}
              onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent md:col-span-2"
              rows="2"
            />
            <select
              value={newChannel.rating}
              onChange={(e) => setNewChannel({...newChannel, rating: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addChannel} className="bg-green-600 hover:bg-green-700">
              Add Channel
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-red-400">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{channel.name}</h3>
              <Button
                onClick={() => deleteChannel(channel.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Category:</strong> {channel.category}</p>
              {channel.subscribers && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <strong>Subscribers:</strong> {formatSubscribers(channel.subscribers)}
                </div>
              )}
              {channel.description && (
                <p><strong>Description:</strong> {channel.description}</p>
              )}
              {channel.channelUrl && (
                <div className="flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  <a 
                    href={channel.channelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Visit Channel
                  </a>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(channel.rating)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {channel.dateAdded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {channels.length === 0 && (
        <div className="text-center py-12">
          <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No YouTube channels in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first channel to get started!</p>
        </div>
      )}
    </div>
  )
}