import mongoose from 'mongoose';

type connectionObject = {
    isConnected?:number
}



const connection:connectionObject = {};

async function dbConnect():Promise<void>{
    if (connection.isConnected){
        console.log("Already connected to db");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{});
        connection.isConnected = db.connection?.readyState;
        console.log("db is connected")

    }catch (error){
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect