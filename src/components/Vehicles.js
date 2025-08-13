'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Car, Star, Calendar, Trash2, Fuel, Edit3, AlertTriangle } from 'lucide-react'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(null)
  const [formData, setFormData] = useState({
    vehicleName: '',
    typeOfVehicle: '',
    launchYear: '',
    reason: ''
  })
  const [apiLoading, setApiLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const API_BASE = 'https://collecthubdotnet.onrender.com/api/FavVehicle'
  
  // Get user from localStorage
  const getUser = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('collecthub_user')
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const user = getUser()
      if (!user) {
        showMessage('error', 'User not found. Please login again.')
        return
      }

      const response = await fetch(`${API_BASE}?userId=${user.id}`)
      const result = await response.json()
      
      if (result.success) {
        setVehicles(result.data || [])
        showMessage('success', result.message)
      } else {
        showMessage('error', 'Failed to fetch vehicles')
      }
    } catch (error) {
      showMessage('error', 'Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  // Add vehicle
  const addVehicle = async () => {
    if (!formData.vehicleName || !formData.typeOfVehicle) {
      showMessage('error', 'Please fill in vehicle name and type')
      return
    }

    const user = getUser()
    if (!user) {
      showMessage('error', 'User not found. Please login again.')
      return
    }

    setApiLoading(true)
    try {
      const payload = {
        userId: user.id,
        vehicleName: formData.vehicleName,
        typeOfVehicle: formData.typeOfVehicle,
        launchYear: parseInt(formData.launchYear) || new Date().getFullYear(),
        reason: formData.reason || 'Personal favorite'
      }

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      
      if (result.success) {
        setFormData({ vehicleName: '', typeOfVehicle: '', launchYear: '', reason: '' })
        setShowAddForm(false)
        showMessage('success', result.message)
        fetchVehicles()
      } else {
        showMessage('error', 'Failed to add vehicle')
      }
    } catch (error) {
      showMessage('error', 'Network error occurred')
    } finally {
      setApiLoading(false)
    }
  }

  // Update vehicle
  const updateVehicle = async () => {
    if (!formData.vehicleName || !formData.typeOfVehicle) {
      showMessage('error', 'Please fill in vehicle name and type')
      return
    }

    const user = getUser()
    if (!user) {
      showMessage('error', 'User not found. Please login again.')
      return
    }

    setApiLoading(true)
    try {
      const payload = {
        userId: user.id,
        vehicleName: formData.vehicleName,
        typeOfVehicle: formData.typeOfVehicle,
        launchYear: parseInt(formData.launchYear) || new Date().getFullYear(),
        reason: formData.reason || 'Personal favorite'
      }

      const response = await fetch(`${API_BASE}?id=${editingVehicle.id}&userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      
      if (result.success) {
        setFormData({ vehicleName: '', typeOfVehicle: '', launchYear: '', reason: '' })
        setEditingVehicle(null)
        showMessage('success', result.message)
        fetchVehicles()
      } else {
        showMessage('error', 'Failed to update vehicle')
      }
    } catch (error) {
      showMessage('error', 'Network error occurred')
    } finally {
      setApiLoading(false)
    }
  }

  // Delete vehicle
  const deleteVehicle = async (id) => {
    setApiLoading(true)
    try {
      const response = await fetch(`${API_BASE}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'text/plain'
        }
      })

      const result = await response.json()
      
      if (result.success) {
        setShowDeleteDialog(null)
        showMessage('success', result.message)
        fetchVehicles()
      } else {
        showMessage('error', 'Failed to delete vehicle')
      }
    } catch (error) {
      showMessage('error', 'Network error occurred')
    } finally {
      setApiLoading(false)
    }
  }

  const startEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      vehicleName: vehicle.vehicleName,
      typeOfVehicle: vehicle.typeOfVehicle,
      launchYear: vehicle.launchYear.toString(),
      reason: vehicle.reason
    })
    setShowAddForm(true)
  }

  const cancelForm = () => {
    setFormData({ vehicleName: '', typeOfVehicle: '', launchYear: '', reason: '' })
    setShowAddForm(false)
    setEditingVehicle(null)
  }

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        } animate-in slide-in-from-top-2`}>
          {message.text}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl transform transition-all scale-100 animate-in zoom-in-95 duration-200 border">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{showDeleteDialog.vehicleName}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteDialog(null)}
                variant="outline"
                disabled={apiLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteVehicle(showDeleteDialog.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={apiLoading}
              >
                {apiLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Car className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Vehicles Collection</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Vehicle Name/Model *"
              value={formData.vehicleName}
              onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Type of Vehicle *"
              value={formData.typeOfVehicle}
              onChange={(e) => setFormData({...formData, typeOfVehicle: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="number"
              placeholder="Launch Year"
              value={formData.launchYear}
              onChange={(e) => setFormData({...formData, launchYear: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              min="1900"
              max={new Date().getFullYear() + 5}
            />
            <textarea
              placeholder="Reason for liking this vehicle"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 md:col-span-2"
              rows="2"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <Button 
              onClick={editingVehicle ? updateVehicle : addVehicle} 
              className="bg-green-600 hover:bg-green-700 transition-all duration-200"
              disabled={apiLoading}
            >
              {apiLoading ? (editingVehicle ? 'Updating...' : 'Adding...') : (editingVehicle ? 'Update Vehicle' : 'Add Vehicle')}
            </Button>
            <Button 
              onClick={cancelForm} 
              variant="outline"
              disabled={apiLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-red-400 transform hover:scale-105">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{vehicle.vehicleName}</h3>
              <div className="flex space-x-1">
                <Button
                  onClick={() => startEdit(vehicle)}
                  size="sm"
                  variant="ghost"
                  className="text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(vehicle)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Type:</strong> {vehicle.typeOfVehicle}</p>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <strong>Launch Year:</strong> {vehicle.launchYear}
              </div>
              {vehicle.reason && (
                <p><strong>Why I like it:</strong> {vehicle.reason}</p>
              )}
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(5)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {new Date(vehicle.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500">No vehicles in your collection</h3>
          <p className="text-gray-400 mt-2">Add your first vehicle to get started!</p>
        </div>
      )}
    </div>
  )
}