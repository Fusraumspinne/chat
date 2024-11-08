import Button from '@/components/Button'
import React from 'react'

function Dashboard() {
  return (
    <div>
        <p>Account Details</p>

        <p>Username: </p>
        <p>E-Mail: </p>

        <Button text={"Log Out"}/>
    </div>
  )
}

export default Dashboard