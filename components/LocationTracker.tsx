'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { estimateFloor } from '@/utils/floorEstimation'
import io from 'socket.io-client'
import { useSession, signIn, signOut } from 'next-auth/react'

interface Location {
  latitude: number
  longitude: number
  altitude: number | null
  floor?: number | null
}

const socket = io()

export default function LocationTracker() {
  const { data: session } = useSession()
  const [consent, setConsent] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)

  useEffect(() => {
    if (consent) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            floor: estimateFloor(position.coords.latitude, position.coords.longitude),
          }
          setLocation(newLocation)
          sendLocationToBackend(newLocation)
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        { enableHighAccuracy: true }
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [consent])

  const handleConsentToggle = () => {
    setConsent(!consent)
  }

  const handleSignIn = () => {
    signIn()
  }

  const handleSignOut = () => {
    signOut()
  }

  const sendLocationToBackend = async (location: Location) => {
    if (!session?.user) {
      console.error('User not authenticated')
      return
    }

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...location, userId: session.user.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to send location data')
      }
      socket.emit('updateLocation', location)
    } catch (error) {
      console.error('Error sending location data:', error)
    }
  }

  return (
    <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Location Tracker</h2>
      {session ? (
        <>
          <p>Welcome, {session.user?.name || session.user?.email}</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
          <Button onClick={handleConsentToggle} className="ml-2">
            {consent ? 'Revoke Location Access' : 'Grant Location Access'}
          </Button>
          {consent && location && (
            <div className="mt-4">
              <p>Latitude: {location.latitude.toFixed(6)}</p>
              <p>Longitude: {location.longitude.toFixed(6)}</p>
              <p>Altitude: {location.altitude ? `${location.altitude.toFixed(2)} meters` : 'Not available'}</p>
              <p>Estimated Floor: {location.floor}</p>
            </div>
          )}
        </>
      ) : (
        <Button onClick={handleSignIn}>Sign In</Button>
      )}
    </div>
  )
}

