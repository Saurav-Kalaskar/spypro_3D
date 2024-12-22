import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { latitude, longitude, altitude } = await req.json()
      const location = await prisma.location.create({
        data: {
          latitude,
          longitude,
          altitude,
        },
      })
      return NextResponse.json(location)
    } catch (error) {
      return NextResponse.json({ error: 'Error saving location' }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
}

