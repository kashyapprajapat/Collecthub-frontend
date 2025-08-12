'use client'

import { useState } from 'react'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Gamepad2, Smartphone, Music, Code, Car, Youtube, Menu, X, FileText } from 'lucide-react'

// Import all collection components
import Games from '@/components/Games'
import MobileApps from '@/components/MobileApps'
import MusicCollection from '@/components/Music'
import ProgrammingLanguages from '@/components/ProgrammingLanguages'
import Vehicles from '@/components/Vehicles'
import YoutubeChannels from '@/components/YoutubeChannels'

export default function WelcomeScreen({ username, userData }) {
  const { isSignedIn } = useUser()
  const [activeComponent, setActiveComponent] = useState('welcome')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'games', name: 'Games', icon: Gamepad2, color: 'text-purple-600', component: Games },
    { id: 'mobile-apps', name: 'Mobile Apps', icon: Smartphone, color: 'text-blue-600', component: MobileApps },
    { id: 'music', name: 'Music', icon: Music, color: 'text-green-600', component: MusicCollection },
    { id: 'programming', name: 'Programming Languages', icon: Code, color: 'text-indigo-600', component: ProgrammingLanguages },
    { id: 'vehicles', name: 'Vehicles', icon: Car, color: 'text-red-600', component: Vehicles },
    { id: 'youtube', name: 'YouTube Channels', icon: Youtube, color: 'text-red-600', component: YoutubeChannels },
  ]

  const handleMenuClick = (itemId) => {
    setActiveComponent(itemId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const renderWelcomeContent = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome, {username}
        </h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600">CollectHub 🎒📄</h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">Your personal collections. All in one place.</p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          A unified platform to organize and store your personal collections effortlessly.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-4">Choose a collection from the sidebar to get started!</p>
        <div className="flex flex-wrap justify-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => handleMenuClick(item.id)}
                className="flex items-center space-x-2 hover:scale-105 transition-transform"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.name}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderActiveComponent = () => {
    if (activeComponent === 'welcome') {
      return renderWelcomeContent()
    }

    const activeItem = menuItems.find(item => item.id === activeComponent)
    if (activeItem) {
      const Component = activeItem.component
      return <Component />
    }
    
    return renderWelcomeContent()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="https://res.cloudinary.com/dpf5bkafv/image/upload/v1754918076/Collecthubheroimg_wpmtlh.png" 
              alt="CollectHub Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-900">CollectHub</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleMenuClick('welcome')}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${activeComponent === 'welcome' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-500' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Welcome</span>
              </button>
            </li>
            
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeComponent === item.id
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : item.color}`} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
                <p className="text-xs text-gray-500 truncate">{userData.email}</p>
              </div>
            </div>
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header - Mobile */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">CollectHub</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Login
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeComponent === 'welcome' ? 'Dashboard' : 
                   menuItems.find(item => item.id === activeComponent)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your personal collections with ease
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {!isSignedIn && (
                  <SignInButton mode="modal">
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                      Login
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderActiveComponent()}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-gray-300 mb-2">
              © 2024 CollectHub. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made by Kashyap Prajapati
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}