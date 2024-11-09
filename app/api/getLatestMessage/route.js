import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Message from "@/models/message";
import User from "@/models/user";

export async function POST(req) {
    try {
        const body = await req.json();
        const email = body.email;

        await connectMongoDB();

        const users = await User.find();

        if (!users || users.length === 0) {
            return NextResponse.json({ message: "No users found." }, { status: 404 });
        }

        const latestMessages = [];

        for (let i = 0; i < users.length; i++) {
            const user1 = users[i];

            if (user1.email !== email) {
                const latestMessage = await Message.find({
                    $or: [
                        { send: email, recieve: user1.email },
                        { send: user1.email, recieve: email }
                    ]
                })
                    .sort({ time: -1 })
                    .limit(1)
                    .exec();

                if (latestMessage.length > 0) {
                    latestMessages.push(latestMessage[0]);
                }
            }
        }

        if (latestMessages.length === 0) {
            return NextResponse.json({ message: "No latest messages found." }, { status: 404 });
        }

        return NextResponse.json({ messages: latestMessages }, { status: 200 });

    } catch (error) {
        console.error("Error occurred while fetching latest messages: ", error);
        return NextResponse.json({ message: "Error occurred." }, { status: 500 });
    }
}