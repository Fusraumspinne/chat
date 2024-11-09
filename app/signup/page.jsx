"use client"

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function SignUp() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!name || !email || !password) {
            setError("All Fields are required")
            return
        }

        try{
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                heades: {
                    "Content-Type": "application/json,"
                },
                body: JSON.stringify({email})
            })

            const {user} = await resUserExists.json()

            if(user){
                setError("User already exists")
                return
            }

            const resUserCreate = await fetch("api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            })

            if(resUserCreate.ok){
                const form = e.target
                form.reset()
                router.push("/")
            }
            else {
                console.log("Creating user failed")
            }
        } catch (error){
            console.log("Error during user creation: ", error)
        }
    }

  return (
    <div>
      <p>Sign Up</p>

      <form onSubmit={handleSubmit}>
        <p>{error}</p>

        <InputField placeholder={"Name"} onchange={e => setName(e.target.value)}/>
        <InputField placeholder={"E-Mail"} onchange={e => setEmail(e.target.value)}/>
        <InputField placeholder={"Password"} onchange={e => setPassword(e.target.value)}/>

        <Button text={"Sign Up"}/>

        <Link href={"/"}>Already have an account? <span>Login here</span></Link>
      </form>
    </div>
  )
}

export default SignUp