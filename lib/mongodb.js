import mongoose from "mongoose"

export const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }catch(error){
        console.log("Error while connecting to Database: ", error)
    }
}