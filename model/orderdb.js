const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref : "userdetails",
        required:true
    },
    product:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "product",
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            default:"pending"
        },
        paymentStatus:{
            type:String,
            default:"unpaid"
        },
        productPrice:{
            type:Number,
            required:true
        },

    }],
    totalAmount :{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "address",
        required:true
    },
   
    orderDate:{
        type:Date,
        default:Date.now
    },
    paymentStatus:{
        type:String,
        default:"unpaid"
    },
    wallet:{
        type:Number,
        default:0
    },
    coupon: {
       type:String,
       required:false
    }
})
const order = new mongoose.model("orderdetails",orderSchema)
module.exports =  order