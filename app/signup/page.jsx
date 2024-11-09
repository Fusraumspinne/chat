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

        if (!name || !email || !password) {
            setError("All Fields are required")
            return
        }

        try {
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                heades: {
                    "Content-Type": "application/json,"
                },
                body: JSON.stringify({ email })
            })

            const { user } = await resUserExists.json()

            if (user) {
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

            if (resUserCreate.ok) {
                const form = e.target
                form.reset()
                router.push("/")
            }
            else {
                console.log("Creating user failed")
            }
        } catch (error) {
            console.log("Error during user creation: ", error)
        }
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card px-3">
                <div className="fs-1 fw-semibold container_form">
                    Sign Up
                </div>

                <form onSubmit={handleSubmit} className="d-flex flex-column container_form">
                    {error ? (
                        <div
                            className="fw-bold mb-2 p-2 text-light border_radius border border-1 border-danger"
                            style={{ backgroundColor: "rgba(220, 53, 69, 0.75)" }}
                        >
                            {error}
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <InputField classname={"w_100 mb-2"} placeholder={"Peter"} onchange={e => setName(e.target.value)} type={"text"} label={"Name"} />
                    <InputField classname={"w_100 mb-2"} placeholder={"peter@gmail.com"} onchange={e => setEmail(e.target.value)} type={"text"} label={"E-Mail"} />
                    <InputField classname={"w_100 mb-2"} placeholder={"1234"} onchange={e => setPassword(e.target.value)} type={"password"} label={"Password"} />

                    <Button text={"Sign Up"} />

                    <Link href={"/"} className="text-decoration-none text-dark mt-1 mb-3">
                        Already have an account? {" "}
                        <span className="text-decoration-underline text-primary">Login here</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default SignUp