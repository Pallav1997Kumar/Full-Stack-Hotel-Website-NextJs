import mongoose from "mongoose";

async function Connection(){
    const options = {
        useUnifiedTopology: true
    }
    try {
        console.log("Trying to connect to Database");
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("Successfully connected to Database");
    } catch (error) {
        console.log("Error while connecting to Database");
        console.log(error.message);
    }
}

export default Connection;