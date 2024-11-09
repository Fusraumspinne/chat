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

    try {
      const resSignIn = await signIn("credentials", {
        email, password, redirect: false
      })

      if (resSignIn.error) {
        setError("Invalid Login Informations")
        return
      }

      router.replace("dashboard")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card px-3">
        <div className="fs-1 fw-semibold container_form">
          Login
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column container_form">
          {error ? (
            <div
              className="fw-bold mb-2 p-2 text_white border_radius border border-1 border-danger"
              style={{ backgroundColor: "rgba(220, 53, 69, 0.75)" }}
            >
              {error}
            </div>
          ) : (
            <div></div>
          )}

          <InputField classname={"w_100 mb-2"} placeholder={"peter@gmail.com"} onchange={(e) => setEmail(e.target.value)} type={"text"} label={"E-Mail"} />
          <InputField classname={"w_100 mb-2"} placeholder={"1234"} onchange={(e) => setPassword(e.target.value)} type={"password"} label={"Password"}/>

          <Button text={"Login"} classname={"btn-primary"}/>

          <Link href={"/signup"} className="text-decoration-none text-dark mt-1 mb-3">
            Don&apos;t have an account?{" "}
            <span className="text-decoration-underline text-primary">Sign Up here</span>
          </Link>
        </form>
      </div>
    </div>

  );
}
