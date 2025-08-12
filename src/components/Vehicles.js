'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Car, Star, Calendar, Trash2, Fuel, Calendar as CalendarIcon } from 'lucide-react'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: "Tesla Model 3",
      brand: "Tesla",
      type: "Electric Car",
      year: "2022",
      color: "Pearl White",
      fuelType: "Electric",
      rating: 5,
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Honda CBR 600RR",
      brand: "Honda",
      type: "Motorcycle",
      year: "2021",
      color: "Red",
      fuelType: "Gasoline",
      rating: 4,
      dateAdded: "2024-01-10"
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    brand: '',
    type: '',
    year: '',
    color: '',
    fuelType: '',
    rating: 5
  })

  const addVehicle = () => {
    if (newVehicle.name && newVehicle.brand) {
      setVehicles([...vehicles, {
        id: Date.now(),
        ...newVehicle,
        dateAdded: new Date().toISOString().split('T')[0]
      }])
      setNewVehicle({ name: '', brand: '', type: '', year: '', color: '', fuelType: '', rating: 5 })
      setShowAddForm(false)
    }
  }

  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id))
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
          <Car className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">Vehicles Collection</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Vehicle Name/Model"
              value={newVehicle.name}
              onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Brand"
              value={newVehicle.brand}
              onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <select
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Truck">Truck</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Electric Car">Electric Car</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <input
              type="text"
              placeholder="Year"
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Color"
              value={newVehicle.color}
              onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <select
              value={newVehicle.fuelType}
              onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select Fuel Type</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
            <select
              value={newVehicle.rating}
              onChange={(e) => setNewVehicle({...newVehicle, rating: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={addVehicle} className="bg-green-600 hover:bg-green-700">
              Add Vehicle
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-red-400">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{vehicle.name}</h3>
              <Button
                onClick={() => deleteVehicle(vehicle.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Brand:</strong> {vehicle.brand}</p>
              {vehicle.type && <p><strong>Type:</strong> {vehicle.type}</p>}
              {vehicle.year && (
                <div className="flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  <strong>Year:</strong> {vehicle.year}
                </div>
              )}
              {vehicle.color && <p><strong>Color:</strong> {vehicle.color}</p>}
              {vehicle.fuelType && (
                <div className="flex items-center">
                  <Fuel className="w-3 h-3 mr-1" />
                  <strong>Fuel Type:</strong> {vehicle.fuelType}
                </div>
              )}
              <div className="flex items-center space-x-1">
                <strong>Rating:</strong>
                <div className="flex ml-2">
                  {renderStars(vehicle.rating)}
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Added: {vehicle.dateAdded}
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