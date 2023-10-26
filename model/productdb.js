const mongoose = require('mongoose')

const productSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    color:{
       type:String,
       required:true
    },
    image: {
        type: Array,
        required: true,
        validate: [arraylimit, "maximun 2 product image"]
    },

    category: {
        type: String,
        required: true,
    },
    category1: {
        type: String,
        required: true
    },
    coupon: {
        type: String,
        required: false
    },

});
function arraylimit(val) {
    return val.length <= 3

}


const products = new mongoose.model("product", productSchema)

module.exports = products
