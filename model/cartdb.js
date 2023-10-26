const mongoose = require('mongoose')

// CART SCHEMA
const cartSchema = mongoose.Schema({
    userId : {
        type:String,
        required :true
    },
    product : [{
            product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:false
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        price:{
            type:Number,
            required:false,
        },
       
    }],
    
}) 
const carts = new mongoose.model("cart",cartSchema)

module.exports=carts