import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '3D Location Tracker',
  description: 'Track your location in 3D space',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

