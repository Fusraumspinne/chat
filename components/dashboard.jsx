"use client"

import Button from '@/components/ui/Button'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Logout, Settings, MarkEmailUnreadOutlined } from "@mui/icons-material"
import InputField from './ui/InputField'
import Image from 'next/image'

function Dashboard() {
  const { data: session } = useSession()

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/getUsers", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        console.log(data.users)
      } else {
        console.error("Error occurred while fetching users: ", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while fetching users:", error);
    }
  };

  const filterUsers = (user) => {
    if (!searchTerm) {
      return true;
    }

    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className='d-flex flex-column vh-100 bg-primary'>
      <div className='top_bar text_white d-flex align-items-center ms-2 fs-3 fw-semibold'>
        Connectify
      </div>
      <div className='row h_100'>
        <div className='col-4 h_100'>
          <div className='h_100 d-flex'>
            <div className='d-flex flex-column justify-content-end align-items-end side_bar h_100'>
              <Button classname={"d-flex justify-content-center"} text={<Settings className="fs-3 text_white" />} />
              <Button classname={"d-flex justify-content-center"} text={<Logout className="fs-3 text_white" />} onclick={() => signOut()} />
            </div>
            <div className='bg-light h_100 w_100' style={{ borderRadius: "0.375rem 0.375rem 0 0" }}>
              <InputField classname={"w_100 mb-2"} placeholder={"Type Name here..."} onchange={(e) => setSearchTerm(e.target.value)} type={"text"} />

              {users.filter(filterUsers).map((user, index) => {
                if (user.email === session?.user?.email) {
                  return null;
                }
                return (
                  <div key={user._id}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex">
                        <Image className="profile_image mx-3" src={user.profileImage} alt="icon" width={40} height={40}/>
                        <div className="d-flex flex-column">
                          <div className="fw-semibold">{user.name}</div>
                          <div className="text-muted">You: Leck Eier</div>
                        </div>
                      </div>

                      <MarkEmailUnreadOutlined className="me-3 fs-3" />
                    </div>
                    <hr className='my-2'/>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='col-8 h_100 bg-light' style={{ borderRadius: "0.375rem 0 0 0" }}>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
