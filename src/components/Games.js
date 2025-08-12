'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Gamepad2,
  Calendar,
  Trash2,
  Edit,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'

const API_BASE_URL = 'https://collecthubdotnet.onrender.com'

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEdit] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [gameToDelete, setGameToDelete] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('collecthub_user')
      if (userData) {
        return JSON.parse(userData)
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
    }
    return null
  }

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  // Show error message
  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 4000)
  }

  // Fetch games from API
  const fetchGames = async () => {
    console.log('Fetching games...')
    try {
      setLoading(true)
      const userData = getUserData()
      if (!userData) {
        showError('User data not found. Please login again.')
        setGames([])
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/Games/user/${userData.id}`)
      if (response.ok) {
        const result = await response.json() // API returns an object with a 'data' field
        console.log('API Response for games:', result)

        if (result.success && Array.isArray(result.data)) {
          // Map API data keys (camelCase) to frontend state keys (lowercase)
          const mappedGames = result.data.map(game => ({
            id: game.id,
            userId: game.userId,
            gamename: game.gameName,   // Mapped from gameName
            platform: game.platform,
            reason: game.reason,
            isdigital: game.isDigital, // Mapped from isDigital
            createdat: game.createdAt,
            updatedat: game.updatedAt
          }));
          setGames(mappedGames)
          console.log('Mapped games for state:', mappedGames);
        } else {
          console.warn('API response structure unexpected:', result);
          setGames([]);
        }
      } else if (response.status === 404) {
        console.log('No games found for this user (404). Setting games to empty array.')
        setGames([])
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch games, response not ok:', response.status, errorText);
        throw new Error(errorText || 'Failed to fetch games');
      }
    } catch (error) {
      console.error('Error fetching games:', error)
      showError('Failed to load games. Please try again.')
      setGames([])
    } finally {
      setLoading(false)
    }
  }

  // Add new game via API
  const addGame = async (gameData) => {
    if (!gameData.gamename || !gameData.platform) {
      showError('Please fill in game name and platform')
      return false
    }

    try {
      setFormSubmitting(true)
      const userData = getUserData()
      if (!userData) {
        showError('User data not found. Please login again.')
        return false
      }

      const payload = {
        userId: userData.id,
        gameName: gameData.gamename,   // Sending as gameName for API
        platform: gameData.platform,
        reason: gameData.reason,
        isDigital: gameData.isdigital, // Sending as isDigital for API
      }
      console.log('Sending add game payload:', payload);

      const response = await fetch(`${API_BASE_URL}/api/Games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        showSuccess('Game added successfully!')
        await fetchGames() // Reload games after successful addition
        return true
      } else {
        const errorData = await response.text()
        console.error('Error response from add game API:', errorData);
        try {
            const parsedError = JSON.parse(errorData);
            if (parsedError.errors && parsedError.errors.Platform) {
                showError(parsedError.errors.Platform.join(', '));
            } else {
                showError(parsedError.title || 'Failed to add game');
            }
        } catch {
            showError(errorData || 'Failed to add game');
        }
        return false
      }
    } catch (error) {
      console.error('Error adding game:', error)
      showError('Failed to add game. Please try again.')
      return false
    } finally {
      setFormSubmitting(false)
    }
  }

  // Update game via API
  const updateGame = async (gameId, gameData) => {
    if (!gameData.gamename || !gameData.platform) {
      showError('Please fill in game name and platform')
      return false
    }

    try {
      setFormSubmitting(true)
      const userData = getUserData()
      if (!userData) {
        showError('User data not found. Please login again.')
        return false
      }

      const payload = {
        userId: userData.id,
        gameName: gameData.gamename,   // Sending as gameName for API
        platform: gameData.platform,
        reason: gameData.reason,
        isDigital: gameData.isdigital, // Sending as isDigital for API
      }
      console.log('Sending update game payload:', payload);

      const response = await fetch(
        `${API_BASE_URL}/api/Games/${gameId}/user/${userData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        showSuccess('Game updated successfully!')
        await fetchGames() // Reload games after successful update
        return true
      } else {
        const errorData = await response.text()
        console.error('Error response from update game API:', errorData);
        try {
            const parsedError = JSON.parse(errorData);
            if (parsedError.errors && parsedError.errors.Platform) {
                showError(parsedError.errors.Platform.join(', '));
            } else {
                showError(parsedError.title || 'Failed to update game');
            }
        } catch {
            showError(errorData || 'Failed to update game');
        }
        return false
      }
    } catch (error) {
      console.error('Error updating game:', error)
      showError('Failed to update game. Please try again.')
      return false
    } finally {
      setFormSubmitting(false)
    }
  }

  // Delete game via API
  const deleteGame = async (gameId) => {
    try {
      setFormSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/api/Games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setGameToDelete(null)
        showSuccess('Game deleted successfully!')
        await fetchGames() // Reload games after successful deletion
      } else {
        const errorData = await response.text()
        console.error('Error response from delete game API:', errorData);
        showError(errorData || 'Failed to delete game')
      }
    } catch (error) {
      console.error('Error deleting game:', error)
      showError('Failed to delete game. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Handle edit button click
  const handleEdit = (game) => {
    setEditingGame({
      id: game.id,
      gamename: game.gamename, // This is already the frontend's 'gamename'
      // Convert the platform to lowercase for pre-filling the dropdown
      platform: ['indoor', 'outdoor'].includes(game.platform?.toLowerCase()) ? game.platform.toLowerCase() : 'outdoor',
      reason: game.reason || '',
      isdigital: game.isdigital, // This is already the frontend's 'isdigital'
    })
    setShowEdit(true)
  }

  // Handle delete button click
  const handleDelete = (game) => {
    setGameToDelete(game)
    setShowDeleteDialog(true)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      console.error('Error formatting date:', e)
      return 'Invalid Date'
    }
  }

  // Load games on component mount only
  useEffect(() => {
    fetchGames()
  }, [])

  // Success Message Component
  const SuccessMessage = ({ message, onClose }) => (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-top duration-300">
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <Button variant="ghost" size="sm" onClick={onClose} type="button">
        <X className="w-4 h-4" />
      </Button>
    </div>
  )

  // Error Message Component
  const ErrorMessage = ({ message, onClose }) => (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-top duration-300">
      <AlertCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <Button variant="ghost" size="sm" onClick={onClose} type="button">
        <X className="w-4 h-4" />
      </Button>
    </div>
  )

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
      <p className="text-gray-500">Loading your games...</p>
    </div>
  )

  // Delete Confirmation Dialog
  const DeleteDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-in slide-in-from-top duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Delete
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove &quot;{gameToDelete?.gamename}&quot;
          from your collection? This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <Button
            onClick={() => deleteGame(gameToDelete.id)}
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={formSubmitting}
            type="button"
          >
            {formSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </Button>
          <Button
            onClick={() => {
              setShowDeleteDialog(false)
              setGameToDelete(null)
            }}
            variant="outline"
            className="flex-1"
            disabled={formSubmitting}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )

  // Form Component (reusable for Add and Edit)
  const GameForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState(() => {
      const defaultPlatform = 'outdoor';
      if (initialData) {
        const platformLower = initialData.platform?.toLowerCase();
        if (['indoor', 'outdoor'].includes(platformLower)) {
          return { ...initialData, platform: platformLower };
        } else {
          return { ...initialData, platform: defaultPlatform };
        }
      }
      return { gamename: '', platform: defaultPlatform, reason: '', isdigital: false };
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      const success = await onSubmit(formData)
      if (success) {
        onCancel()
      }
    }

    const isEdit = initialData && initialData.id;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600 animate-in slide-in-from-top duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isEdit ? 'Edit Game' : 'Add New Game'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="gamename"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Game Name *
              </label>
              <input
                type="text"
                id="gamename"
                name="gamename"
                placeholder="Enter game name"
                value={formData.gamename}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Platform *
              </label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white"
                required
              >
                <option value="outdoor">Outdoor</option>
                <option value="indoor">Indoor</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for Collection
              </label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Why do you love this game? What makes it special?"
                value={formData.reason}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                rows="3"
              />
            </div>

            <div>
              <label htmlFor="isdigital" className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isdigital"
                  name="isdigital"
                  checked={formData.isdigital}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Digital Copy
                </span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>{isEdit ? 'Update Game' : 'Add Game'}</>
              )}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && <DeleteDialog />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gamepad2 className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Games Collection</h2>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setShowEdit(false)
            setEditingGame(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 transition-colors"
          disabled={loading || formSubmitting}
          type="button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <GameForm
          onSubmit={addGame}
          onCancel={() => setShowAddForm(false)}
          isSubmitting={formSubmitting}
        />
      )}

      {/* Edit Form */}
      {showEditForm && editingGame && (
        <GameForm
          initialData={editingGame}
          onSubmit={(data) => updateGame(editingGame.id, data)}
          onCancel={() => {
            setShowEdit(false)
            setEditingGame(null)
          }}
          isSubmitting={formSubmitting}
        />
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Games Grid */}
      {!loading && games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-purple-400 group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 flex-1">
                  {game.gamename} {/* This should now correctly display */}
                </h3>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => {
                      handleEdit(game)
                      setShowAddForm(false)
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-50"
                    type="button"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(game)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Platform:</strong> {typeof game.platform === 'string' ? game.platform.charAt(0).toUpperCase() + game.platform.slice(1) : 'N/A'}
                </p>

                {game.reason && (
                  <p>
                    <strong>Why I love it:</strong> {game.reason}
                  </p>
                )}

                <div className="flex items-center space-x-2">
                  <strong>Format:</strong>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.isdigital
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {game.isdigital ? 'Digital' : 'Physical'}
                  </span>
                </div>

                <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                  <Calendar className="w-3 h-3 mr-1" />
                  Added: {formatDate(game.createdat)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && games.length === 0 && (
        <div className="text-center py-12">
          <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">
            No games in your collection
          </h3>
          <p className="text-gray-400 mt-2 mb-4">
            Start building your gaming library today!
          </p>
          <Button
            onClick={() => {
              setShowAddForm(true)
              setShowEdit(false)
              setEditingGame(null)
            }}
            className="bg-purple-600 hover:bg-purple-700"
            type="button"
            disabled={formSubmitting}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Game
          </Button>
        </div>
      )}
    </div>
  )
}