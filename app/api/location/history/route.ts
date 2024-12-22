import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const locations = await prisma.location.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to the last 10 locations
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching location history:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

