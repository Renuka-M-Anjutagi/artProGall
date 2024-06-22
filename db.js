import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const connectDb = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to Mongodb', conn.connection.host);
    } catch (error) {
        console.log('error in connection: ', error);
    }
}

export default connectDb;
