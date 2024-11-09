import mongoose, { Schema, models } from "mongoose";

const messageSchema = new Schema(
    {
        end: {
            type: String,
            required: true,
        },
        recieve: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        time : {
            type: String,
            required: true
        }, 
        gelesen: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

const Message = models.Message || mongoose.model("Message", messageSchema);
export default Message;