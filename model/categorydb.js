const mongoose = require('mongoose')

const categoryschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true,
        default: 0
    }
})
const category = new mongoose.model("category",categoryschema)
module.exports = category