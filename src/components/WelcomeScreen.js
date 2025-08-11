'use client'

import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default function WelcomeScreen({ username, userData }) {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="https://res.cloudinary.com/dpf5bkafv/image/upload/v1754918076/Collecthubheroimg_wpmtlh.png" 
                alt="CollectHub Logo" 
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">CollectHub</h1>
            </div>

            {/* Auth Button */}
            <div className="flex items-center">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
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

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Welcome, {username}
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <p className="text-lg text-gray-700 mb-2">
            <strong>CollectHub ID:</strong> {userData.id}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Name:</strong> {userData.name}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
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
  )
}
