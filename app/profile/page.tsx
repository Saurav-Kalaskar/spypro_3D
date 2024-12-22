import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function Profile() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">Your Profile</h1>
        <ProfileForm user={session.user} />
      </div>
    </main>
  )
}

