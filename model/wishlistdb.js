const mongoose = require('mongoose')

const wishListSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: false

    }]
})
console.log("connected")

const wishList = new mongoose.model("wishlist", wishListSchema)
module.exports = wishList