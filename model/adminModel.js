const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var adminSchema = new mongoose.Schema({
      email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
    
})
module.exports = mongoose.model("adminSpace", adminSchema)
