import mongoose from "mongoose";

async function Connection(){
    const options = {
        useUnifiedTopology: true
    }
    try {
        console.log("*****************");
        console.log("All env varibles");
        console.log(process.env);
        console.log("*************");
        console.log("Trying to connect to Database");
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("Successfully connected to Database");
    } catch (error) {
        console.log("Error while connecting to Database");
        console.log(error.message);
    }
}

export default Connection;