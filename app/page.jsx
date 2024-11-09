"use client"

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try{
      const resSignIn = await signIn("credentials", {
        email, password, redirect:false
      })

      if(resSignIn.error){
        setError("Invalid Informations")
        return
      }

      router.replace("dashboard")
    } catch(error){
      console.log(error)
    }
  }

  return (
    <div>
      <p>Enter your Details</p>

      <form onSubmit={handleSubmit}>
        <p>{error}</p>

        <InputField placeholder={"E-Mail"} onchange={e => setEmail(e.target.value)}/>
        <InputField placeholder={"Password"} onchange={e => setPassword(e.target.value)}/>

        <Button text={"Login"}/>

        <Link href={"/signup"}> Don&apos;t have an account? <span>Sign Up here</span></Link>
      </form>
    </div>
  );
}
