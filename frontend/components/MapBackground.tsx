'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import mapboxgl from 'mapbox-gl'
import * as THREE from 'three'
import io from 'socket.io-client'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

const socket = io('http://localhost:3000')

interface UserLocation {
  id: string
  latitude: number
  longitude: number
  altitude: number | null
  floor: number
}

function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 9,
        pitch: 60,
        bearing: -60,
        antialias: true
      })

      map.current.on('style.load', () => {
        if (map.current) {
          const layers = map.current.getStyle().layers
          const labelLayerId = layers?.find(
            (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
          )?.id

          map.current.addLayer(
            {
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            },
            labelLayerId
          )
        }
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}

function UserMarker({ location }: { location: UserLocation }) {
  const { scene } = useThree()
  const markerRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (markerRef.current) {
      const { latitude, longitude, altitude, floor } = location
      const [x, y] = mapboxgl.MercatorCoordinate.fromLngLat([longitude, latitude], altitude || 0)
      markerRef.current.position.set(x * 100, y * 100, (floor + 1) * 3) // Adjust the scale and height as needed
    }
  }, [location])

  return (
    <mesh ref={markerRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}

function MapScene() {
  const [userLocations, setUserLocations] = useState<UserLocation[]>([])

  useEffect(() => {
    socket.on('locationUpdate', (data: UserLocation) => {
      setUserLocations((prevLocations) => {
        const index = prevLocations.findIndex((loc) => loc.id === data.id)
        if (index !== -1) {
          const newLocations = [...prevLocations]
          newLocations[index] = data
          return newLocations
        } else {
          return [...prevLocations, data]
        }
      })
    })

    return () => {
      socket.off('locationUpdate')
    }
  }, [])

  const { scene } = useThree()
  const mapRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (mapRef.current) {
      mapRef.current.rotation.x = -Math.PI / 2
    }
  })

  return (
    <>
      <mesh ref={mapRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial>
          <MapboxMap />
        </meshBasicMaterial>
      </mesh>
      {userLocations.map((location) => (
        <UserMarker key={location.id} location={location} />
      ))}
    </>
  )
}

export default function MapBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <MapScene />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}

