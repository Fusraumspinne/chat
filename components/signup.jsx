"use client"

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()

    const convertToBase64 = (e) => {
        console.log("konvertieren");
    
        if (!e.target.files || e.target.files.length === 0) {
            console.log("No file selected");
            return;
        }
    
        let file = e.target.files[0];
    
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
    
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
    
                let maxWidth = 400;
                let scaleFactor = maxWidth / img.width;
                let newHeight = img.height * scaleFactor;
    
                canvas.width = maxWidth;
                canvas.height = newHeight;
    
                ctx.drawImage(img, 0, 0, maxWidth, newHeight);
    
                let base64Image = canvas.toDataURL(file.type);
    
                while (getBase64Size(base64Image) > 32000 && maxWidth > 100) {
                    maxWidth -= 50;  
                    scaleFactor = maxWidth / img.width;
                    newHeight = img.height * scaleFactor;
    
                    canvas.width = maxWidth;
                    canvas.height = newHeight;
    
                    ctx.drawImage(img, 0, 0, maxWidth, newHeight);
    
                    base64Image = canvas.toDataURL(file.type);
                }
    
                setProfileImage(base64Image);
            };
        };
    
        reader.onerror = (error) => {
            console.log("Error during conversion: ", error);
        };
    };
    
    const getBase64Size = (base64Str) => {
        return Math.round((base64Str.length * 3) / 4);  
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !password || !profileImage) {
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
                    name, email, password, profileImage
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
                            className="fw-bold mb-2 p-2 text_white border_radius border border-1 border-danger"
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

                    <div className="mb-2">
                        <label>Profile Image</label>
                        <input type="file" accept="image/*" onChange={convertToBase64} className="form-control w_100 mb-2" />
                    </div>

                    <Button text={"Sign Up"} classname={"btn-primary"} />

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