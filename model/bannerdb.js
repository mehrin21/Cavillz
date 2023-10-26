const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
   image:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true,
   }

})
const banner = mongoose.model("banner",bannerSchema)

module.exports = banner