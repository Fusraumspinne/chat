"use client"

import Button from '@/components/ui/Button'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Logout, Settings, MarkEmailUnreadOutlined, Send, Check, DoneAll } from "@mui/icons-material"
import InputField from './ui/InputField'
import Image from 'next/image'

function Dashboard() {
  const { data: session } = useSession()

  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [latestMessages, setLatestMessages] = useState([])
  const [send, setSend] = useState()
  const [recieve, setRecieve] = useState()
  const [message, setMessage] = useState()
  const [time, setTime] = useState()
  const [gelesen, setGelesen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => {
    setSend(session?.user?.email)
    if (user) setRecieve(user.email)

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchLatestMessages()
  }, [session]);

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

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const resGetMessages = await fetch("/api/getMessages", {
        method: "POST",
        body: JSON.stringify({
          senderEmail: session?.user?.email,
          receiverEmail: user.email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (resGetMessages.ok) {
        const data = await resGetMessages.json()
        setMessages(data.messages)
        console.log(data.messages)
      } else {
        console.error("Error occurred while fetching messages:", resGetMessages.statusText)
      }
    } catch (error) {
      console.error("Error occurred while fetching messages:", error)
    }
  }

  const fetchLatestMessages = async () => {
    if (session?.user?.email == null) {
      return
    }

    try {
      const res = await fetch("/api/getLatestMessage", {
        method: "POST",
        body: JSON.stringify({
          email: session?.user?.email
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.messages);
        setLatestMessages(data.messages)
      } else {
        console.error("Error occurred while fetching latest messages: ", data.message);
      }
    } catch (error) {
      console.error("Error occurred while fetching latest messages: ", error);
    }
  };

  useEffect(() => {
    const currentTimeInGermany = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
    setTime(currentTimeInGermany);

    setSend(session?.user?.email)
    if (user) setRecieve(user.email)
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!send || !recieve || !message || !time) {
      console.log("All Inputs are requird.")
      return
    }

    try {
      const resSendMessage = await fetch("/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          send,
          recieve,
          message,
          time,
          gelesen
        })
      })

      if (resSendMessage.ok) {
        console.log("Message Send")
      } else {
        console.log("Sending Message failed")
      }
    } catch (error) {
      console.log("Error during sending Message: ", error)
    }

    fetchMessages()
    setMessage("")
  }

  const selectUser = (newUser) => {
    setMessages([])
    setUser(newUser)
  }

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    const updateUnreadMessages = async () => {
      if (!session?.user?.email) return;

      const unreadMessages = messages.filter(message =>
        message.recieve === session?.user?.email && !message.gelesen
      );

      if (unreadMessages.length === 0) {
        return;
      }

      const updatedMessages = unreadMessages.map(message => ({
        ...message,
        gelesen: true
      }));

      setMessages(prevMessages => prevMessages.map(msg =>
        updatedMessages.find(updatedMsg => updatedMsg._id === msg._id) || msg
      ));

      try {
        const response = await fetch("/api/updateMessage", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMessages.map(({ _id, gelesen }) => ({ _id, gelesen }))),
        });

        if (response.ok) {
          console.log("Nachrichten erfolgreich aktualisiert");
        } else {
          console.error("Fehler beim Aktualisieren der Nachrichten:", response.statusText);
        }
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Nachrichten:", error);
      }
    };

    updateUnreadMessages()
  }, [messages]);


  return (
    <div className='d-flex flex-column vh-100 bg-primary'>
      <div className='top_bar text_white d-flex align-items-center ms-2 fs-3 fw-semibold'>
        Flopper Chat
      </div>
      <div className='row h_100'>
        <div className='col-4 h_100'>
          <div className='h_100 d-flex'>
            <div className='d-flex flex-column justify-content-end align-items-end side_bar h_100'>
              <Button classname={"d-flex justify-content-center"} text={<Settings className="fs-3 text_white" />} />
              <Button classname={"d-flex justify-content-center"} text={<Logout className="fs-3 text_white" />} onclick={() => signOut()} />
            </div>
            <div className='w_100 h_100'>
              <InputField classname={"w_100 mb-2"} placeholder={"Type Name here..."} onchange={(e) => setSearchTerm(e.target.value)} type={"text"} />
              <div className='bg-light h_100 custom_overflow' style={{ borderRadius: "0.375rem 0.375rem 0 0" }}>
                {users.filter(filterUsers).map((user) => {
                  if (user.email === session?.user?.email) {
                    return null;
                  }

                  const latestMessage = latestMessages.find(
                    (message) => message.send === user.email || message.recieve === user.email
                  );

                  let latestMessageText = latestMessage ? latestMessage.message : "No messages";

                  if (latestMessage && latestMessage.send === session?.user?.email) {
                    latestMessageText = `You: ${latestMessageText}`;
                  }

                  let newMessage = false;

                  if (latestMessage && !latestMessage.gelesen && latestMessage.recieve === session?.user?.email) {
                    newMessage = true;
                  }

                  return (
                    <div key={user._id} onClick={() => selectUser(user)} className='mt-2'>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex">
                          <Image className="profile_image mx-3" src={user.profileImage} alt="icon" width={40} height={40} />
                          <div className="d-flex flex-column">
                            <div className="fw-semibold">{user.name}</div>
                            <div className="text-muted">{latestMessageText}</div>
                          </div>
                        </div>

                        {newMessage ? (
                          <MarkEmailUnreadOutlined className="me-3 fs-3" />
                        ) : (
                          <div>

                          </div>
                        )}
                      </div>
                      <hr className='my-1' />
                    </div>
                  );
                })}
              </div>
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
                {messages.map((message) => (
                  <div key={message._id} className='my-1'>
                    {message.send === session?.user?.email ? (
                      <div className="row px-3 me-2">
                        <div className="col-4"></div>
                        <div className="outgoing_message col-8 card">
                          <div className="d-flex justify-content-start">
                            {message.message}
                          </div>
                          <div className="time d-flex justify-content-end align-items-center">
                            {message.time}
                            {message.gelesen === true ? (
                              <DoneAll className="ms-2" style={{ fontSize: "16px" }} />
                            ) : (
                              <Check className="ms-2" style={{ fontSize: "16px" }} />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row px-2 ms-1">
                        <div className="incoming_message col-8 card">
                          <div className="d-flex justify-content-start">
                            {message.message}
                          </div>
                          <div className="time d-flex justify-content-end align-items-center">
                            {message.time}
                          </div>
                        </div>
                        <div className="col-4"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h_100 mx-5 px-5 fs-5">
                {"Welcome to the chat empire of Fußraumspinne! 🕸️ Here, privacy is... well, optional. Every message? Visible. Every edit? At my fingertips. Every delete? Just a click away. I am the Ultimate Overlord of this very legit platform, and if you dare challenge my reign… prepare for the banishment of a lifetime. But hey, no worries—feel free to enjoy my totally secure and not-at-all sketchy website. 😉"}
              </div>
            )}
          </div>

          {user ? (
            <form onSubmit={handleSubmit} className='row mt-auto'>
              <div className='col-11 pe-0'>
                <InputField classname={"w_100 border_0"} placeholder={"Type Message here..."} onchange={(e) => setMessage(e.target.value)} type={"text"} />
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
