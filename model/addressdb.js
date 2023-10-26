const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    houseno: {
        type: String,
    },
    street: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    customerid: {
        type: String,
    },
});

const address = new mongoose.model("address", addressSchema);
console.log("address");
module.exports = address;
