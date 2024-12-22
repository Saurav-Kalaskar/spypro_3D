import MapBackground from '@/components/MapBackground'
import LocationTracker from '@/components/LocationTracker'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <MapBackground />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to 3D Location Tracker</h1>
        <p className="text-center mb-8">Track your location in 3D space with precision and ease.</p>
        <LocationTracker />
      </div>
    </main>
  )
}

