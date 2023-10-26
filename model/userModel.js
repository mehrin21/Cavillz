const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema =  mongoose.Schema({
    fullname:{
        type:String,
        required:true,
      
    },
      email:{
        type:String,
        required:true,
        
    },

    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },

    isBlock:{
        type: Number,
        default:0
    },
    cartId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'carts',
        required:false
    },
    wishlistid :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'wislist',
        required:false
    },
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"address",
        required:false
    }]
});

console.log("connected otp")
//Export the model
const User = mongoose.model("userdetails", userSchema);
module.exports  = User

