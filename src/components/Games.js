'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Gamepad2, Star, Calendar, Trash2 } from 'lucide-react'

export default function Games() {
  const [games, setGames] = useState([
    {
      id: 1,
      name: "The Legend of Zelda: Breath of the Wild",
      platform: "Nintendo Switch",
      genre: "Action-Adventure",
      rating: 5,
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "God of War",
      platform: "PlayStation 5",
      genre: "Action",
      rating: 5,
      dateAdded: "2024-01-10"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newGame, setNewGame] = useState({
    name: '',
    platform: '',
    genre: '',
    rating: 5
  })

  const addGame = () => {
    if (newGame.name && newGame.platform) {
      setGames([...games, {
        id: Date.now(),
        ...newGame,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setNewGame({ name: '', platform: '', genre: '', rating: 5 })
      setShowAddForm(false)
    }
  }

  const deleteGame = (id) => {
    setGames(games.filter(game => game.id !== id))
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
          <Gamepad2 className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Games Collection</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Game</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Game Name"
              value={newGame.name}
              onChange={(e) => setNewGame({...newGame, name: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Platform"
              value={newGame.platform}
              onChange={(e) => setNewGame({...newGame, platform: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Genre"
              value={newGame.genre}
              onChange={(e) => setNewGame({...newGame, genre: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={newGame.rating}
              onChange={(e) => setNewGame({...newGame, rating: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addGame} className="bg-green-600 hover:bg-green-700">
              Add Game
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-400">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{game.name}</h3>
              <Button
                onClick={() => deleteGame(game.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Platform:</strong> {game.platform}</p>
              <p><strong>Genre:</strong> {game.genre}</p>
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(game.rating)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {game.dateAdded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No games in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first game to get started!</p>
        </div>
      )}
    </div>
  )
}