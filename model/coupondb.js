const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    minimum:{
        type:String,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    }
})
const coupon = new mongoose.model('coupon',couponSchema)
module.exports = coupon