"use client"

import Button from '@/components/Button'
import React from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

function Dashboard() {
  const {data: session} = useSession()

  return (
    <div>
        <p>Account Details</p>

        <p>Name: {session?.user?.name}</p>
        <p>E-Mail: {session?.user?.email}</p>

        <Button text={"Log Out"} onclick={() => signOut()}/>
    </div>
  )
}

export default Dashboard