const mongoose = require("mongoose")
require('dotenv').config()
const dbConnect = () => {
    try {
        const connect = mongoose.connect(process.env.MONGODB_URL);
        console.log("Db is connected")
    } catch (error) {
        console.log("db not connected")


    }

}
module.exports = dbConnect;