'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Code, Star, Calendar, Trash2, Book, TrendingUp } from 'lucide-react'

export default function ProgrammingLanguages() {
  const [languages, setLanguages] = useState([
    {
      id: 1,
      name: "JavaScript",
      category: "Web Development",
      proficiency: 4,
      yearStarted: "2020",
      favoriteFramework: "React",
      rating: 5,
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Python",
      category: "Backend/AI",
      proficiency: 3,
      yearStarted: "2021",
      favoriteFramework: "Django",
      rating: 4,
      dateAdded: "2024-01-10"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    category: '',
    proficiency: 3,
    yearStarted: '',
    favoriteFramework: '',
    rating: 5
  })

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.category) {
      setLanguages([...languages, {
        id: Date.now(),
        ...newLanguage,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setNewLanguage({ name: '', category: '', proficiency: 3, yearStarted: '', favoriteFramework: '', rating: 5 })
      setShowAddForm(false)
    }
  }

  const deleteLanguage = (id) => {
    setLanguages(languages.filter(lang => lang.id !== id))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ))
  }

  const renderProficiency = (level) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master']
    return levels[level - 1] || 'Beginner'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Code className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800">Programming Languages</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Programming Language</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Language Name"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Category (e.g., Web, Mobile, AI)"
              value={newLanguage.category}
              onChange={(e) => setNewLanguage({...newLanguage, category: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              value={newLanguage.proficiency}
              onChange={(e) => setNewLanguage({...newLanguage, proficiency: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={1}>Beginner</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Advanced</option>
              <option value={4}>Expert</option>
              <option value={5}>Master</option>
            </select>
            <input
              type="text"
              placeholder="Year Started (e.g., 2020)"
              value={newLanguage.yearStarted}
              onChange={(e) => setNewLanguage({...newLanguage, yearStarted: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Favorite Framework/Library"
              value={newLanguage.favoriteFramework}
              onChange={(e) => setNewLanguage({...newLanguage, favoriteFramework: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              value={newLanguage.rating}
              onChange={(e) => setNewLanguage({...newLanguage, rating: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addLanguage} className="bg-green-600 hover:bg-green-700">
              Add Language
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {languages.map((language) => (
          <div key={language.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-indigo-400">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{language.name}</h3>
              <Button
                onClick={() => deleteLanguage(language.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Category:</strong> {language.category}</p>
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <strong>Proficiency:</strong> {renderProficiency(language.proficiency)}
              </div>
              {language.yearStarted && <p><strong>Started:</strong> {language.yearStarted}</p>}
              {language.favoriteFramework && (
                <div className="flex items-center">
                  <Book className="w-3 h-3 mr-1" />
                  <strong>Favorite Framework:</strong> {language.favoriteFramework}
                </div>
              )}
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(language.rating)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {language.dateAdded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {languages.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No programming languages in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first language to get started!</p>
        </div>
      )}
    </div>
  )
}