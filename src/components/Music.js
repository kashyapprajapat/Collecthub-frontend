'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Music, Star, Calendar, Trash2, Clock, User } from 'lucide-react'

export default function MusicCollection() {
  const [tracks, setTracks] = useState([
    {
      id: 1,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      genre: "Rock",
      duration: "5:55",
      rating: 5,
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      genre: "Pop/Rock",
      duration: "3:07",
      rating: 5,
      dateAdded: "2024-01-10"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: '',
    rating: 5
  })

  const addTrack = () => {
    if (newTrack.title && newTrack.artist) {
      setTracks([...tracks, {
        id: Date.now(),
        ...newTrack,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setNewTrack({ title: '', artist: '', album: '', genre: '', duration: '', rating: 5 })
      setShowAddForm(false)
    }
  }

  const deleteTrack = (id) => {
    setTracks(tracks.filter(track => track.id !== id))
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
          <Music className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Music Collection</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Track
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Track</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Song Title"
              value={newTrack.title}
              onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Artist Name"
              value={newTrack.artist}
              onChange={(e) => setNewTrack({...newTrack, artist: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Album Name"
              value={newTrack.album}
              onChange={(e) => setNewTrack({...newTrack, album: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Genre"
              value={newTrack.genre}
              onChange={(e) => setNewTrack({...newTrack, genre: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 3:45)"
              value={newTrack.duration}
              onChange={(e) => setNewTrack({...newTrack, duration: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select
              value={newTrack.rating}
              onChange={(e) => setNewTrack({...newTrack, rating: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addTrack} className="bg-green-600 hover:bg-green-700">
              Add Track
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-green-400">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{track.title}</h3>
              <Button
                onClick={() => deleteTrack(track.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                <strong>Artist:</strong> {track.artist}
              </div>
              {track.album && <p><strong>Album:</strong> {track.album}</p>}
              {track.genre && <p><strong>Genre:</strong> {track.genre}</p>}
              {track.duration && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <strong>Duration:</strong> {track.duration}
                </div>
              )}
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(track.rating)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {track.dateAdded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No tracks in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first song to get started!</p>
        </div>
      )}
    </div>
  )
}