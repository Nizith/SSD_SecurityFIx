const mongoose = require("mongoose");
const { MONDODB_URL } = require("./config");

const connectDB = async () => {
    try {
        
        //passing the URL and connecting to the mongoDB via the connect function in mongoose
        await mongoose.connect(MONDODB_URL)
        console.log("MongoDB Connection Successful!");

    } catch (error) {

        console.log("MongoDB Connection Unsuccessful!", error);
        //Exit process when its fail
        process.exit(1);
    }
}

module.exports = connectDB;