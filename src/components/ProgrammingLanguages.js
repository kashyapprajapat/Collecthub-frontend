'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Code, Star, Calendar, Trash2, Book, TrendingUp, Edit3, Save, X, AlertTriangle, Target } from 'lucide-react'

export default function ProgrammingLanguages() {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLanguage, setEditingLanguage] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, languageId: null, languageName: '' })
  
  const [newLanguage, setNewLanguage] = useState({
    programmingLanguageName: '',
    useCase: '',
    reason: ''
  })

  const [editLanguage, setEditLanguage] = useState({
    programmingLanguageName: '',
    useCase: '',
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

  const fetchLanguages = async () => {
    const userId = getUserId()
    if (!userId) {
      showAlert('User not found. Please login again.', 'error')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/FavProgrammingLanguages?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setLanguages(data.data || [])
      } else {
        showAlert('Failed to fetch programming languages collection', 'error')
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
      showAlert('Error loading programming languages collection', 'error')
    } finally {
      setLoading(false)
    }
  }

  const addLanguage = async () => {
    if (!newLanguage.programmingLanguageName || !newLanguage.useCase) {
      showAlert('Please fill in language name and use case', 'error')
      return
    }

    const userId = getUserId()
    if (!userId) {
      showAlert('User not found. Please login again.', 'error')
      return
    }

    try {
      const response = await fetch('https://collecthubdotnet.onrender.com/api/FavProgrammingLanguages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...newLanguage
        })
      })

      const data = await response.json()
      
      if (data.success) {
        showAlert('Programming language added successfully!', 'success')
        setNewLanguage({ programmingLanguageName: '', useCase: '', reason: '' })
        setShowAddForm(false)
        fetchLanguages() // Reload languages
      } else {
        showAlert('Failed to add programming language', 'error')
      }
    } catch (error) {
      console.error('Error adding language:', error)
      showAlert('Error adding programming language', 'error')
    }
  }

  const startEdit = (language) => {
    setEditingLanguage(language.id)
    setEditLanguage({
      programmingLanguageName: language.programmingLanguageName,
      useCase: language.useCase,
      reason: language.reason || ''
    })
  }

  const cancelEdit = () => {
    setEditingLanguage(null)
    setEditLanguage({ programmingLanguageName: '', useCase: '', reason: '' })
  }

  const updateLanguage = async (languageId) => {
    if (!editLanguage.programmingLanguageName || !editLanguage.useCase) {
      showAlert('Please fill in language name and use case', 'error')
      return
    }

    const userId = getUserId()
    if (!userId) {
      showAlert('User not found. Please login again.', 'error')
      return
    }

    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/FavProgrammingLanguages?id=${languageId}&userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editLanguage)
      })

      const data = await response.json()
      
      if (data.success) {
        showAlert('Programming language updated successfully!', 'success')
        setEditingLanguage(null)
        fetchLanguages() // Reload languages
      } else {
        showAlert('Failed to update programming language', 'error')
      }
    } catch (error) {
      console.error('Error updating language:', error)
      showAlert('Error updating programming language', 'error')
    }
  }

  const confirmDelete = (language) => {
    setDeleteConfirm({ 
      show: true, 
      languageId: language.id, 
      languageName: language.programmingLanguageName 
    })
  }

  const deleteLanguage = async () => {
    try {
      const response = await fetch(`https://collecthubdotnet.onrender.com/api/FavProgrammingLanguages?id=${deleteConfirm.languageId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        showAlert('Programming language deleted successfully!', 'success')
        fetchLanguages() // Reload languages
      } else {
        showAlert('Failed to delete programming language', 'error')
      }
    } catch (error) {
      console.error('Error deleting language:', error)
      showAlert('Error deleting programming language', 'error')
    } finally {
      setDeleteConfirm({ show: false, languageId: null, languageName: '' })
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;<strong>{deleteConfirm.languageName}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={deleteLanguage}
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                Yes, Delete
              </Button>
              <Button 
                onClick={() => setDeleteConfirm({ show: false, languageId: null, languageName: '' })}
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
          <Code className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800">Programming Languages</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Programming Language</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language Name *</label>
              <input
                type="text"
                placeholder="e.g., JavaScript, Python"
                value={newLanguage.programmingLanguageName}
                onChange={(e) => setNewLanguage({...newLanguage, programmingLanguageName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Use Case *</label>
              <input
                type="text"
                placeholder="e.g., Web Development, Data Science"
                value={newLanguage.useCase}
                onChange={(e) => setNewLanguage({...newLanguage, useCase: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <textarea
                placeholder="Why do you love this programming language?"
                value={newLanguage.reason}
                onChange={(e) => setNewLanguage({...newLanguage, reason: e.target.value})}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button 
              onClick={addLanguage} 
              className="bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
            <Button 
              onClick={() => {
                setShowAddForm(false)
                setNewLanguage({ programmingLanguageName: '', useCase: '', reason: '' })
              }} 
              variant="outline"
              className="transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((language) => (
          <div key={language.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-indigo-400 group">
            {editingLanguage === language.id ? (
              // Edit Form
              <div className="space-y-3 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={editLanguage.programmingLanguageName}
                  onChange={(e) => setEditLanguage({...editLanguage, programmingLanguageName: e.target.value})}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={editLanguage.useCase}
                  onChange={(e) => setEditLanguage({...editLanguage, useCase: e.target.value})}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <textarea
                  value={editLanguage.reason}
                  onChange={(e) => setEditLanguage({...editLanguage, reason: e.target.value})}
                  rows={2}
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateLanguage(language.id)}
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
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {language.programmingLanguageName}
                  </h3>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      onClick={() => startEdit(language)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-500 hover:bg-blue-50 p-1 h-auto"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => confirmDelete(language)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 p-1 h-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Target className="w-3 h-3 mr-2 text-indigo-500" />
                    <strong>Use Case:</strong> <span className="ml-1">{language.useCase}</span>
                  </div>
                  {language.reason && (
                    <div className="mt-3">
                      <strong className="text-gray-700">Why I love it:</strong>
                      <p className="text-gray-600 text-sm mt-1 italic bg-gray-50 p-2 rounded">
                        &quot;{language.reason}&quot;
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Code className="w-3 h-3 mr-1" />
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        {language.programmingLanguageName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Added to collection
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {languages.length === 0 && (
        <div className="text-center py-12 animate-in fade-in duration-500">
          <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No programming languages in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first language to get started!</p>
        </div>
      )}
    </div>
  )
}