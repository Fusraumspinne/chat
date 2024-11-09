import SignUp from '@/components/signup'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function page() {
    const session = await getServerSession(authOptions)

  if(session) redirect("/dashboard")

  return (
    <div>
        <SignUp/>
    </div>
  )
}

export default page