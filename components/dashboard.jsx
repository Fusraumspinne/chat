"use client"

import Button from '@/components/ui/Button'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Logout, Settings, MarkEmailUnreadOutlined, Send } from "@mui/icons-material"
import InputField from './ui/InputField'
import Image from 'next/image'

function Dashboard() {
  const { data: session } = useSession()

  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
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
              <InputField classname={"w_100 mb-2 border_o"} placeholder={"Type Name here..."} onchange={(e) => setSearchTerm(e.target.value)} type={"text"} />

              {users.filter(filterUsers).map((user, index) => {
                if (user.email === session?.user?.email) {
                  return null;
                }
                return (
                  <div key={user._id} onClick={() => setUser(user)}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex">
                        <Image className="profile_image mx-3" src={user.profileImage} alt="icon" width={40} height={40} />
                        <div className="d-flex flex-column">
                          <div className="fw-semibold">{user.name}</div>
                          <div className="text-muted">You: Leck Eier</div>
                        </div>
                      </div>

                      <MarkEmailUnreadOutlined className="me-3 fs-3" />
                    </div>
                    <hr className='my-2' />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='col-8 h_100 bg-light d-flex flex-column p-0' style={{ borderRadius: "0.375rem 0 0 0" }}>
          {user ? (
            <div className="d-flex align-items-center my-2">
              <Image className="profile_image ms-3 me-2" src={user?.profileImage} alt={"icon"} width={40} height={40} />
              <div className="fs-3">{user?.name}</div>
            </div>
          ) : (
            <div>

            </div>
          )}
          <hr className='m-0' />
          <div className="flex-grow-1">
            {user ? (
              <div>

              </div>
            ) : (
              <div className='d-flex justify-content-center align-items-center h_100 mx-5 px-5 fs-5'>
                {"Welcome to the chat empire of Fußraumspinne! 🕸️ Here, privacy is... well, optional. Every message? Visible. Every edit? At my fingertips. Every delete? Just a click away. I am the Ultimate Overlord of this very legit platform, and if you dare challenge my reign… prepare for the banishment of a lifetime. But hey, no worries—feel free to enjoy my totally secure and not-at-all sketchy website. 😉"}
              </div>
            )}
          </div>

          {user ? (
            <form className='row mt-auto'>
              <div className='col-11 pe-0'>
                <InputField classname={"w_100 border_0"} placeholder={"Type Message here..."} onchange={(e) => setSearchTerm(e.target.value)} type={"text"} />
              </div>
              <div className='col-1 p-0'>
                <Button classname={"d-flex justify-content-center btn-primary w_100 border_0"} text={<Send className="fs-4 text_white" />} />
              </div>
            </form>
          ) : (
            <div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
