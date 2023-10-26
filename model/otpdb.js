const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    email :{
        type:String,
        required:false
    },
    otp:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:false
    },
    createdAt :{
        type:Date,
        default:Date.now,
        index:{expires:60}
    }
})
const Otp =  new mongoose.model("Otp",otpSchema)
module.exports = Otp
