const User = require('../model/userModel')
const cartdb = require('../model/cartdb');
const product = require('../model/productdb')
const coupondb = require('../model/coupondb')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;
const cartHelper = require('../helper/carthelper');
// const { PricingV1PhoneNumberPhoneNumberCountryInstancePhoneNumberPrices } = require('twilio/lib/rest/pricing/v1/phoneNumber/country');


// CART -  GET 
// const get_cart = async (req, res) => {
//   try {
//     const session = req.session.userID
//     console.log(session)
//     const cart = await cartdb.find({ userId: req.session.userID }).populate('product.product_id').exec()
//     // console.log(cart.product.quantity)

//     console.log("cart " + cart)
//     res.render('ceckout', { session: session, cart: cart })
//   } catch (error) {
//     console.log(error.message)
//   }
// }



// CART- PUT
const addtocart = async (req, res) => {
  const id = req.body._id;
  const product_price = req.body.price
  // console.log("price"  + product_price)
  // const price = req.body.price
  // console.log("price" + price)
  try {
    // CHECKING WHETHER USER HAVE A CART OR NOT
    let cartExist = await cartdb.findOne({ userId: req.session.userID })
    console.log("user already have a cart ")

    console.log("here")
    if (cartExist) {

      const product_exist = await cartdb.findOne({ userId: req.session.userID, "product.product_id": new ObjectId(id) })
      console.log("product_exist " + product_exist)
      if (!product_exist) {
        console.log("product does not exist")
        console.log("price"  + product_price)
        const cartId = await cartdb.find({ userId: req.session.userID })
        const productid = id
        const price = product_price
        

        // addtocartHelper
        const addtocart = await cartHelper.addtocart(cartId,productid,price)
        if (addtocart) {
          console.log('Product Already Added to your cart')
          res.json({ message: 'Product already added' })
        } else {
          console.log('Error adding product to the cart');
          res.send({ message: 'Error adding product to the cart' });
        }

        return;
      } else {
        res.json({ message: "Product  added" })
        console.log("working")
        return;
      }
    } else {
      /* This else case works in case the cart is not already created and User is purchasing for the first time */
     
      const productData = {
        product_id: id,
        quantity: 1,
        price:product_price
      };

      const User_cart = new cartdb({ userId: req.session.userID, product: [] })
      await User_cart.product.push(productData)

      const newUser_cart = await User_cart.save()
      console.log("cart is saved")


      const addtoUser = await User.findByIdAndUpdate(req.session.userID, { cartId: newUser_cart._id }, { new: true })
      res.json({ message: "Product added" })
      return;
    }
  } catch (error) {
    console.log(error.message)
  }
}
// REMOVING FROMCART
const cart_remove = async (req, res) => {
  try {
    const productId = new ObjectId(req.body.id)
    console.log("productid" + productId)
    const cartid = req.body.cartid
    console.log("cartid" + cartid)
    const productdel = await cartHelper.productDelete(cartid, productId)
    if (productdel) {
      res.send({ message: "deleted" })
    } else {
      res.send({ message: "not deleted" })
    }
  } catch (error) {
    console.log(error.message)
  }
}

// CART PRODUCT INCREMENT
const product_increment = async (req, res) => {
  try {
    console.log(req.body)
    const productId = req.body.id
    console.log("productId" + productId)
    const quantity = parseInt(req.body.incQuantity)
    console.log(quantity)
    const userid = req.session.userID
    console.log(userid)

    // find cart 
    const user_cart = await cartdb.findOne({ userId: userid })
    const cart_product = user_cart.product.find(
      (product) => product.product_id.toString() === productId
    );

    if (cart_product) {
      const find_product = await product.findOne({ _id: req.body.id })
      console.log(find_product.quantity)
      if (quantity <= find_product.quantity) {
        // console.log("Found product in the cart: ", cart_product);
        cart_product.quantity = quantity
        await user_cart.save()
        console.log("Quantity updated successfully.");
      } else {
        req.flash("title","out of stock")
        res.redirect('/dashboard')
      }
    } else {
      console.log("Product not found in the cart.");

    }

  } catch (error) {
    console.log(error.message)
  }
}
// CART DECREMENT 
const product_decrement = async (req, res) => {
  try {
    console.log(req.body)
    const productid = req.body.id;

    const value = req.body.value
    const userid = req.session.userID

    // finding the cart 
    // const product_find = await product.findOne({ _id: req.body.id })
    const user_cart = await cartdb.findOne({ userId: userid })
    // console.log("decrement user_cart " + user_cart)
    const cart_product = user_cart.product.find((product) => product.product_id.toString() === productid)
    // console.log("cart_product " + cart_product)
    if (cart_product) {
      // const find_product = await product.findOne({_id:req.body.id})
      // console.log("find " + find_product)
      if (req.body.value > 0) {
        cart_product.quantity = req.body.value
        res.json({ message: "decrement", quantity: req.body.value })
        await user_cart.save()
        // console.log("quantity decresed")
      } else {
        console.log("no no")
      }
    } else {
      console.log("product not found in the cart")
    }
  } catch (error) {
    console.log(error.message)
  }
}
// coupon validating 

module.exports = {
  // get_cart,
  addtocart,
  cart_remove,
  product_increment,
  product_decrement,
 
}