"use client"

import Button from '@/components/Button'
import React, { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Logout, Settings } from "@mui/icons-material"

function Dashboard() {
  const { data: session } = useSession()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className='d-flex flex-column vh-100 bg-primary'>
      <div className='top_bar text_white d-flex align-items-center ms-2 fs-3 fw-semibold'>
        Connectify
      </div>
      <div className='row h_100'>
        <div className='col-4 h_100'>
          <div className='h_100 d-flex'>
            <div className='d-flex flex-column justify-content-end align-items-end side_bar h_100'>
              <Button classname={"d-flex justify-content-center"} text={<Settings className="fs-3 text_white" />}/>
              <Button classname={"d-flex justify-content-center"} text={<Logout className="fs-3 text_white" />} onclick={() => signOut()} />
            </div>
            <div className='bg-light h_100 w_100' style={{borderRadius: "0.375rem 0.375rem 0 0"}}>

            </div>
          </div>
        </div>
        <div className='col-8 h_100 bg-light'  style={{borderRadius: "0.375rem 0 0 0"}}>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
