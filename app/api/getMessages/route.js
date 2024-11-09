import { connectMongoDB } from "@/lib/mongodb";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { senderEmail, receiverEmail } = await req.json(); 

        await connectMongoDB();
        
        const messages = await Message.find({
            $or: [
                { send: senderEmail, recieve: receiverEmail },
                { send: receiverEmail, recieve: senderEmail } 
            ]
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error occurred while fetching messages" });
    }
}