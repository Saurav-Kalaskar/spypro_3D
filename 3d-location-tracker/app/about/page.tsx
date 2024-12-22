export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">About 3D Location Tracker</h1>
        <p className="text-center mb-8">
          3D Location Tracker is an innovative application that allows users to track their location in three-dimensional space.
          Using advanced technologies like Mapbox GL 3D API and real-time data processing, we provide accurate and up-to-date
          information about your position, including altitude and floor level in multi-story buildings.
        </p>
        <h2 className="text-2xl font-bold mb-2">Key Features:</h2>
        <ul className="list-disc list-inside mb-8">
          <li>Real-time 3D location tracking</li>
          <li>Floor-level accuracy in buildings</li>
          <li>Interactive 3D map visualization</li>
          <li>Secure user authentication</li>
          <li>Historical location data</li>
        </ul>
        <p className="text-center">
          Built with cutting-edge technologies including Next.js, React, and PostgreSQL, 3D Location Tracker
          offers a seamless and responsive user experience across devices.
        </p>
      </div>
    </main>
  )
}

