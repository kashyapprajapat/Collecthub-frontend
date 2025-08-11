/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import WelcomeScreen from '@/components/WelcomeScreen'

export default function Home() {
  const { isSignedIn, user } = useUser()
  const [showAlert, setShowAlert] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const createUserInAPI = async () => {
      if (isSignedIn && user && !isCreatingUser) {
        const existingUser = localStorage.getItem('collecthub_user')
        if (existingUser) return

        setIsCreatingUser(true)
        try {
          const newUser = {
            name: user.fullName || user.firstName || user.username || 'User',
            email: user.primaryEmailAddress?.emailAddress || '',
            password: 'TempPass@123'
          }

          const response = await fetch('https://collecthubdotnet.onrender.com/api/Users', {
            method: 'POST',
            headers: {
              'accept': 'text/plain',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
          })

          const data = await response.json()
          if (data.success) {
            const toStore = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email
            }
            localStorage.setItem('collecthub_user', JSON.stringify(toStore))
          }
        } catch (error) {
          console.error('❌ Network Error:', error)
        } finally {
          setIsCreatingUser(false)
        }
      }
    }

    createUserInAPI()
  }, [isSignedIn, user, isCreatingUser])

  const handleCTAClick = () => {
    if (!isSignedIn) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } else {
      const localData = localStorage.getItem('collecthub_user')
      if (localData) {
        const parsedData = JSON.parse(localData)
        setUserData(parsedData)
        setShowWelcome(true)
      } else {
        alert('⏳ Please wait, we are setting up your account...')
      }
    }
  }

  // If user clicked the button and we have their data → show WelcomeScreen
  if (showWelcome && userData) {
    return <WelcomeScreen username={userData.name} userData={userData} />
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex flex-col">
  {/* Header */}
  <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <img 
            src="https://res.cloudinary.com/dpf5bkafv/image/upload/v1754918076/Collecthubheroimg_wpmtlh.png" 
            alt="CollectHub Logo" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">CollectHub</h1>
        </div>
        <div>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md">
                Login
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  </header>

  {/* Alert */}
  {showAlert && (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert className="bg-yellow-100 border-yellow-300 shadow-md">
        <AlertDescription className="text-yellow-900 text-center font-medium">
          🔐 Please login first to continue with CollectHub!
        </AlertDescription>
      </Alert>
    </div>
  )}

  {/* Hero Section */}
  <main className="flex-grow">
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-10">
          <img
            src="https://res.cloudinary.com/dpf5bkafv/image/upload/v1754918076/Collecthubheroimg_wpmtlh.png"
            alt="CollectHub Hero"
            className="mx-auto w-56 sm:w-64 rounded-xl shadow-lg"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
          CollectHub 📄
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 font-medium mb-2">
          Your personal collections. All in one place.
        </p>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          A unified platform to organize and store your personal collections effortlessly.
        </p>

        <Button
          onClick={handleCTAClick}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Let&apos;s do it! 🚀
        </Button>
      </div>
    </section>
  </main>

  {/* Footer */}
  <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-6 mt-10">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-sm text-gray-300">© 2024 CollectHub. All rights reserved.</p>
      <p className="text-xs text-gray-400 mt-1">Made by Kashyap Prajapati</p>
    </div>
  </footer>
</div>


  )
}
