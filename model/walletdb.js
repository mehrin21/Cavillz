const mongoose=require("mongoose")

const walletSchema=mongoose.Schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdetails",
        required: true,
      },
      balance:{
        type:Number,
        default:0,
        // required:false
      },
      orderDetails: [
        {
          orderid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderdetail",
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
            // required: true,
          },
          type: {
            type: String,
            required: true,
            // default:"Added"
            
          },
        },
      ],
})
const wallet = new mongoose.model('walletdata',walletSchema)
module.exports = wallet