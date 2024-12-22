import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '3D Location Tracker',
  description: 'Track your location in 3D space',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

