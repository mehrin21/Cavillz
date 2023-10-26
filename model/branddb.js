const mongoose = require('mongoose')

const brandschema = mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    }
    
})
const brand = new mongoose.model("brand",brandschema)
module.exports = brand