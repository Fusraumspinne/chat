import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Message from "@/models/message";

export async function PUT(req) {
  try {
    const messagesToUpdate = await req.json();

    await connectMongoDB();

    await Promise.all(
      messagesToUpdate.map(async ({ _id, gelesen }) => {
        const message = await Message.findById(_id);
        if (!message) {
          return NextResponse.json({ message: "Messeg not found" }, { status: 404 });
        }

        message.gelesen = gelesen; 
        await message.save(); 
      })
    );

    return NextResponse.json({ message: "Message got updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error occured" }, { status: 500 });
  }
}
