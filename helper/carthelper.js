const cartdb = require('../model/cartdb');
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Types


// ADDTOCART
async function addtocart (cartId,productId,price){
    const addToCart = await cartdb.findByIdAndUpdate(cartId,{
          $addToSet :{
            product :{
                product_id:new mongoose.Types.ObjectId(productId),
                quantity:1,
                price:price
            }
          }
    },{new:true,upsert:true});
    return addToCart
}

// REMOVE PRODUCT
async function productDelete(cartid,productId){
    console.log("cart helper is called")
    const find = await cartdb.findOne({_id:cartid,"product.product_id":productId})
    console.log("the product in the cart is:" + find)
    const productdel = await cartdb.findOneAndUpdate({_id:cartid,'product.product_id':productId},{$pull:{product:{product_id:productId}}},{new:true}).exec()
    console.log("removing")

    return productdel
}

// INCREASING PRODUCT
async function product_increasing(productId,){
         
}
module.exports = {
    addtocart,
    productDelete
}